import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Avatar,
  Badge,
  Flex,
  Spinner,
  Button,
} from "@chakra-ui/react";
import { format, isToday, isYesterday } from "date-fns";
// Importing toastify module
import { ToastContainer, toast } from "react-toastify";

// Import toastify css file
import "react-toastify/dist/ReactToastify.css";
import DonorChat from "../components/DonorChat";

const ChatList = () => {
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChat, setActiveChat] = useState(null); // Track which chat is active
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { donorId } = useParams(); // Extract donorId from the URL if needed
  
  const token = localStorage.getItem("token");

  const fetchChatList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/chat/donor/${donorId}/chats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChatList(response.data);
      console.log("Chat List:", response.data);
    } catch (err) {
      console.error("Failed to fetch chat list:", err);
      setError("Failed to load your conversations");
      toast.error("Failed to load your conversations", { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatList();
    const interval = setInterval(fetchChatList, 30000); 
    return () => clearInterval(interval);
  }, [donorId]);

  const formatMessageDate = (dateString) => {
    // Handle invalid date strings
    if (!dateString) return "No date";
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      
      if (isToday(date)) {
        return format(date, "h:mm a");
      } else if (isYesterday(date)) {
        return "Yesterday";
      } else {
        return format(date, "MM/dd/yyyy");
      }
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  const handleChatClick = (doneeId) => {
    // Toggle active chat state
    setActiveChat(activeChat === doneeId ? null : doneeId);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleMessagesRead = (roomId) => {
    // Update the unread count for this chat to zero
    setChatList(prevChats => 
      prevChats.map(chat => {
        // Find the chat that matches this room ID
        const chatRoomId = [
          'donee' + chat.doneeId, 
          'donor' + donorId
        ].sort().join('_');
        
        if (chatRoomId === roomId) {
          return { ...chat, unreadCount: 0 };
        }
        return chat;
      })
    );
  };

  // Find the active chat data
  const activeChatData = chatList.find(chat => chat.doneeId === activeChat);

  if (loading) {
    return (
      <Container centerContent py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading conversations...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container centerContent py={10}>
        <Text color="red.500">{error}</Text>
        <Button mt={4} onClick={fetchChatList}>
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={6}>
      <Heading size="lg" mb={6}>
        Your Conversations
      </Heading>

      {chatList.length === 0 ? (
        <Box 
          p={8} 
          borderRadius="md" 
          bg="gray.50" 
          textAlign="center"
        >
          <Text fontSize="lg" color="gray.500">
            No active conversations yet
          </Text>
          <Text mt={2} color="gray.400">
            When donees initiate conversations with you, they'll appear here
          </Text>
        </Box>
      ) : (
        <Box as="ul" spacing={0} borderWidth="1px" borderRadius="md">
          {chatList.map((chat) => (
            <React.Fragment key={chat._id}>
              <Box as="li"
                p={4}
                _hover={{ bg: "gray.50", cursor: "pointer" }}
                onClick={() => handleChatClick(chat.doneeId)}
                position="relative"
              >
                <HStack spacing={4}>
                  <Avatar.Root size="sm" shape="circle" className="AvatarRoot">
                    <Avatar.Fallback name={chat.doneeName} />
                    <Avatar.Image src={`http://localhost:5000/uploads/${chat.profileImage}`}/>
                  </Avatar.Root>
                  <Box flex="1">
                    <Flex justify="space-between" align="center">
                      <Text fontWeight="bold">{chat.doneeName}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {formatMessageDate(chat.lastMessageTime)}
                      </Text>
                    </Flex>
                    <Text 
                      noOfLines={1} 
                      color={chat.unreadCount > 0 ? "black" : "gray.600"}
                      fontWeight={chat.unreadCount > 0 ? "semibold" : "normal"}
                    >
                      {chat.lastMessage}
                    </Text>
                  </Box>
                  {chat.unreadCount > 0 && (
                    <Badge 
                      colorScheme="blue" 
                      borderRadius="full" 
                      px={2} 
                      py={1}
                    >
                      {chat.unreadCount}
                    </Badge>
                  )}
                </HStack>
              </Box>
            </React.Fragment>
          ))}
        </Box>
      )}

      {activeChat && activeChatData && (
        <DonorChat 
          senderType="donor" 
          senderId={donorId} 
          receiverType="donee" 
          receiverId={activeChat}
          receiverName={activeChatData.doneeName}
          isOpen={isDrawerOpen}
          onClose={handleDrawerClose}
          onMessagesRead={handleMessagesRead}
        />
      )}
      {/* <ToastContainer /> */}
    </Container>
  );
};

export default ChatList;