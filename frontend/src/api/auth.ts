import { api } from "./axios";
import type { LoginRequest, RegisterRequest } from "../types/auth";

export const register = async (registerRequest: RegisterRequest) => {
  const response = await api.post("/auth/register", registerRequest);
  return response.data;
};

export const login = async (loginRequest: LoginRequest) => {
  const response = await api.post("/auth/login", loginRequest);
  return response.data;
};

export const logout = async () => {
  await api.post("/auth/logout");
}

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
}