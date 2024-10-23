import React, { useState } from "react";
import Modal from "react-modal";
import "./ManagerButton.module.css";
import { showSuccess, showError } from "../swal";
import { MdCancel } from "react-icons/md";
import { API_BASE_URL } from "../api";
import { RiUserAddFill } from "react-icons/ri";
import styles from "./ManagerButton.module.css";
// Đặt gốc của ứng dụng để Modal có thể hoạt động
Modal.setAppElement("#root");

function Manager({ item }) {
  const [isOpen, setIsOpen] = useState(false);

  // Hàm để mở Modal
  const openModal = () => {
    setIsOpen(true);
  };

  // Hàm để đóng Modal
  const closeModal = () => {
    setIsOpen(false);
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "10px",
      width: "auto",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
    },
  };

  const [data, setData] = useState({
    title: "",
    context: "",
    username: "",
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const accessToken = localStorage.getItem("access");
  const invitation = async (accessToken, url) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        ...data,
        project: item.id,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create project");
    }

    return await response.json();
  };

  const handleInvitation = async () => {
    try {
      await invitation(accessToken, `${API_BASE_URL}/invitation/`);
      await showSuccess("Gửi lời mời thành công");
    } catch (error) {
      await showError("Gửi lời mời thất bại");
    }
    setIsOpen(false);
  };

  return (
    <>
      {item.manager_name == null ? (
        <div>
          <button onClick={openModal} className={styles.button__add}>
            <RiUserAddFill />
          </button>
          <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Example Modal"
            style={customStyles}
          >
            <table className="manager">
              <tbody>
                <tr>
                  <th>Title</th>
                  <td>
                    <input type="text" name="title" onChange={handleChange} />
                  </td>
                </tr>
                <tr>
                  <th>Context</th>
                  <td>
                    <input type="text" name="context" onChange={handleChange} />
                  </td>
                </tr>
                <tr>
                  <th>Receiver</th>
                  <td>
                    <input
                      type="text"
                      name="username"
                      onChange={handleChange}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <button onClick={handleInvitation}>Thêm</button>
            <MdCancel onClick={closeModal} className="button__cancel" />
          </Modal>
        </div>
      ) : (
        <>{item.manager_name}</>
      )}
    </>
  );
}

export default Manager;
