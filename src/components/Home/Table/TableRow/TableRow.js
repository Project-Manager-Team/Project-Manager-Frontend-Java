import React from "react";
import { useState, useEffect } from "react";
import ChildProjectButton from "../ChildProjectButton/ChildProjectButton";
import EditButton from "../EditButton/EditButton";
import DeleteButton from "../DeleteButton/DeleteButton";
import style from "./TableRow.module.css"; // Chúng ta sẽ tạo file CSS riêng cho ProjectItem
import Manager from "../ManagerButton";
import { API_BASE_URL } from "../../Table/api";

function formatDatetimeForInput(datetimeString) {
  if (datetimeString === null) {
    return null;
  }
  const date = new Date(datetimeString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function ProjectItem({
  item,
  handleEditValue,
  handleEditItem,
  handleSaveItem,
  editingValue,
  isEditing,
  accessToken,
  setHistory,
  setReloadTableData,
}) {
  const [isFinished, setIsFinished] = useState(null);

  const handleCheckboxChange = async () => {
    const newFinishedState = !isFinished;
    setIsFinished(newFinishedState);
    await handleFinishProject(newFinishedState);
  };

  useEffect(() => {
    setIsFinished(item.progress === 100);
  }, [item.progress]);

  const handleFinishProject = async () => {
    const url = `${API_BASE_URL}/project/${item.id}/`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        progress: isFinished ? 0 : 100,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    setReloadTableData((prev) => !prev);
  };

  if (isEditing && editingValue.id === item.id) {
    item = editingValue;
    item.isDisabled = false;
    item.isEditing = true;
  }

  return (
    <tr className={style.projectRow}>
      <td className={style.projectCell}>
        <ChildProjectButton item={item} setHistory={setHistory} />
      </td>
      <td className={style.projectCell}>
        <input
          value={item.title}
          disabled={item.isDisabled}
          onChange={handleEditValue}
          name="title"
          placeholder="Tiêu đề"
        />
      </td>
      <td className={style.projectCell}>
        <textarea
          rows={1}
          value={item.description}
          disabled={item.isDisabled}
          onChange={handleEditValue}
          name="description"
          placeholder="Nội dung"
        />
      </td>
      <td className={style.projectCell}>
        <input
          type="datetime-local"
          value={formatDatetimeForInput(item.time_start)}
          disabled={item.isDisabled}
          onChange={handleEditValue}
          name="time_start"
        />
      </td>
      <td className={style.projectCell}>
        <input
          type="datetime-local"
          value={formatDatetimeForInput(item.time_end)}
          disabled={item.isDisabled}
          onChange={handleEditValue}
          name="time_end"
        />
      </td>
      <td className={style.projectCell}>
        {item.type === "project" ? (
          <div className={style.progressContainer}>
            <div
              className={style.progressBar}
              style={{ width: `${item.progress}%`, height: "20px" }}
            >
              {item.progress}%
            </div>
          </div>
        ) : (
          <label className={style.customCheckbox}>
            <input
              type="checkbox"
              className={style.hiddenCheckbox}
              checked={isFinished}
              onChange={handleCheckboxChange}
            />
            <span className={style.customCheckbox}></span>
          </label>
        )}
      </td>
      <td>
        <Manager item={item} />
      </td>
      <td className={style.actionButtons}>
        <EditButton
          item={item}
          handleEditItem={handleEditItem}
          handleSaveItem={handleSaveItem}
        />
        <DeleteButton
          projectID={item.id}
          accessToken={accessToken}
          setReloadTableData={setReloadTableData}
        />
      </td>
    </tr>
  );
}

export default ProjectItem;
