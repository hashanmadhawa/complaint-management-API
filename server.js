import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app=express();
dotenv.config();
const PORT=process.env.PORT||8000;
const MONGOURL=process.env.MONGO_URL;

mongoose
.connect(MONGOURL)
.then(()=>{
    console.log("database connected successfully..");
    app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
})