import React from "react";
import styles from "./ChildProjectButton.module.css";
import { MdOutlineTask } from "react-icons/md";
import { GrTask } from "react-icons/gr";
import { showError } from "../swal";
import { API_BASE_URL } from "../api";

function ChildProjectButton({ item, setHistory }) {
  const handleChildItem = async () => {
    try {
      setHistory((prev) => [
        ...prev,
        {
          id: item.id,
          name: item.name,
          url: `${API_BASE_URL}/projects/${item.id}/subprojects/`,
        },
      ]);
    } catch (error) {
      await showError("Failed to fetch child projects");
    }
  };

  return (
    <button className={styles.button} onClick={handleChildItem}>
      {item.type === "TASK" ? <MdOutlineTask /> : <GrTask />}
    </button>
  );
}

export default ChildProjectButton;
