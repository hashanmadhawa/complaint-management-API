import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import complaintRoutes from "./routes/complaintRoutes.js";
const app=express();
dotenv.config();
app.use(express.json());
const PORT=process.env.PORT||8000;
const MONGOURL=process.env.MONGO_URL;

mongoose
.connect(MONGOURL)
.then(()=>{
    console.log("database connected successfully..");
    app.use("/api/complaints",complaintRoutes);
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
})
