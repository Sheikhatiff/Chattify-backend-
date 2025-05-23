// const express = require("express");
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";
import Message from "./models/message.model.js";

dotenv.config({ path: path.resolve(process.cwd(), "config.env") });

const PORT = process.env.PORT || 5000;
const ENVIRONMENT = process.env.NODE_ENV;
const __dirname = path.resolve();

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT} in ${ENVIRONMENT} mode`);
  connectDB();
});
