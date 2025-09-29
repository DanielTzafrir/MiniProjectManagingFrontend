export interface TaskDto {
  id: number;
  title: string;
  dueDate?: string;
  isCompleted: boolean;
  projectId: number;
}

export interface TaskCreateDto {
  title: string;
  dueDate?: string;
}

export interface TaskUpdateDto {
  title?: string;
  dueDate?: string;
  isCompleted: boolean;
}
