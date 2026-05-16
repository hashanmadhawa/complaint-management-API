# Complaint Management System

A full-stack web application for submitting, tracking, and resolving public complaints. Built with a RESTful Node.js/Express API backend and a React frontend with a modern, responsive UI.

---

##  Problem Description

In many organizations, institutions, and public services, there is no structured and transparent way for individuals to submit complaints or track their progress. Complaints are often submitted verbally, via email, or through informal channels — leading to:

- Complaints getting lost or ignored with no follow-up
- No visibility into the current status of a submitted complaint
- No way for administrators to formally respond to complainants
- Difficulty in categorizing or prioritizing issues by type or location
- No record-keeping or audit trail of complaints and resolutions

This creates frustration for complainants and inefficiency for administrators managing the process.

---

## Proposed Solution

The **Complaint Management System** provides a centralized digital platform where:

- **Users** can submit structured complaints with a title, category, location, and description
- **Administrators** can view all complaints, update their status, and post official responses
- **Everyone** can track the real-time status of any complaint — from `pending` through `in_progress` to `resolved`
- **All submissions are timestamped**, giving a clear record of when each complaint was raised and last updated

The system eliminates informal complaint channels by providing a single, organized source of truth accessible through a clean web interface.

---

##  Features

### Frontend
-  **Live dashboard** with complaint counts broken down by status
-  **Submit complaints** via a structured form with category dropdown
-  **Inline status update** — change status directly from the complaint card without opening a modal
-  **Real-time search** across title, category, location, and description
-  **Filter tabs** — view All, Pending, In Progress, or Resolved complaints
-  **Submission date** displayed on every card (smart relative format: "Today at 2:30 PM", "Yesterday", or full date)
-  **Admin response** — add or update an official response per complaint via detail modal
-  **Delete complaints** with confirmation dialog
-  **Error handling** — all API errors surfaced in the UI, no silent failures
-  **Empty states** — friendly messages when no complaints match search or filter

### Backend
- Full **CRUD** operations for complaints
- **Status validation** via Mongoose enum — only `pending`, `in_progress`, `resolved` accepted
- **Status-only updates** — the status endpoint only ever changes status, nothing else
- **Force-pending on create** — new complaints always start as `pending` regardless of client input
- **CORS configured** with environment-variable support for allowed origins
- **Auto timestamps** via Mongoose (`createdAt`, `updatedAt`) on every document

---

## Technologies Used

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | v18+ | Runtime environment |
| Express | ^5.2.1 | Web framework & routing |
| Mongoose | ^9.6.1 | MongoDB ODM & schema validation |
| MongoDB | Local / Atlas | Database |
| cors | ^2.8.5 | Cross-origin request handling |
| dotenv | ^17.4.2 | Environment variable management |
| nodemon | ^3.1.9 | Auto-restart during development |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | ^18.3.1 | UI component library |
| Vite | ^5.4.2 | Build tool & dev server |
| Axios | ^1.9.0 | HTTP client for API calls |
| Inter (Google Fonts) | — | Typography |

---

##  Project Structure

```
complaint-management-system/
│
├── backend/                          # Express REST API
│   ├── controllers/
│   │   └── complaintController.js    # Route handler logic
│   ├── models/
│   │   └── Complaint.js              # Mongoose schema & model
│   ├── routes/
│   │   └── complaintRoutes.js        # API route definitions
│   ├── .env                          # Environment variables (not committed)
│   ├── package.json
│   └── server.js                     # App entry point
│
└── frontend/                         # React application
    ├── src/
    │   ├── components/
    │   │   ├── ComplaintCard.jsx      # Card with inline status update + date
    │   │   ├── ComplaintModal.jsx     # Full detail view + response form
    │   │   ├── CreateComplaintModal.jsx  # New complaint form
    │   │   └── StatusBadge.jsx        # Coloured status pill
    │   ├── services/
    │   │   └── api.js                 # Axios instance & base URL config
    │   ├── utils/
    │   │   └── dateUtils.js           # Date formatting helpers
    │   ├── App.jsx                    # Root component & dashboard
    │   ├── main.jsx                   # React entry point
    │   └── index.css                  # Global styles & design tokens
    ├── index.html
    ├── package.json
    └── vite.config.js                 # Dev proxy to backend
```

---

## 🔌 API Endpoints

