import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import "./Notification.css"; // Import file CSS
import { FaDeleteLeft } from "react-icons/fa6";
import "sweetalert2/src/sweetalert2.scss";
import { showConfirm, showSuccess, showError } from "./swal.js";
import { API_BASE_URL } from "../Table/api.js";

function Notification({ setReloadTableData }) {
  const [notification, setNotification] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [reloadAPI, setReloadAPI] = useState(true);

  const accessToken = localStorage.getItem("access");
  const getInvitations = async () => {
    var response = await fetch(`${API_BASE_URL}/invitations/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    response = await fetch(`${API_BASE_URL}/myInvitations/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    data.push(...(await response.json()));
    return data;
  };

  const fetchApi = async () => {
    try {
      const data = await getInvitations();
      data.reverse().map((item) => {
        item.status === "PENDING"
          ? (item.isReplied = false)
          : (item.isReplied = true);
        return item;
      });
      setInvitations(data);
    } catch (error) {
      showError("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const handleShowNotification = () => {
    setNotification(!notification);
  };

  const editInvitation = async (item) => {
    await fetch(
      `${API_BASE_URL}/invitations/${item.id}/${item.status.toLowerCase()}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    setReloadAPI(!reloadAPI);
  };

  const handleReply = async (item, status) => {
    item.status = status;
    item.isReplied = true;
    if (status === "ACCEPT") {
      item.description = "Bạn đã chấp nhận lời mời";
      setTimeout(() => {
        setReloadTableData((prev) => !prev);
      }, 200);
    } else {
      item.description = "Bạn đã từ chối lời mời";
    }
    await editInvitation(item);
  };

  const deleteInvitation = async (invitationID) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/invitations/${invitationID}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (item) => {
    const response = await showConfirm("Bạn có muốn xóa không");
    if (response.isConfirmed) {
      await deleteInvitation(item.id)
        .then(() => showSuccess("Bạn đã xóa thành công"))
        .then(fetchApi());
      setReloadAPI(!reloadAPI);
    }
  };

  return (
    <div className="notification">
      <FontAwesomeIcon
        icon={faBell}
        onClick={handleShowNotification}
        className="notification-icon"
      />
      {notification && (
        <div className="notification-list">
          {invitations.map((item, index) => (
            <div className="notification-item" key={index}>
              <div className="notification-item-title">{item.title}</div>
              <div className="notification-item-context">{item.description}</div>
              {item.isReplied === false && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const status = e.nativeEvent.submitter.value;
                    handleReply(item, status);
                  }}
                >
                  <button type="submit" value="ACCEPT">
                    Chấp nhận
                  </button>
                  <button type="submit" value="REJECT">
                    Từ chối
                  </button>
                </form>
              )}
              <FaDeleteLeft
                className="notification-delete"
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(item);
                }}
                item={JSON.stringify(item)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notification;
