import axios from "axios";

/**
 * Dev: baseURL `/api/complaints` → Vite proxies `/api` to backend (see vite.config.js).
 * Prod / direct calls: set VITE_API_ORIGIN e.g. http://localhost:5000 (no trailing slash).
 */
const origin = (import.meta.env.VITE_API_ORIGIN ?? "").replace(/\/$/, "");
const baseURL = origin
  ? `${origin}/api/complaints`
  : "/api/complaints";

const API = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export default API;
