import React from "react";
import style from "./DeleteButton.module.css";
import { deleteProject, API_BASE_URL } from "../api";
import { showConfirm, showSuccess, showError } from "../swal";
import { AiOutlineDelete } from "react-icons/ai";

function DeleteButton({ projectID, accessToken, setReloadTableData }) {
  const handleDeleteItem = async () => {
    const result = await showConfirm(
      "Are you sure you want to delete this project?"
    );
    if (result.isConfirmed) {
      try {
        await deleteProject(
          accessToken,
          `${API_BASE_URL}/project/${projectID}/`
        );
        await showSuccess("Deleted project successfully");
      } catch (error) {
        await showError("Failed to delete project");
      }
      setReloadTableData((prev) => !prev);
    }
  };

  return (
    <button className={style.button} onClick={() => handleDeleteItem()}>
      <AiOutlineDelete/>
    </button>
  );
}

export default DeleteButton;
