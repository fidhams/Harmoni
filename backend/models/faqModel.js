const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  instruction: { type: String, required: true },
  input: { type: String, default: "" },
  output: { type: String, required: true },
});

const FAQ = mongoose.model("FAQ", faqSchema);

module.exports = FAQ;
