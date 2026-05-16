import axios from "axios";

const origin = (import.meta.env.VITE_API_ORIGIN ?? "").replace(/\/$/, "");
const baseURL = origin ? `${origin}/api/complaints` : "/api/complaints";

const API = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export default API;
