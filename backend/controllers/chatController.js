const ChatInitiation = require("../models/ChatInitiation");
const Message = require("../models/Message");
const Donor = require("../models/donor");
const Donee = require("../models/donee");

const getUserName = async (type, id) => {
  if (type === 'donor') {
    const donor = await Donor.findById(id);
    return donor?.name || "Unknown Donor";
  } else {
    const donee = await Donee.findById(id);
    return donee?.name || "Unknown Donee";
  }
};

// ========== Message Handlers ==========
const getChats = async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await Message.find({ room: roomId }).sort({ timestamp: 1 });
    
    // Add sender and receiver names to messages
    const messagesWithNames = await Promise.all(messages.map(async (msg) => {
      return {
        ...msg._doc,
        sender: await getUserName(msg.senderType, msg.senderId),
        receiver: await getUserName(msg.receiverType, msg.receiverId)
      };
    }));
    
    res.status(200).json(messagesWithNames);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
};

const sendMessage = async (req, res) => {
  const { senderType, senderId, receiverType, receiverId, message, room } = req.body;
  const sender = await getUserName(req.body.senderType, req.body.senderId);
  const receiver = await getUserName(req.body.receiverType, req.body.receiverId);
  try {
    const newMsg = await Message.create({
      senderType,
      senderId,
      sender,
      receiverType,
      receiverId,
      receiver,
      message,
      room
    });
    res.status(201).json(newMsg);
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
};

// ========== Initiation Handlers ==========
const initiateChat = async (req, res) => {
  const { doneeId, donorId } = req.body;

  try {
    const existing = await ChatInitiation.findOne({ doneeId, donorId });
    if (existing) {
      return res.status(200).json({ message: "Chat already initiated" });
    }

    const chat = await ChatInitiation.create({ doneeId, donorId });
    res.status(201).json({ message: "Chat initiated", chat });
  } catch (error) {
    res.status(500).json({ message: "Error initiating chat", error });
  }
};

// This function needs to match what the frontend expects
const checkChatPermission = async (req, res) => {
  const { doneeId, donorId } = req.params;

  try {
    const chat = await ChatInitiation.findOne({ doneeId, donorId, blocked: false });
    if (chat) {
      return res.status(200).json({ allowed: true });
    } else {
      return res.status(200).json({ allowed: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Error checking chat permission", error });
  }
};

// Keeping this for backward compatibility
const canDonorChat = async (req, res) => {
  const { doneeId, donorId } = req.params;

  try {
    const chat = await ChatInitiation.findOne({ doneeId, donorId, blocked: false });
    if (chat) {
      return res.status(200).json({ canChat: true });
    } else {
      return res.status(200).json({ canChat: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Error checking chat", error });
  }
};


const getDonorChatList = async (req, res) => {
  const { donorId } = req.params;
  // Add validation for donorId
  if (!donorId || donorId === "null") {
    return res.status(400).json({ message: "Invalid donor ID" });
  }
  
  try {
    // Find all chat initiations where this donor is involved
    const chatInitiations = await ChatInitiation.find({ 
      donorId, 
      blocked: false 
    });
    
    if (!chatInitiations.length) {
      return res.status(200).json([]);
    }
    
    // Create an array of chat data with the most recent message
    const chatData = await Promise.all(chatInitiations.map(async (chat) => {
      // Get donee info
      const donee = await Donee.findById(chat.doneeId);
      if (!donee) {
        return null; // Skip if donee not found
      }
      
      // Get the latest message
      const roomId = [
        'donee' + chat.doneeId, 
        'donor' + donorId
      ].sort().join('_');
      
      const latestMessage = await Message.findOne({ room: roomId })
        .sort({ timestamp: -1 });
      
      // Count unread messages (messages to donor that haven't been read)
      const unreadCount = await Message.countDocuments({
        room: roomId,
        receiverType: 'donor',
        receiverId: donorId,
        read: { $ne: true } // Where read is not true
      });
      
      return {
        _id: chat._id,
        doneeId: chat.doneeId,
        doneeName: donee.name,
        doneeAvatar: donee.avatarUrl || null,
        lastMessage: latestMessage ? latestMessage.message : 'Start a conversation',
        lastMessageTime: latestMessage ? latestMessage.timestamp : chat.createdAt,
        unreadCount,
        initiatedAt: chat.createdAt
      };
    }));
    
    // Filter out any null entries and sort by most recent message
    const validChats = chatData
      .filter(chat => chat !== null)
      .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
    
    res.status(200).json(validChats);
    
  } catch (error) {
    console.error("Error fetching donor chat list:", error);
    res.status(500).json({ message: "Error fetching chat list", error });
  }
};

// Add a route to mark messages as read
const markMessagesAsRead = async (req, res) => {
  const { roomId, receiverType, receiverId } = req.params;
  
  try {
    await Message.updateMany(
      { 
        room: roomId, 
        receiverType, 
        receiverId,
        read: { $ne: true }
      },
      { $set: { read: true } }
    );
    
    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ message: "Error marking messages as read", error });
  }
};


module.exports = {
  getChats,
  sendMessage,
  initiateChat,
  canDonorChat,
  checkChatPermission,
  getDonorChatList,
  markMessagesAsRead
};