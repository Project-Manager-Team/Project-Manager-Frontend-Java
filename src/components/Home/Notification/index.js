import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import "./Notification.css";
import { FaDeleteLeft } from "react-icons/fa6";
import "sweetalert2/src/sweetalert2.scss";
import { showConfirm, showSuccess, showError } from "./swal.js";
import { API_BASE_URL } from "../Table/api.js";

function Notification({ setReloadTableData}) {
  const [notification, setNotification] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [reloadAPI, setReloadAPI] = useState(true);
  const notificationRef = useRef(null);

  const accessToken = localStorage.getItem("access");
  const getInvitations = async () => {
    const response = await fetch(`${API_BASE_URL}/invitation/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    return data;
  };

  const fetchApi = async () => {
    try {
      const data = await getInvitations();
      data.reverse().map((item) => {
        if (item.status === null) item.isReplied = false;
        else item.isReplied = true;
        return item;
      });
      setInvitations(data);
    } catch (error) {
      showError("Failed to fetch data");
    }
    
  };

  useEffect(() => {
    fetchApi();
  }, [setReloadTableData]);

  const handleShowNotification = () => {
    setNotification(!notification);
  };

  const editInvitation = async (item, invitationID) => {
    await fetch(`${API_BASE_URL}/invitation/${invitationID}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(item),
    });
    setReloadAPI(!reloadAPI);
  };

  const handleReply = async (item, status) => {
    item.status = status;
    item.isReplied = true;
    if (status === true) {
      item.context = "Bạn đã chấp nhận lời mời";
      setTimeout(() => {
        setReloadTableData((prev) => !prev);
      }, 200);
      
    } else {
      item.context = "Bạn đã từ chối lời mời";
    }
    await editInvitation(item, item.id);
  };

  const deleteInvitation = async (invitationID) => {
    try {
      const response = await fetch(`${API_BASE_URL}/invitation/${invitationID}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("delete xong");
      setReloadAPI(!reloadAPI);
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
      await deleteInvitation(item.id).then(() =>
        showSuccess("Bạn đã xóa thành công")
      );
    }
  };

  const handleClickOutside = (event) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setNotification(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);  

  return (
    <div className="notification" ref = {notificationRef}>
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
              <div className="notification-item-context">{item.context}</div>
              {item.isReplied === false && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const status = JSON.parse(e.nativeEvent.submitter.value);
                    handleReply(item, status);
                  }}
                >
                  <button type="submit" value={true}>
                    Chấp nhận
                  </button>
                  <button type="submit" value={false}>
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
