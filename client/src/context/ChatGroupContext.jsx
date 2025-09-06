import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";

const ChatGroupContext = createContext();

export const ChatGroupProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    let newSocket;

    if (user?.token) {
      newSocket = io("http://localhost:5000", {
        auth: { token: user.token },
      });

      newSocket.on("new-message", (message) => {
        setMessages((prev) => [...prev, message]);
      });

      setSocket(newSocket);
    }

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [user]);

  const joinGroup = (groupId) => {
    if (socket) {
      socket.emit("join-group", groupId);
      setCurrentGroup(groupId);
    }
  };

  const sendMessage = (content, media) => {
    if (socket && currentGroup) {
      const formData = new FormData();
      formData.append("content", content);
      if (media) {
        formData.append("media", media);
      }

      // Send to server
      fetch(`/api/chat/groups/${currentGroup}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${user.token}` },
        body: formData,
      });
    }
  };

  return (
    <ChatGroupContext.Provider
      value={{
        socket,
        currentGroup,
        messages,
        joinGroup,
        sendMessage,
        setMessages,
      }}
    >
      {children}
    </ChatGroupContext.Provider>
  );
};

export const useChatGroup = () => useContext(ChatGroupContext);
