require("dotenv").config();
const mongoose = require("mongoose");
const FAQ = require("./models/FAQ");

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const faqData = [
  { question: "How do I donate?", answer: "Go to the 'Donate' section, select items, and submit the form." },
  { question: "How do I volunteer?", answer: "Check the 'Volunteer' page and apply for upcoming events." },
  { question: "What is Helping Hands?", answer: "Helping Hands is an NGO supporting orphanages." },
];

FAQ.insertMany(faqData)
  .then(() => {
    console.log("FAQ added successfully!");
    mongoose.connection.close();
  })
  .catch((error) => console.log("Error:", error));
