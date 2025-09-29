import api from "./api";
import { LoginDto, RegisterDto } from "../types/auth";

export const login = async (data: LoginDto) => {
  const response = await api.post("/auth/login", data);
  localStorage.setItem("token", response.data.token);
};

export const register = async (data: RegisterDto) => {
  const response = await api.post("/auth/register", data);
  localStorage.setItem("token", response.data.token);
};
