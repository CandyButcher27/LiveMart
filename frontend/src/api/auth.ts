// src/api/auth.ts
import axiosInstance from "./axiosInstance";

export type LoginPayload = {
  username: string;
  password: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  role?: "customer" | "retailer" | "wholesaler";
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
  role: string;
  email: string;
};

export const loginApi = async (payload: { username: string; password: string }) => {
  const form = new FormData();
  form.append("username", payload.username);
  form.append("password", payload.password);

  const { data } = await axiosInstance.post("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return data;
};

export const registerApi = async (payload: RegisterPayload) => {
  const { data } = await axiosInstance.post("/auth/register", payload);
  return data;
};
