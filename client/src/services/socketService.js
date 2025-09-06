import io from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnecting = false;
  }

  connect(token) {
    try {
      if (this.socket?.connected) {
        console.log("Socket is already connected", this.socket.id);
        return this.socket;
      }

      console.log(
        "Starting socket connection with token:",
        token ? "present" : "missing"
      );

      this.socket = io("http://localhost:5000", {
        path: "/socket.io/",
        transports: ["polling"],
        auth: { token },
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
        timeout: 5000,
        forceNew: true,
        autoConnect: false, // Prevent automatic connection
      });

      // Add error listeners before connecting
      this.socket.on("connect_error", (error) => {
        console.error("Socket connect_error:", {
          message: error.message,
          description: error.description,
          type: error.type,
          context: error.context,
        });
      });

      this.socket.on("connect_failed", (error) => {
        console.error("Socket connect_failed:", error);
      });

      this.socket.on("error", (error) => {
        console.error("Socket general error:", error);
      });

      // Now manually connect
      this.socket.connect();

      this.socket.io.on("error", (error) => {
        console.error("Transport error:", error);
        this.isConnecting = false;
      });

      this.socket.io.on("reconnect_attempt", () => {
        console.log("Attempting to reconnect...");
      });

      this.socket.on("connect", () => {
        console.log("Socket connected successfully", this.socket.id);
        this.isConnecting = false;
      });

      this.socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        this.isConnecting = false;
      });

      return this.socket;
    } catch (error) {
      console.error("Socket initialization failed:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      return null;
    }
  }

  disconnect() {
    if (!this.socket) return;
    console.log("Disconnecting socket...");
    this.socket.disconnect();
    this.socket = null;
    this.isConnecting = false;
  }
}

export default new SocketService();
