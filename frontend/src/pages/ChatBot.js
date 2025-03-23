import React, { useState, useEffect, useRef } from "react";
import "../styles/ChatBot.css";

const HarmoniChatBot = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm your Harmoni assistant. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    setInput("");
    setIsLoading(true);

    try {
        const response = await fetch("http://localhost:5000/api/chatbot/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: input }),
        });
        const data = await response.json();

        // Fix response handling
        setMessages((prev) => [...prev, { text: data.response || "I didn't understand that.", sender: "bot" }]);
    } catch (error) {
        setMessages((prev) => [
            ...prev,
            { text: "Sorry, something went wrong. Try again.", sender: "bot" },
        ]);
    } finally {
        setIsLoading(false);
    }
};


  return (
    <div className="harmoni-chatbot-wrapper">
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="chat-toggle-button">
          <span className="chat-icon">💬</span> Chat
        </button>
      )}

      {isOpen && (
        <div className="harmoni-chatbot-container">
          <div className="harmoni-chatbot-header">
            <h3>Harmoni Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="close-button">✕</button>
          </div>

          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}

            {isLoading && (
              <div className="message bot typing-indicator">
                <span></span><span></span><span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
            />
            <button type="submit" disabled={isLoading}>➤</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default HarmoniChatBot;
