import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import complaintRoutes from "./routes/complaintRoutes.js";

const app = express();
dotenv.config();

const PORT = Number(process.env.PORT) || 8000;
const MONGOURL =
  process.env.MONGO_URL ||
  process.env.MONGO_URI ||
  process.env.DATABASE_URL;

if (!MONGOURL || typeof MONGOURL !== "string") {
  console.error(
    "Missing MongoDB connection string. Set MONGO_URL (or MONGO_URI) in backend/.env"
  );
  process.exit(1);
}

const corsOrigins =
  process.env.CORS_ORIGINS?.split(",")
    .map((s) => s.trim())
    .filter(Boolean) ?? [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5174",
    ];

app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());

app.use("/api/complaints", complaintRoutes);

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("database connected successfully..");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  });
