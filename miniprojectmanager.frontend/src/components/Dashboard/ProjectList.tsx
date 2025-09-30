import React, { useEffect, useState } from "react";
import {
  getProjects,
  createProject,
  deleteProject,
} from "../../services/projectService";
import { ProjectDto, ProjectCreateDto } from "../../types/project";
import { Link } from "react-router-dom";
import ErrorMessage from "../Common/ErrorMessage";

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [newProject, setNewProject] = useState<ProjectCreateDto>({
    title: "",
    description: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err: any) {
      setError(err.response?.data?.Message || "Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (
      !newProject.title ||
      newProject.title.length < 3 ||
      newProject.title.length > 100
    ) {
      setError("Title must be 3-100 characters");
      return false;
    }
    if (newProject.description && newProject.description.length > 500) {
      setError("Description max 500 characters");
      return false;
    }
    return true;
  };

  const handleCreate = async () => {
    setError("");
    setSuccess("");
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await createProject(newProject);
      setNewProject({ title: "", description: "" });
      await fetchProjects();
      setSuccess("Project created successfully");
    } catch (err: any) {
      setError(err.response?.data?.Message || "Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete project?")) return;
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      await deleteProject(id);
      await fetchProjects();
      setSuccess("Project deleted successfully");
    } catch (err: any) {
      setError(err.response?.data?.Message || "Failed to delete project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Dashboard - Projects</h2>
      {isLoading && <div>Loading...</div>}{" "}
      <input
        name="title"
        value={newProject.title}
        onChange={handleChange}
        placeholder="Title"
        disabled={isLoading}
      />
      <textarea
        name="description"
        value={newProject.description}
        onChange={handleChange}
        placeholder="Description"
        disabled={isLoading}
      />
      <button onClick={handleCreate} disabled={isLoading}>
        Create Project
      </button>
      {error && <ErrorMessage message={error} />}
      {success && <div style={{ color: "green" }}>{success}</div>}{" "}
      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <Link to={`/project/${p.id}`}>{p.title}</Link>
            <button onClick={() => handleDelete(p.id)} disabled={isLoading}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
