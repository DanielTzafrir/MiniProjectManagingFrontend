import { TaskDto } from "./task";

export interface ProjectDto {
  id: number;
  title: string;
  description: string;
  creationDate: string;
  tasks?: TaskDto[];
}

export interface ProjectCreateDto {
  title: string;
  description?: string;
}
