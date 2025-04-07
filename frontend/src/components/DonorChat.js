import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { 
  Button, 
  CloseButton, 
  Drawer, 
  Portal,
  Box, 
  Float, 
  Input, 
  Text, 
  Spinner,
  VStack,
  HStack
} from "@chakra-ui/react";

// Create socket connection outside component to prevent multiple connections
const socket = io.connect("http://localhost:5000"); // Backend URL

const DonorChat = ({ senderType, senderId, receiverType, receiverId }) => {
    const [open, setOpen] = useState(true); // Auto-open when rendered
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [chatAllowed, setChatAllowed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [receiverName, setReceiverName] = useState("");
    const messagesEndRef = useRef(null);
    
    // Create a consistent room ID format
    const room = [senderType + senderId, receiverType + receiverId].sort().join("_");
    const token = localStorage.getItem("token"); // or wherever you store JWT

    // Set up axios config to avoid repetition
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };
  
    // Function to check if chat is initiated
    const checkChatPermission = async () => {
      try {
        const doneeId = senderType === "donee" ? senderId : receiverId;
        const donorId = senderType === "donor" ? senderId : receiverId;
  
        const res = await axios.get(
          `http://localhost:5000/api/chat/check/${doneeId}/${donorId}`,
          axiosConfig
        );
  
        setChatAllowed(res.data.allowed);
      } catch (err) {
        console.error("Chat permission check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    // Function to get receiver's name
    const getReceiverName = async () => {
      try {
        // Create an endpoint to fetch user details
        const url = `http://localhost:5000/api/users/${receiverType}/${receiverId}`;
        const res = await axios.get(url, axiosConfig);
        
        if (res.data && res.data.name) {
          setReceiverName(res.data.name);
        } else {
          // Fallback if name isn't available
          setReceiverName(`${receiverType.charAt(0).toUpperCase() + receiverType.slice(1)} User`);
        }
      } catch (err) {
        console.error("Failed to fetch receiver details:", err);
        setReceiverName(`${receiverType.charAt(0).toUpperCase() + receiverType.slice(1)} User`);
      }
    };
  
    // Scroll to bottom when new messages arrive
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      checkChatPermission();
      getReceiverName(); // Fetch receiver's name when component mounts
    }, []);
  
    useEffect(() => {
      if (!chatAllowed) return;
  
      // Join the chat room
      socket.emit("join_room", room);
  
      // Fetch previous messages
      axios
        .get(`http://localhost:5000/api/chat/messages/${room}`, axiosConfig)
        .then((res) => {
          setMessages(res.data);
          // Scroll to bottom after messages load
          setTimeout(scrollToBottom, 100);
        })
        .catch((err) => console.error("Error fetching messages:", err));
  
      // Listen for new messages
      const handleNewMessage = (data) => {
        setMessages((prev) => [...prev, data]);
        // Scroll to bottom when new message arrives
        setTimeout(scrollToBottom, 100);
      };
      
      socket.on("receive_message", handleNewMessage);
  
      // Cleanup on unmount
      return () => {
        socket.off("receive_message", handleNewMessage);
        socket.emit("leave_room", room);
      };
    }, [room, chatAllowed]);
  
    const sendMessage = () => {
      if (message.trim()) {
        const msgData = {
          senderType,
          senderId,
          receiverType,
          receiverId,
          message,
          room
        };
  
        socket.emit("send_message", msgData);
        
        // Optimistically add message to UI
        const optimisticMsg = {
          ...msgData,
          sender: "Me", // Can be improved if you have access to user name
          timestamp: new Date()
        };
        
        setMessages((prev) => [...prev, optimisticMsg]);
        setMessage("");
  
        // Send to server to persist
        axios
          .post(
            "http://localhost:5000/api/chat/messages", 
            msgData, 
            axiosConfig
          )
          .catch((err) => console.error("Error sending message:", err));
      }
    };
  
    // Handle pressing Enter to send message
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    };

    const initiateChat = async () => {
      try {
        const doneeId = senderType === "donee" ? senderId : receiverId;
        const donorId = senderType === "donor" ? senderId : receiverId;
        
        await axios.post(
          "http://localhost:5000/api/chat/initiate",
          { doneeId, donorId },
          axiosConfig
        );
        
        setChatAllowed(true);
        setOpen(true);
      } catch (err) {
        console.error("Failed to initiate chat:", err);
      }
    };
  
    if (loading) return <Spinner size="sm" />;

    // Handle drawer close properly - don't re-render whole component
    const handleDrawerClose = () => {
      setOpen(false);
    };
  
    return (
      <Drawer.Root size="sm" open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>{receiverName || `Chat with ${receiverType}`}</Drawer.Title>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" onClick={handleDrawerClose} />
                </Drawer.CloseTrigger>
              </Drawer.Header>
              <Drawer.Body>
                {!chatAllowed ? (
                  <VStack spacing={4}>
                    <Text>Chat not initiated yet.</Text>
                    {senderType === "donee" && (
                      <Button colorScheme="blue" onClick={initiateChat}>
                        Initiate Chat
                      </Button>
                    )}
                  </VStack>
                ) : (
                  <VStack spacing={3} align="stretch" height="100%">
                    <Box 
                      flex="1" 
                      overflowY="auto" 
                      p={2} 
                      borderRadius="md"
                      border="1px solid"
                      borderColor="gray.200"
                      minHeight="300px"
                    >
                      {messages.length === 0 ? (
                        <Text textAlign="center" color="gray.500">No messages yet</Text>
                      ) : (
                        messages.map((msg, index) => (
                          <Box 
                            key={index}
                            bg={msg.senderType === senderType ? "blue.50" : "gray.50"}
                            p={2}
                            borderRadius="md"
                            mb={2}
                            maxW="80%"
                            alignSelf={msg.senderType === senderType ? "flex-end" : "flex-start"}
                            ml={msg.senderType === senderType ? "auto" : 0}
                          >
                            <Text fontWeight="bold" fontSize="sm">
                              {msg.senderType === senderType ? "You" : msg.sender || receiverName}
                            </Text>
                            <Text>{msg.message}</Text>
                            <Text fontSize="xs" color="gray.500" textAlign="right">
                              {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </Text>
                          </Box>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </Box>
                    
                    <HStack spacing={2}>
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                      />
                      <Button 
                        onClick={sendMessage} 
                        colorScheme="blue"
                        isDisabled={!message.trim()}
                      >
                        Send
                      </Button>
                    </HStack>
                  </VStack>
                )}
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    );
};

export default DonorChat;