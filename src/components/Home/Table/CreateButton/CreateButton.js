// CreateProjectButton.js
import React from "react";
import style from "./CreateButton.module.css";
function CreateProjectButton({
  isEditing,
  projects,
  handleCreateItem,
  handleCreateTempItem,
}) {
  
  if (isEditing) return <></>;

  return (
    <>
      {projects.length > 0 &&
      projects[projects.length - 1].isDisabled === false ? (
        <button className={style.button} onClick={handleCreateItem}>Lưu</button>
      ) : (
        <button className={style.button} onClick={handleCreateTempItem}>Thêm</button>
      )}
    </>
  );
}

export default CreateProjectButton;
