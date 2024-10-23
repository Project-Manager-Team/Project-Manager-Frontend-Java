import React from "react";
import style from "./EditButton.module.css";
import { MdEditNote } from "react-icons/md";
import { FaSave } from "react-icons/fa";

function EditButton({ item, handleEditItem, handleSaveItem }) {
  if (item.isEditing === false) {
    return (
      <button className={style.button} onClick={() => handleEditItem(item)}>
        <MdEditNote />
      </button>
    );
  } else {
    return (
      <button className={style.button} onClick={() => handleSaveItem(item.id)}>
        <FaSave />
      </button>
    );
  }
}

export default EditButton;
