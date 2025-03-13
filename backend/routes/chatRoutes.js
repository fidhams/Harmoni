const express = require("express");
const { getChats, sendMessage } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/:roomId", protect, getChats);      // Fetch chat messages for a room
router.post("/", protect, sendMessage);        // Send a new message

module.exports = router;
