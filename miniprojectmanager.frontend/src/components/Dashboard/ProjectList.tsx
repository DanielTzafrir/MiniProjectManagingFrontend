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
    } catch (err) {
      setError("Failed to load projects");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    if (!newProject.title || newProject.title.length < 3) {
      setError("Title required (3-100 chars)");
      return;
    }
    try {
      await createProject(newProject);
      setNewProject({ title: "", description: "" });
      fetchProjects();
    } catch (err) {
      setError("Failed to create project");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProject(id);
      fetchProjects();
    } catch (err) {
      setError("Failed to delete project");
    }
  };

  return (
    <div>
      <h2>Projects</h2>
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
