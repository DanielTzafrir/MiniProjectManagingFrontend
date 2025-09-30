import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getProjectById } from "../../services/projectService";
import { ProjectDto } from "../../types/project";
import TaskForm from "./TaskForm";
import { updateTask, deleteTask } from "../../services/taskService";
import { TaskUpdateDto } from "../../types/task";
import ErrorMessage from "../Common/ErrorMessage";
import { TaskDto } from "../../types/task";

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDto | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<TaskUpdateDto>({
    title: "",
    dueDate: "",
    isCompleted: false,
  });
  const [filter, setFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("title");

  const fetchProject = useCallback(async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const data = await getProjectById(Number(id));
      setProject(data);
    } catch (err: any) {
      setError(err.response?.data?.Message || "Failed to load project");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const startEdit = (task: TaskDto) => {
    setEditingTaskId(task.id);
    const formattedDueDate = task.dueDate
      ? new Date(task.dueDate).toISOString().slice(0, 16)
      : "";
    setEditFormData({
      title: task.title,
      dueDate: formattedDueDate,
      isCompleted: task.isCompleted,
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const validateEditForm = () => {
    if (!editFormData.title) {
      setError("Title required for update");
      return false;
    }
    return true;
  };

  const handleUpdate = async (taskId: number) => {
    setError("");
    setSuccess("");
    if (!validateEditForm()) return;
    setIsLoading(true);
    try {
      await updateTask(taskId, editFormData);
      setEditingTaskId(null);
      await fetchProject();
      setSuccess("Task updated successfully");
    } catch (err: any) {
      setError(err.response?.data?.Message || "Failed to update task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = async (taskId: number, isCompleted: boolean) => {
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      await updateTask(taskId, { isCompleted: !isCompleted });
      await fetchProject();
      setSuccess("Task status updated");
    } catch (err: any) {
      setError(err.response?.data?.Message || "Failed to toggle task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm("Delete task?")) return;
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      await deleteTask(taskId);
      await fetchProject();
      setSuccess("Task deleted successfully");
    } catch (err: any) {
      setError(err.response?.data?.Message || "Failed to delete task");
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredAndSortedTasks = () => {
    if (!project?.tasks) return [];
    let tasks = [...project.tasks];
    if (filter) {
      tasks = tasks.filter((t) =>
        t.title.toLowerCase().includes(filter.toLowerCase())
      );
    }
    tasks.sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "dueDate")
        return (a.dueDate ? new Date(a.dueDate) : new Date(0)) >
          (b.dueDate ? new Date(b.dueDate) : new Date(0))
          ? 1
          : -1;
      if (sortBy === "completed")
        return a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1;
      return 0;
    });
    return tasks;
  };

  if (!project || isLoading) return <div>Loading...</div>;

  return (
    <>
      <style>{`
        .project-details {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .filter-sort {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        .filter-sort input, .filter-sort select {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          flex: 1;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          gap: 10px;
        }
        input[type="checkbox"] {
          margin-right: 10px;
        }
        button {
          padding: 5px 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: #ddd;
          cursor: pointer;
        }
        button:hover {
          background: #ccc;
        }
        .edit-form {
          display: flex;
          gap: 10px;
          width: 100%;
        }
        .edit-form input {
          flex: 1;
          padding: 5px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .success-message {
          color: green;
          margin-top: 10px;
        }
        @media (max-width: 600px) {
          li, .edit-form {
            flex-direction: column;
            align-items: flex-start;
          }
          .filter-sort {
            flex-direction: column;
          }
        }
      `}</style>
      <div className="project-details">
        <h2>{project.title}</h2>
        <p>{project.description}</p>
        <h3>Tasks</h3>
        <TaskForm projectId={project.id} onTaskAdded={fetchProject} />
        <div className="filter-sort">
          <input
            placeholder="Filter by title"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="title">Sort by Title</option>
            <option value="dueDate">Sort by Due Date</option>
            <option value="completed">Sort by Completed</option>
          </select>
        </div>
        <ul>
          {getFilteredAndSortedTasks().map((t) => (
            <li key={t.id}>
              {editingTaskId === t.id ? (
                <div className="edit-form">
                  <input
                    name="title"
                    value={editFormData.title}
                    onChange={handleEditChange}
                    disabled={isLoading}
                  />
                  <input
                    name="dueDate"
                    type="datetime-local"
                    value={editFormData.dueDate}
                    onChange={handleEditChange}
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => handleUpdate(t.id)}
                    disabled={isLoading}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingTaskId(null)}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="checkbox"
                    checked={t.isCompleted}
                    onChange={() => handleToggleComplete(t.id, t.isCompleted)}
                    disabled={isLoading}
                  />
                  {t.title}{" "}
                  {t.dueDate &&
                    `(Due: ${new Date(t.dueDate).toLocaleString()})`}
                  <button onClick={() => startEdit(t)} disabled={isLoading}>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(t.id)}
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
        {error && <ErrorMessage message={error} />}
        {success && <div className="success-message">{success}</div>}
      </div>
    </>
  );
};

export default ProjectDetails;
