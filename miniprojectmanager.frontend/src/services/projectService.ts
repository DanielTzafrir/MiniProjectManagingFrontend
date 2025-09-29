import api from "./api";
import { ProjectCreateDto, ProjectDto } from "../types/project";

export const getProjects = async (): Promise<ProjectDto[]> => {
  const response = await api.get("/projects");
  return response.data;
};

export const createProject = async (
  data: ProjectCreateDto
): Promise<ProjectDto> => {
  const response = await api.post("/projects", data);
  return response.data;
};

export const getProjectById = async (id: number): Promise<ProjectDto> => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const deleteProject = async (id: number) => {
  await api.delete(`/projects/${id}`);
};
