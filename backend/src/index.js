import express from "express";

import dotenv from "dotenv";

import cors from "cors";

import http from "http";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";

import messageRoutes from "./routes/message.route.js";

import { initSocket } from "./socket/socket.js";

dotenv.config();

const app = express();

const server = http.createServer(app);

initSocket(server);

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/api/auth", authRoutes);

app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  connectDB();
});
