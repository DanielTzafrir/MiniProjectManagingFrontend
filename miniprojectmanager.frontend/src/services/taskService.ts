import api from "./api";
import { TaskCreateDto, TaskDto, TaskUpdateDto } from "../types/task";

export const createTask = async (
  projectId: number,
  data: TaskCreateDto
): Promise<TaskDto> => {
  const submitData = { ...data };
  if (submitData.dueDate) {
    submitData.dueDate = new Date(submitData.dueDate).toISOString();
  } else {
    delete submitData.dueDate;
  }
  const response = await api.post(`/projects/${projectId}/tasks`, submitData);
  return response.data;
};

export const updateTask = async (
  taskId: number,
  data: TaskUpdateDto
): Promise<TaskDto> => {
  const submitData = { ...data };
  if (submitData.dueDate) {
    submitData.dueDate = new Date(submitData.dueDate).toISOString();
  } else {
    delete submitData.dueDate;
  }
  const response = await api.put(`/projects/tasks/${taskId}`, submitData);
  return response.data;
};

export const deleteTask = async (taskId: number) => {
  await api.delete(`/projects/tasks/${taskId}`);
};
