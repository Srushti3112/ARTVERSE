import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import socketService from "../services/socketService";

const DirectMessage = ({ artistId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const messagesEndRef = useRef(null);
  const user = useSelector((state) => state.auth.user);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user?.token || !artistId) {
      console.error("Cannot initialize chat:", {
        hasToken: !!user?.token,
        hasArtistId: !!artistId,
        userId: user?._id,
      });
      return;
    }

    try {
      console.log("Initializing chat connection...");
      const socket = socketService.connect(user.token);

      if (!socket) {
        const error = new Error("Socket initialization failed");
        console.error("Chat initialization failed:", error);
        setConnectionError("Failed to establish connection");
        return;
      }

      socket.on("connect_error", (error) => {
        console.error("Chat connection error:", {
          message: error.message,
          type: error.type,
          data: error.data,
        });
        setConnectionError(`Connection failed: ${error.message}`);
      });

      // Fetch messages on connection
      socket.on("connect", () => {
        console.log("Connected to chat server");
        setIsConnected(true);
        setConnectionError(null);
        socket.emit("join", user._id);
        fetchMessages();
      });

      socket.on("error", (error) => {
        console.error("Socket error:", error);
        setConnectionError(error.message || "Connection error");
        setIsConnected(false);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from chat server");
        setIsConnected(false);
      });

      return () => {
        socketService.disconnect();
      };
    } catch (error) {
      console.error("Chat setup error:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      setConnectionError(`Error: ${error.message}`);
    }
  }, [user?.token, artistId, user?._id]);

  const fetchMessages = async () => {
    if (!artistId || !user?.token) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/${artistId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch messages");

      const data = await response.json();
      setMessages(data);
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching messages:", error);
      setConnectionError("Failed to load messages");
    }
  };

  // Send message handler
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !artistId || !isConnected) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/${artistId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ content: newMessage.trim() }),
        }
      );

      if (!response.ok) throw new Error("Failed to send message");

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      setConnectionError("Failed to send message");
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur-xl rounded-2xl p-6 max-w-2xl mx-auto border border-white/10">
      {/* Connection status */}
      {connectionError && (
        <div className="mb-4 p-2 bg-red-500/20 text-red-200 rounded text-sm text-center">
          {connectionError}
        </div>
      )}

      <div className="h-96 overflow-y-auto mb-4 p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${
              message.sender._id === user._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                message.sender._id === user._id
                  ? "bg-purple-500/80 text-white"
                  : "bg-white/10 text-white"
              }`}
            >
              <p className="text-sm mb-1">{message.content}</p>
              <span className="text-xs opacity-75">
                {new Date(message.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={!isConnected}
          className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 disabled:opacity-50"
          placeholder={
            connectionError
              ? "Connection failed"
              : isConnected
              ? "Type your message..."
              : "Connecting..."
          }
        />
        <button
          type="submit"
          disabled={!isConnected || !newMessage.trim()}
          className="px-6 py-2 rounded-xl bg-purple-500 text-white font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:hover:bg-purple-500"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default DirectMessage;
