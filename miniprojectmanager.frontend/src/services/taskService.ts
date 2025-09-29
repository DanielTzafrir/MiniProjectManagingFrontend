import api from "./api";
import { TaskCreateDto, TaskDto, TaskUpdateDto } from "../types/task";

export const createTask = async (
  projectId: number,
  data: TaskCreateDto
): Promise<TaskDto> => {
  const response = await api.post(`/projects/${projectId}/tasks`, data);
  return response.data;
};

export const updateTask = async (
  taskId: number,
  data: TaskUpdateDto
): Promise<TaskDto> => {
  const response = await api.put(`/tasks/${taskId}`, data);
  return response.data;
};

export const deleteTask = async (taskId: number) => {
  await api.delete(`/tasks/${taskId}`);
};
