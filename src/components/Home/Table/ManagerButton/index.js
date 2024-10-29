import React, { useState } from "react";
import Modal from "react-modal";
import "./ManagerButton.module.css";
import { showSuccess, showError } from "../swal";
import { MdCancel } from "react-icons/md";
import { API_BASE_URL } from "../api";
import { RiUserAddFill } from "react-icons/ri";
import styles from './ManagerButton.module.css'

Modal.setAppElement("#root");

function Manager({ item }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
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
      await invitation(
        accessToken,
        `${API_BASE_URL}/invitation/`
      );
      await showSuccess("Gửi lời mời thành công");
    } catch (error) {
      await showError("Gửi lời mời thất bại");
    }
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={openModal} className={styles.button__add}>
        <RiUserAddFill />
      </button>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className={styles.modal}
        overlayClassName={styles.overlay}
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
              <input type="text" name="username" onChange={handleChange} />
            </td>
          </tr>
        </tbody>
      </table>
      <button className="add" onClick={handleInvitation}>Thêm</button>
      <MdCancel onClick={closeModal} className="button__cancel" />
      </Modal>
    </div>
  );
}

export default Manager;
