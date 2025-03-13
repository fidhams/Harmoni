const Chat = require("../models/Chat");

const getChats = async (req, res) => {
    try {
        const { roomId } = req.params;
        const chats = await Chat.find({ roomId }).populate("sender", "name");
        res.status(200).json(chats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { roomId, message } = req.body;

        const chat = new Chat({
            roomId,
            sender: req.user._id,
            message,
        });

        await chat.save();
        res.status(201).json({ message: "Message sent successfully", chat });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getChats, sendMessage };
