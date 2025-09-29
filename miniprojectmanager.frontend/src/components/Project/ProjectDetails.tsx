import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectById } from "../../services/projectService";
import { ProjectDto } from "../../types/project";
import TaskForm from "./TaskForm";
import { updateTask, deleteTask } from "../../services/taskService";
import { TaskUpdateDto } from "../../types/task";
import ErrorMessage from "../Common/ErrorMessage";

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDto | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const data = await getProjectById(Number(id));
      setProject(data);
    } catch (err) {
      setError("Failed to load project");
    }
  };

  const handleToggleComplete = async (taskId: number, isCompleted: boolean) => {
    try {
      const updateData: TaskUpdateDto = { isCompleted: !isCompleted };
      await updateTask(taskId, updateData);
      fetchProject();
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      fetchProject();
    } catch (err) {
      setError("Failed to delete task");
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
            <input
              type="checkbox"
              checked={t.isCompleted}
              onChange={() => handleToggleComplete(t.id, t.isCompleted)}
            />
            {t.title} {t.dueDate && `(Due: ${t.dueDate})`}
            <button onClick={() => handleDeleteTask(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default ProjectDetails;
