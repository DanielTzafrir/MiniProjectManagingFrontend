import React, { useState } from "react";
import { createTask } from "../../services/taskService";
import { TaskCreateDto } from "../../types/task";
import ErrorMessage from "../Common/ErrorMessage";

interface TaskFormProps {
  projectId: number;
  onTaskAdded: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ projectId, onTaskAdded }) => {
  const [formData, setFormData] = useState<TaskCreateDto>({
    title: "",
    dueDate: "",
  });
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      setError("Title required");
      return;
    }
    try {
      await createTask(projectId, formData);
      setFormData({ title: "", dueDate: "" });
      onTaskAdded();
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login"; // Redirect here instead of interceptor
        setError("Session expired - please log in again");
      } else if (err.response?.status === 404) {
        setError("Project not found - ensure it exists and is yours");
      } else {
        const errorMessage =
          typeof err.message === "string"
            ? err.message
            : err.message?.Message ||
              JSON.stringify(err.message) ||
              "Failed to add task";
        setError(errorMessage);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Task Title"
      />
      <input
        name="dueDate"
        type="date"
        value={formData.dueDate}
        onChange={handleChange}
      />
      <button type="submit">Add Task</button>
      {error && <ErrorMessage message={error} />}
    </form>
  );
};

export default TaskForm;
