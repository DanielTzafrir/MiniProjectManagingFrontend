import React, { useState } from "react";
import { login } from "../../services/authService";
import { LoginDto } from "../../types/auth";
import { useNavigate, Link } from "react-router-dom";
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

  const validateForm = () => {
    if (!formData.userName || !formData.password) {
      setError("Username and password are required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await login(formData);
      navigate("/dashboard");
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        setError("Session expired - please log in again");
      } else {
        const errorMessage =
          typeof err.message === "string"
            ? err.message
            : err.message?.Message ||
              JSON.stringify(err.message) ||
              "Invalid credentials";
        setError(errorMessage);
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
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
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
