// src/api/auth.ts
import axiosInstance from "./axiosInstance";

export interface LoginPayload {
  email: string;
  password: string;
  otp: string;  // Make otp required for verification
  isGoogleLogin?: boolean; // Flag to indicate Google login
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role?: "customer" | "retailer" | "wholesaler";
};

export type OTPRequest = {
  email: string;
};

export type OTPVerify = OTPRequest & {
  otp: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
  role: string;
  email: string;
};

// Request OTP for login
export const requestLoginOTP = async (email: string) => {
  const { data } = await axiosInstance.post("/auth/login/request-otp", { email });
  return data;
};

// Verify OTP and login
export const verifyLoginOTP = async (payload: LoginPayload) => {
  const { data } = await axiosInstance.post("/auth/login/verify-otp", {
    email: payload.email,
    password: payload.password,
    otp: payload.otp,
    is_google_login: payload.isGoogleLogin || false
  });
  return data;
};

// Request OTP for Google login
export const requestGoogleLoginOTP = async (email: string, name: string) => {
  const { data } = await axiosInstance.post("/auth/google/request-otp", { 
    email,
    name 
  });
  return data;
};

// Verify Google OTP and login
export const verifyGoogleOTP = async (email: string, otp: string) => {
  const { data } = await axiosInstance.post("/auth/google/verify-otp", {
    email,
    otp
  });
  return data;
};

// Request OTP for registration
export const requestRegistrationOTP = async (userData: RegisterPayload) => {
  const { data } = await axiosInstance.post("/auth/register/request-otp", userData);
  return data;
};

// Verify OTP and complete registration
export const verifyRegistrationOTP = async (userData: RegisterPayload, otp: string) => {
  const payload = {
    email: userData.email,
    name: userData.name,
    password: userData.password,
    role: userData.role || 'customer',
    otp: otp
  };
  
  const { data } = await axiosInstance.post("/auth/register/verify-otp", payload);
  return data;
};

// Legacy login (kept for backward compatibility)
export const loginApi = async (payload: { username: string; password: string }) => {
  const form = new FormData();
  form.append("username", payload.username);
  form.append("password", payload.password);

  const { data } = await axiosInstance.post("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return data;
};

// Legacy registration (kept for backward compatibility)
export const registerApi = async (payload: RegisterPayload) => {
  const { data } = await axiosInstance.post("/auth/register", payload);
  return data;
};
