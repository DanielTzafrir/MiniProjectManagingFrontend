import React, { useState } from "react";
import { register } from "../../services/authService";
import { RegisterDto } from "../../types/auth";
import { useNavigate } from "react-router-dom";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userName || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Invalid email");
      return;
    }
    try {
      await register(formData);
      navigate("/dashboard");
    } catch (err) {
      setError("Registration failed");
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
  );
};

export default Register;
