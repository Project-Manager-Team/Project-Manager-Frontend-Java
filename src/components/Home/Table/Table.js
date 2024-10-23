import React, { useEffect, useState, useCallback } from "react";
import style from "./Table.module.css";
import "sweetalert2/src/sweetalert2.scss";
import ProjectItem from "./TableRow/TableRow";
import CreateProjectButton from "./CreateButton/CreateButton";
import {
  updateProject,
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
        .filter((project) => project.type !== "personal")
        .sort((a, b) => a.id - b.id)
        .map((item, index) => ({
          ...item,
          isDisabled: true,
          index: index + 1,
          isCreating: false,
          isEditing: false,
        }));
      setProjects(sortedProjects);
      return data;
    } catch (error) {
      await showError("Failed to fetch data");
      return [];
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await getAndSetProject(current.url);
      } catch (error) {
        await showError("Failed to fetch data");
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
        await updateProject(
          accessToken,
          `${API_BASE_URL}/project/${projectID}/`,
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

  const handleCreateItem = useCallback(async () => {
    const newProject = {
      ...editingValue,
      parent_id: current.id || null,
    };

    try {
      await createProject(accessToken, `${API_BASE_URL}/project/`, newProject);
      await showSuccess("Created project successfully");
      setEditingValue({});
      await refreshProjectList();
    } catch (error) {
      await showError("Failed to create project");
    }
  }, [editingValue, refreshProjectList, current]);

  const handleCreateTempItem = useCallback((e) => {
    setProjects((prevProjects) => [
      ...prevProjects,
      {
        index: prevProjects.length + 1,
        title: null,
        description: null,
        type: 'task',
        time_start: null,
        time_end: null,
        isDisabled: false,
        isCreating: true,
      },
    ]);
    setEditingValue({});
  }, []);
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
