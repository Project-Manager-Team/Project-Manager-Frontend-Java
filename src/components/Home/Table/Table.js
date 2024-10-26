import React, { useEffect, useState, useCallback } from "react";
import style from "./Table.module.css";
import "sweetalert2/src/sweetalert2.scss";
import ProjectItem from "./TableRow/TableRow";
import CreateProjectButton from "./CreateButton/CreateButton";
import {
  putProject,
  getListProject,
  createProject,
  API_BASE_URL,
} from "./api";
import { showSuccess, showError } from "./swal";

const accessToken = localStorage.getItem("access");

function Table({ setReloadTableData, setHistory, current, reloadTableData }) {
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingValue, setEditingValue] = useState({});

  const getAndSetProject = useCallback(async (url) => {
    try {
      const data = await getListProject(accessToken, url);
      const sortedProjects = data
        .filter((project) => project.type !== "ROOT")
        .sort((a, b) => a.id - b.id)
        .map((item, index) => ({
          ...item,
          isDisabled: true,
          index: index + 1,
          isCreating: false,
          isEditing: false,
        }));
      setProjects(sortedProjects);
      const root = data.find((project) => project.type === "ROOT"); 
      return root;
    } catch (error) {
      await showError("Failed to fetch data");
      return [];
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const root = await getAndSetProject(current.url);
        if (root != [] && root != undefined)
          current.id = root.id;
      } catch (error) {
        await showError("Failed to initial data");
      }
    };

    fetchInitialData();
  }, [getAndSetProject, reloadTableData, current]);

  const handleEditValue = useCallback((e) => {
    const { name, value } = e.target;
    setEditingValue((prev) => ({ ...prev, [name]: value }));
  }, []);

  const refreshProjectList = useCallback(async () => {
    await getAndSetProject(current.url);
  }, [getAndSetProject, current]);

  const editProject = useCallback(
    async (projectID) => {
      try {
        await putProject(
          accessToken,
          `${API_BASE_URL}/projects/${projectID}/`,
          editingValue
        );
        await showSuccess("Updated project successfully");
        await refreshProjectList();
      } catch (error) {
        await showError("Failed to update project");
      }
    },
    [editingValue, refreshProjectList]
  );

  const handleEditItem = useCallback((item) => {
    setProjects((prevProjects) => {
      const newProjects = [...prevProjects];
      newProjects[item.index - 1] = {
        ...newProjects[item.index - 1],
        isDisabled: false,
        isEditing: true,
      };
      return newProjects;
    });
    setIsEditing(true);
    setEditingValue(item);
    
  }, []);

  const handleSaveItem = useCallback(
    async (projectID) => {
      try {
        await editProject(projectID);
        setIsEditing(false);
      } catch (error) {
        await showError("Failed to save project");
      }
    },
    [editProject]
  );
  const handleCreateTempItem = useCallback((e) => {
    setProjects((prevProjects) => [
      ...prevProjects,
      {
        index: prevProjects.length + 1,
        name: null,
        description: null,
        time_start: null,
        deadline: null,
        isDisabled: false,
        isCreating: true,
      },
    ]);
    setEditingValue({});
  }, []);

  const handleCreateItem = useCallback(async () => {

    try {
      await createProject(accessToken, `${API_BASE_URL}/projects/${current.id}/subprojects/`, editingValue);
      await showSuccess("Created project successfully");
      setEditingValue({});
      await refreshProjectList();
    } catch (error) {
      await showError("Failed to create project");
    }
  }, [editingValue, refreshProjectList, current]);

  return (
    <div>
      <table className={style.table}>
        <thead className={style.tableHead}>
          <tr className={style.tableRow}>
            <th className={style.th}>Loại</th>
            <th className={style.th}>Tiêu đề</th>
            <th className={style.th}>Nội dung</th>
            <th className={style.th}>Bắt đầu</th>
            <th className={style.th}>Kết thúc</th>
            <th className={style.th}>Tiến trình</th>
            <th className={style.th}>Quản lý</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((item) => (
            <ProjectItem
              key={item.index}
              item={item}
              handleEditValue={handleEditValue}
              handleEditItem={handleEditItem}
              handleSaveItem={handleSaveItem}
              editingValue={editingValue}
              isEditing={isEditing}
              accessToken={accessToken}
              setHistory={setHistory}
              setReloadTableData={setReloadTableData}
            />
          ))}
          <tr>
            <td colSpan={7}>
              <div className={style.wrapperButtonCreate}>
                <CreateProjectButton
                  isEditing={isEditing}
                  projects={projects}
                  handleCreateItem={handleCreateItem}
                  handleCreateTempItem={handleCreateTempItem}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Table;
