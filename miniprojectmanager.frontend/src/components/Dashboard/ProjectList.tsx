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

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err: any) {
      setError(err.response?.data?.Message || "Failed to load projects");
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
    if (!validateForm()) return;
    try {
      await createProject(newProject);
      setNewProject({ title: "", description: "" });
      fetchProjects();
    } catch (err: any) {
      setError(err.response?.data?.Message || "Failed to create project");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete project?")) return;
    try {
      await deleteProject(id);
      fetchProjects();
    } catch (err: any) {
      setError(err.response?.data?.Message || "Failed to delete project");
    }
  };

  return (
    <div>
      <h2>Dashboard - Projects</h2>
      <input
        name="title"
        value={newProject.title}
        onChange={handleChange}
        placeholder="Title"
      />
      <textarea
        name="description"
        value={newProject.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <button onClick={handleCreate}>Create Project</button>
      {error && <ErrorMessage message={error} />}
      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <Link to={`/project/${p.id}`}>{p.title}</Link>
            <button onClick={() => handleDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
