import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "../context/ChatContext";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ChatBot = () => {
  const { isOpen, setIsOpen, messages, handleUserMessage } = useChat();

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed right-1 bottom-1 w-[250px] h-[250px]  hover:xl transition-all duration-300 ${
          isOpen ? "hidden" : "flex"
        } items-center justify-center z-50`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        style={{
          overflow: "hidden",
          background: "transparent",
          border: "none",
          padding: 0,
        }}
      >
        <motion.img
          src="/chatbot-icon.png"
          alt="Chatbot Icon"
          className="w-[300px] h-[300px] object-contain"
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
        />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border-2 border-[#0b5d3b]"
          >
            {/* Header */}
            <div className="bg-[#0b5d3b] p-4 flex justify-between items-center">
              <h3 className="text-white font-semibold">Artverse Assistant</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* Messages */}
            <div className="h-[400px] overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.isQuestion
                        ? "bg-gray-200 text-black"
                        : message.type === "user"
                        ? "bg-[#c4eadb] text-black"
                        : "bg-[#f6ffff] text-[#141e1a] border border-[#0b5d3b]/20"
                    }`}
                  >
                    <p>{message.content}</p>
                    {message.suggestions && (
                      <div className="mt-3 space-y-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleUserMessage(suggestion)}
                            className="block w-full text-left text-sm text-[#000704] hover:text-black bg-[#eef2ee] rounded-lg p-2 hover:bg-[#91e0bf] transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