**Base URL:** `http://localhost:8000/api/complaints`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Get all complaints |
| `POST` | `/` | Create a new complaint |
| `GET` | `/:id` | Get a complaint by ID |
| `PUT` | `/:id/status` | Update complaint status only |
| `PUT` | `/:id/response` | Add or update admin response |
| `DELETE` | `/:id` | Delete a complaint |

---

### Examples

####  Create a complaint
```http
POST /api/complaints
Content-Type: application/json

{
  "title": "Broken streetlight on Main Street",
  "description": "The streetlight outside No. 42 has been out for two weeks, creating a safety hazard at night.",
  "catagory": "Infrastructure",
  "location": "Main Street, Block 4"
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "_id": "664a1f2b3c4d5e6f7a8b9c0d",
    "title": "Broken streetlight on Main Street",
    "description": "The streetlight outside No. 42 has been out for two weeks...",
    "catagory": "Infrastructure",
    "location": "Main Street, Block 4",
    "status": "pending",
    "response": "",
    "createdAt": "2025-05-14T10:30:00.000Z",
    "updatedAt": "2025-05-14T10:30:00.000Z"
  }
}
```

---

####  Get all complaints
```http
GET /api/complaints
```

**Response `200`:**
```json
{
  "success": true,
  "count": 2,
  "data": [ { ...complaint }, { ...complaint } ]
}
```

---

####  Update complaint status
```http
PUT /api/complaints/664a1f2b3c4d5e6f7a8b9c0d/status
Content-Type: application/json

{
  "status": "in_progress"
}
```

>  Only `"pending"`, `"in_progress"`, and `"resolved"` are accepted. Any other value returns a `400` error.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "_id": "664a1f2b3c4d5e6f7a8b9c0d",
    "status": "in_progress",
    ...
  }
}
```

---

####  Add an admin response
```http
PUT /api/complaints/664a1f2b3c4d5e6f7a8b9c0d/response
Content-Type: application/json

{
  "response": "Our maintenance team has been dispatched and will inspect the streetlight by Friday."
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "_id": "664a1f2b3c4d5e6f7a8b9c0d",
    "response": "Our maintenance team has been dispatched...",
    ...
  }
}
```

---

####  Delete a complaint
```http
DELETE /api/complaints/664a1f2b3c4d5e6f7a8b9c0d
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Complaint deleted successfully"
}
```

---

### Error responses

All endpoints return consistent error objects:

```json
{
  "success": false,
  "message": "Complaint not found"
}
```

| Status Code | Meaning |
|---|---|
| `400` | Bad request — missing or invalid fields |
| `404` | Complaint not found for the given ID |
| `500` | Internal server error |

---

##  Setup Instructions

### Prerequisites

Make sure you have the following installed:

- **Node.js** v18 or higher → [nodejs.org](https://nodejs.org)
- **MongoDB** running locally → [mongodb.com](https://www.mongodb.com/try/download/community)  
  *(or a free MongoDB Atlas cluster)*
- **Git** → [git-scm.com](https://git-scm.com)

---

### 1. Clone the repository

```bash
git clone https://github.com/hashanmadhawa/complaint-management-API.git
cd complaint-management-API
```

---

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env
PORT=8000
MONGO_URL="mongodb://127.0.0.1:27017/complaintManagements"
```

> If using MongoDB Atlas, replace the value with your Atlas connection string:
> `MONGO_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/complaintManagements"`

---

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

> No `.env` file is needed for the frontend. The Vite dev server automatically proxies all `/api` requests to the backend via `vite.config.js`.

---

## ▶️ How to Run the Project

You need **two terminals open at the same time** — one for the backend and one for the frontend.

### Terminal 1 — Start the backend

```bash
cd backend
node server.js
```

You should see:
```
database connected successfully..
Server running on port 8000
```

> For auto-reload during development:
> ```bash
> npm start
> ```
> *(requires nodemon, already in devDependencies)*

---

### Terminal 2 — Start the frontend

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.4.2  ready in 300ms

  ➜  Local:   http://localhost:5173/
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

### Quick reference

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API base route | http://localhost:8000/api/complaints |

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `8000` | Port the backend server listens on |
| `MONGO_URL` | **Yes** | — | MongoDB connection string |
| `CORS_ORIGINS` | No | `localhost:5173, 5174` | Comma-separated list of allowed frontend origins |

>  Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 👤 Author

**Hashan Madhawa**  
GitHub: [@hashanmadhawa](https://github.com/hashanmadhawa)

---

##  License

ISC
