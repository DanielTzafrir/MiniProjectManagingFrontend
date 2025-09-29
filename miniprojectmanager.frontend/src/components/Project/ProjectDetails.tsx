import React, { useEffect, useState } from "react";
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
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<TaskUpdateDto>({
    title: "",
    dueDate: "",
    isCompleted: false,
  });

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const data = await getProjectById(Number(id));
      setProject(data);
    } catch (err: any) {
      setError(err || "Failed to load project");
    }
  };

  const startEdit = (task: TaskDto) => {
    setEditingTaskId(task.id);
    setEditFormData({
      title: task.title,
      dueDate: task.dueDate,
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
    if (!validateEditForm()) return;
    try {
      await updateTask(taskId, editFormData);
      setEditingTaskId(null);
      fetchProject();
    } catch (err: any) {
      setError(err || "Failed to update task");
    }
  };

  const handleToggleComplete = async (taskId: number, isCompleted: boolean) => {
    try {
      await updateTask(taskId, { isCompleted: !isCompleted });
      fetchProject();
    } catch (err: any) {
      setError(err || "Failed to toggle task");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm("Delete task?")) return;
    try {
      await deleteTask(taskId);
      fetchProject();
    } catch (err: any) {
      setError(err || "Failed to delete task");
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <h2>{project.title}</h2>
      <p>{project.description}</p>
      <h3>Tasks</h3>
      <TaskForm projectId={project.id} onTaskAdded={fetchProject} />
      <ul>
        {project.tasks?.map((t) => (
          <li key={t.id}>
            {editingTaskId === t.id ? (
              <>
                <input
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditChange}
                />
                <input
                  name="dueDate"
                  type="date"
                  value={editFormData.dueDate || ""}
                  onChange={handleEditChange}
                />
                <button onClick={() => handleUpdate(t.id)}>Save</button>
                <button onClick={() => setEditingTaskId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={t.isCompleted}
                  onChange={() => handleToggleComplete(t.id, t.isCompleted)}
                />
                {t.title} {t.dueDate && `(Due: ${t.dueDate})`}
                <button onClick={() => startEdit(t)}>Edit</button>
                <button onClick={() => handleDeleteTask(t.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default ProjectDetails;
