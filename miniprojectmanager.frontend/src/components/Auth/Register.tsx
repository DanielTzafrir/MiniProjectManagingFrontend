import React, { useState } from "react";
import { register } from "../../services/authService";
import { RegisterDto } from "../../types/auth";
import { useNavigate, Link } from "react-router-dom";
import ErrorMessage from "../Common/ErrorMessage";

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterDto>({
    userName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.userName || !formData.email || !formData.password) {
      setError("All fields are required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Invalid email format");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await register(formData);
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
              "Registration failed";
        setError(errorMessage);
      }
    }
  };
  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <button type="submit">Register</button>
        {error && <ErrorMessage message={error} />}
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
