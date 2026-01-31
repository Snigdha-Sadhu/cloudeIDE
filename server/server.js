import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { errorHandler } from "./middleware/errorHandler.js";
import Project from "./models/projectmodel.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use(cors({origin:process.env.CLIENT_URL,credentials:true}));
app.get("/", (req, res) => {
  console.log("✅ GET / hit");
  res.send("Server is alive");
});

app.get("/api/test", (req, res) => {
  console.log("✅ GET /api/test hit");
  res.json({ message: "Backend working" });
});

import projectRoute from "./routes/projectRoute.js";
import fileRoute from "./routes/fileRoute.js";
import executeRoute from "./routes/executeRoute.js";
import authRoute from "./routes/AuthRoute.js";
app.use("/api/project", projectRoute);
app.use("/api/file", fileRoute);
app.use("/api/execute", executeRoute);
app.use("/api/auth",authRoute);
// Add this temporary route to your server 
app.get("/debug-db", async (req, res) => {
  const allProjects = await Project.find({});
  const count = await Project.countDocuments();
  res.json({ count, allProjects });
});
app.use(errorHandler);
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err.message));