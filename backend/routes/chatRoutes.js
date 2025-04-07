const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// Apply auth middleware to all chat routes
router.use(protect);

// Message routes
router.get('/messages/:roomId', chatController.getChats);
router.post('/messages', chatController.sendMessage);

// Mark messages as read
router.put('/messages/:roomId/read/:receiverType/:receiverId', chatController.markMessagesAsRead);

// Chat initiation routes
router.post('/initiate', chatController.initiateChat);
router.get('/donor-check/:doneeId/:donorId', chatController.canDonorChat);
router.get('/check/:doneeId/:donorId', chatController.checkChatPermission);

// Chat list routes
router.get('/donor/:donorId/chats', chatController.getDonorChatList);

module.exports = router;