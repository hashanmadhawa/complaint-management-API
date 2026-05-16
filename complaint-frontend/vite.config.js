import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Read PORT from backend/.env (tolerates quotes, spaces, # comments). */
function portFromBackendDotEnv() {
  try {
    const envPath = path.join(__dirname, "..", "backend", ".env");
    const raw = fs.readFileSync(envPath, "utf8");
    const m = raw.match(/^\s*PORT\s*=\s*["']?(\d+)["']?\s*(?:[#;].*)?\r*$/m);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

/** Same origin your backend listens on (reads PORT from backend/.env when possible). */
function backendProxyTarget() {
  const fromEnv = process.env.VITE_PROXY_TARGET?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const port = portFromBackendDotEnv();
  if (port) return `http://127.0.0.1:${port}`;

  return "http://127.0.0.1:8000";
}

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: backendProxyTarget(),
        changeOrigin: true,
      },
    },
  },
});
