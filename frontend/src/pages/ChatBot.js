import { useState } from "react";
import io from "socket.io-client";
import '../styles/ChatBot.css';

const socket = io("http://localhost:5000"); // Backend URL

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = () => {
    if (input.trim()) {
      const userMessage = { sender: "user", text: input };
      setMessages([...messages, userMessage]);
      socket.emit("userMessage", input); // Send message to backend
      setInput("");
    }
  };

  socket.on("botMessage", (message) => {
    setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: message }]);
  });

  return (
    <div className="fixed bottom-4 right-4">
      {!isOpen ? (
        <button onClick={toggleChat} className="p-3 bg-blue-500 text-white rounded-full shadow-md">
          💬
        </button>
      ) : (
        <div className="w-64 bg-white shadow-lg rounded-lg p-3">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-semibold">Ask Me!</h3>
            <button onClick={toggleChat} className="text-red-500">✖</button>
          </div>
          <div className="h-48 overflow-y-auto my-2 p-2 border rounded">
            {messages.map((msg, index) => (
              <p key={index} className={msg.sender === "user" ? "text-right text-blue-600" : "text-left text-gray-800"}>
                {msg.text}
              </p>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow p-2 border rounded-l"
            />
            <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded-r">Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
