// History.js
import React from "react";
import styles from "./History.module.css";

const HistoryBar = ({ history, setHistory, setReloadTableData }) => {
  const handleHistory = (index) => {
    setHistory(history.slice(0, index + 1));
  };

  return (
    <div className={styles.historyContainer}>
      <button
        onClick={() => handleHistory(0)}
        className={`${styles.historyButton} ${styles.homeButton}`}
      >
        <span className={styles.icon}>🏠</span>
      </button>

      {history.slice(1).map((item, index) => (
        <React.Fragment key={item.id}>
          <span className={styles.arrow}>➔</span>
          <button
            className={styles.historyButton}
            onClick={() => {
              handleHistory(index + 1);
            }}
          >
            <span className={styles.icon}>📁</span>
            {item.title}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default HistoryBar;
