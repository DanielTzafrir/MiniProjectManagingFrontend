import React, { useState } from "react";
import { login } from "../../services/authService";
import { LoginDto } from "../../types/auth";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../Common/ErrorMessage";

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginDto>({
    userName: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userName || !formData.password) {
      setError("All fields are required");
      return;
    }
    try {
      await login(formData);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="userName"
        value={formData.userName}
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit">Login</button>
      {error && <ErrorMessage message={error} />}
    </form>
  );
};

export default Login;
