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
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!formData.title) {
      setError("Title required");
      return;
    }
    setIsLoading(true);
    try {
      await createTask(projectId, formData);
      setFormData({ title: "", dueDate: "" });
      setSuccess("Task added successfully");
      onTaskAdded();
    } catch (err: any) {
      const status = err.response?.status;
      const apiMessage =
        err.response?.data?.Message || err.message || "Failed to add task";
      if (status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        setError("Session expired - please log in again");
      } else if (status === 404) {
        setError("Project not found - ensure it exists and is yours");
      } else {
        setError(apiMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .task-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin: 20px 0;
        }
        .task-form input, .task-form button {
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          min-height: 44px;
          box-sizing: border-box;
          color: #333;
        }
        .task-form input::placeholder {
          color: #aaa;
        }
        .task-form button {
          background-color: #ddd;
          cursor: pointer;
        }
        .task-form button:hover {
          background-color: #ccc;
        }
        .success-message {
          color: green;
          margin-top: 10px;
        }
        @media (min-width: 768px) {
          .task-form {
            flex-direction: row;
            align-items: center;
            gap: 10px;
          }
          .task-form input {
            flex: 1;
          }
          .task-form button {
            flex: 0 0 100px;
          }
        }
      `}</style>
      <form onSubmit={handleSubmit} className="task-form">
        {isLoading && <div>Loading...</div>}
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Task Title"
          disabled={isLoading}
        />
        <input
          name="dueDate"
          type="datetime-local"
          value={formData.dueDate}
          onChange={handleChange}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Add Task
        </button>
      </form>
      {error && <ErrorMessage message={error} />}
      {success && <div className="success-message">{success}</div>}
    </>
  );
};

export default TaskForm;
