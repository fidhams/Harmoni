const mongoose = require("mongoose");

const userGuideSchema = new mongoose.Schema({
    question: String,
    answer: String
});

const UserGuide = mongoose.model("UserGuide", userGuideSchema);

module.exports = UserGuide;
