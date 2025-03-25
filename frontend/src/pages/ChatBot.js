import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../styles/ChatBot.css'; // We'll create this file next

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Harmoni's assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;
    
    // Add user message to chat
    setMessages([...messages, { text: input, sender: 'user' }]);
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/chatbot/ask', { message: input });
      
      // Add bot's response to chat
      setMessages(prev => [...prev, { text: response.data.reply, sender: 'bot' }]);
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', error.response?.data || 'No detailed error information');
      
      setMessages(prev => [...prev, { 
        text: 'Sorry, I encountered an error. Please try again later.', 
        sender: 'bot' 
      }]);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`chat-widget ${isOpen ? 'open' : ''}`}>
      {isOpen ? (
        <>
          <div className="chat-header">
            <h3>Harmoni Assistant</h3>
            <button className="close-button" onClick={toggleChat}>×</button>
          </div>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                <div className="message-content">{message.text}</div>
              </div>
            ))}
            {loading && <div className="message bot">
              <div className="message-content">Typing...</div>
            </div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask something about Harmoni..."
            />
            <button onClick={handleSend} disabled={loading}>
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </>
      ) : (
        <button className="chat-button" onClick={toggleChat}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="white"/>
          </svg>
          Chat
        </button>
      )}
    </div>
  );
};

export default ChatBot;