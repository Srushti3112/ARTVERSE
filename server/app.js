const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/users");
const messageRoutes = require("./routes/messages");

const PORT = process.env.PORT || 2000;

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://artverse-4.onrender.com",
      "https://artverse-client.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Update Socket.IO configuration
const io = new Server(server, {
  path: "/socket.io/",
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://artverse-4.onrender.com",
      "https://artverse-client.netlify.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["polling"],
  pingTimeout: 10000,
  connectionStateRecovery: true,
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join", (userId) => {
    if (!userId) {
      console.error("Join attempt without userId");
      return;
    }

    try {
      socket.join(userId.toString());
      socket.userId = userId;
      socket.emit("joined", { socketId: socket.id });
      console.log(`User ${userId} joined with socket ${socket.id}`);
    } catch (error) {
      console.error("Join error:", error);
      socket.emit("error", { message: "Failed to join" });
    }
  });

  socket.on("error", (error) => {
    console.error("Socket error:", socket.id, error);
  });

  socket.on("disconnect", (reason) => {
    console.log(`Client ${socket.id} disconnected:`, reason);
  });
});

// Make io accessible
app.set("io", io);

// Routes after socket.io setup
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// Error handling middleware must be last
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    message: err.message || "Internal server error",
  });
});

// Server startup
mongoose
  .connect("mongodb://localhost:27017/artverse")
  .then(() => {
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
