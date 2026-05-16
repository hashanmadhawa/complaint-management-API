# complaint-management-API
A web-based complaint management system built with Node.js and Express, providing structured APIs for handling complaint submissions, status tracking, and administrative responses.

## Run locally

- **Both apps:** from the repo root, `npm install` then `npm run dev` (starts API + Vite). Requires `MONGO_URL` in `backend/.env` so the server can listen.
- **Separately:** `cd backend && npm start` and `cd complaint-frontend && npm run dev`. If the UI shows a red “Cannot reach the API” banner or Vite logs `ECONNREFUSED`, the backend is not running or MongoDB failed to connect.
