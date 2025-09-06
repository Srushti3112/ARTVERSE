const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");

module.exports = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  // Socket.io middleware for authentication
  io.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      jwt.verify(
        socket.handshake.auth.token,
        process.env.JWT_SECRET,
        (err, decoded) => {
          if (err) return next(new Error("Authentication error"));
          socket.user = decoded;
          next();
        }
      );
    } else {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.user.id);

    socket.on("join-group", (groupId) => {
      socket.join(groupId);
    });

    socket.on("leave-group", (groupId) => {
      socket.leave(groupId);
    });

    socket.on("send-message", (message) => {
      io.to(message.groupId).emit("new-message", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user.id);
    });
  });

  return io;
};
