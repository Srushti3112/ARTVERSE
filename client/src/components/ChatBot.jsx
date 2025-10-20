import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "../context/ChatContext";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ChatBot = () => {
  const { isOpen, setIsOpen, messages, handleUserMessage } = useChat();

  return (
    <>
      {/* Background Glow Effect */}
      <div className="fixed right-0 bottom-0 w-40 h-40 md:w-96 md:h-96 pointer-events-none z-40">
        <div className="absolute bottom-2 right-2 w-32 h-32 md:bottom-4 md:right-4 md:w-80 md:h-80 bg-gradient-to-tr from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-4 right-4 w-24 h-24 md:bottom-8 md:right-8 md:w-64 md:h-64 bg-gradient-to-tr from-[#0b5d3b]/20 to-emerald-600/20 rounded-full blur-2xl"></div>
      </div>

      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed right-4 bottom-4 w-16 h-16 md:w-[250px] md:h-[250px] hover:xl transition-all duration-300 ${
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
          className="w-16 h-16 md:w-[300px] md:h-[300px] object-contain"
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
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-4 right-4 w-[92vw] max-w-sm h-[65vh] md:bottom-6 md:right-6 md:w-96 md:h-[500px] bg-white rounded-2xl overflow-hidden z-50 border-2 border-[#0b5d3b]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0b5d3b] to-emerald-600 p-3 md:p-4 flex justify-between items-center">
              <h3 className="text-white font-semibold text-base md:text-lg">
                Artverse Assistant
              </h3>
              <motion.button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 p-1.5 md:p-2 rounded-full hover:bg-white/20 transition-all duration-200"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  className="text-base md:text-lg"
                />
              </motion.button>
            </div>

            {/* Messages */}
            <div className="h-[calc(65vh-56px)] md:h-[400px] overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
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
                    className={`max-w-[85%] p-2.5 md:p-3 rounded-2xl ${
                      message.isQuestion
                        ? "bg-gray-200 text-black"
                        : message.type === "user"
                        ? "bg-[#c4eadb] text-black"
                        : "bg-[#f6ffff] text-[#141e1a] border border-[#0b5d3b]/20"
                    }`}
                  >
                    <p className="text-sm md:text-base">{message.content}</p>
                    {message.suggestions && (
                      <div className="mt-2 md:mt-3 space-y-1.5 md:space-y-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleUserMessage(suggestion)}
                            className="block w-full text-left text-xs md:text-sm text-[#000704] hover:text-black bg-[#eef2ee] rounded-lg p-2 hover:bg-[#91e0bf] transition-colors"
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
