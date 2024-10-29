import React, { useState } from "react";
import styles from "./History.module.css";

const HistoryBar = ({ history, setHistory }) => {
  const [showMore, setShowMore] = useState(false);
  const maxVisibleIcons = 0;

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

      {history.length > 1 && (
        <>
          {history.slice(1, maxVisibleIcons + 1).map((item, index) => (
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

          {history.length > maxVisibleIcons + 1 && (
            <>
              <span className={styles.arrow}>➔</span>
              <button
                className={styles.historyButton}
                onClick={() => {
                  setShowMore(!showMore);
                }}
              >
                <span className={styles.icon}>…</span>
                {showMore ? "Ẩn" : `${history.length - maxVisibleIcons - 1} More`}
              </button>
            </>
          )}

          {showMore &&
            history.slice(maxVisibleIcons + 1).map((item, index) => (
              <React.Fragment key={item.id}>
                <span className={styles.arrow}>➔</span>
                <button
                  className={styles.historyButton}
                  onClick={() => {
                    handleHistory(index + maxVisibleIcons + 1);
                  }}
                >
                  <span className={styles.icon}>📁</span>
                  {item.title}
                </button>
              </React.Fragment>
            ))}
        </>
      )}
    </div>
  );
};

export default HistoryBar;
