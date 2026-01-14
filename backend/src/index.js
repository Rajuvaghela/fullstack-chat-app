import express from "express";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDb } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { app, io, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Navigate from backend/src to project root
const projectRoot = path.resolve(__dirname, "../..");

console.log("Environment:", process.env.NODE_ENV);
console.log("Project Root:", projectRoot);
console.log("Static files path:", path.join(projectRoot, "frontend/dist"));

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.NODE_ENV === "production"
      ? process.env.CLIENT_URL || "*"
      : "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(projectRoot, "frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(projectRoot, "frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("Server is running on" + PORT);
  connectDb();
});
