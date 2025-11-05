import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getProducts = () => API.get("/products/");
export const searchProducts = (params) => API.get("/products/search", { params });
export const placeOrder = (data, token) =>
  API.post("/orders/", data, { headers: { Authorization: `Bearer ${token}` } });
export const getMyOrders = (token) =>
  API.get("/orders/my-orders", { headers: { Authorization: `Bearer ${token}` } });
