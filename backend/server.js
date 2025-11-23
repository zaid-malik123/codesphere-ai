import http from "http";
import app from "./index.js";
import "dotenv/config";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Project from "./models/project.model.js";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// AUTH MIDDLEWARE
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const projectId = socket.handshake.query.projectId;
    console.log("THIS IS THE PROJECT ID :-", projectId)
    if (!token) throw new Error("Token missing");
    if (!mongoose.Types.ObjectId.isValid(projectId))
      throw new Error("Invalid project ID");

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) throw new Error("Token invalid");

    socket.userId = decoded.userId;

    // attach project data
    const project = await Project.findById(projectId);
    if (!project) throw new Error("Project not found");

    socket.project = project;

    next();
  } catch (err) {
    next(err);
  }
});

// CONNECTION HANDLER
io.on("connection", (socket) => {
  const roomId = socket.project._id.toString();

  socket.join(roomId);

  // RECEIVING MSG
  socket.on("project-message", (data) => {

    socket.broadcast.to(roomId).emit("project-message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
