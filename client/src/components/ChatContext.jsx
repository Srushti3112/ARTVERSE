import React, { createContext, useContext, useState } from "react";
import { faqData } from "../data/faqData";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "Hello! How can I help you today?",
      suggestions: Object.values(faqData).map((faq) => faq.question),
    },
  ]);

  const handleUserMessage = (question) => {
    // Add user message
    setMessages((prev) => [...prev, { type: "user", content: question }]);

    // Find answer in FAQ data
    const answer = Object.values(faqData).find(
      (faq) => faq.question.toLowerCase() === question.toLowerCase()
    );

    // Add bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: answer
            ? answer.answer
            : "I'm not sure, but you can contact support for more help!",
          suggestions: !answer
            ? Object.values(faqData).map((faq) => faq.question)
            : [],
        },
      ]);
    }, 500);
  };

  return (
    <ChatContext.Provider
      value={{ isOpen, setIsOpen, messages, handleUserMessage }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
