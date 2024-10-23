import { useState } from "react";
import Notification from "../../components/Home/Notification";
import HistoryBar from "../../components/Home/HistoryBar";
import Table from "../../components/Home/Table/Table";
import Avatar from "../../components/Home/Avatar";
import styles from "./index.module.css";
import { API_BASE_URL } from "../../components/Home/Table/api";
function Home() {
  const [reloadTableData, setReloadTableData] = useState(false);
  const [history, setHistory] = useState([
    {
      url: `${API_BASE_URL}/project/personal/`,
      title: "Home",
    },
  ]);

  return (
    <div className={styles.homeContainer}>
      <div className={styles.historyWrapper}>
        <HistoryBar
          setReloadTableData={setReloadTableData}
          history={history}
          setHistory={setHistory}
        />
        <div className={styles.notificationWrapper}>
          <Notification setReloadTableData={setReloadTableData} />
        </div>
        <div className={styles.avatarWrapper}>
          <Avatar />
        </div>
      </div>
      <div className={styles.tableWrapper}>
        <Table
          reloadTableData={reloadTableData}
          setReloadTableData={setReloadTableData}
          API_BASE_URL={API_BASE_URL}
          setHistory={setHistory}
          current={history[history.length - 1]}
        />
      </div>
    </div>
  );
}

export default Home;
