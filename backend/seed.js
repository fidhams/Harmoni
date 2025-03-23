const mongoose = require('mongoose');
const FAQ = require('./models/faqModel'); // Ensure this path is correct
require('dotenv').config();

const connectDB = require("./config/db");

connectDB()
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => console.log(err));

const faqs = [
  { instruction: "How do I donate items?", input: "", output: "Go to the 'Donate' page, select the items, and submit the form." },
  { instruction: "Tell me about Helping Hands NGO", input: "", output: "Helping Hands is an NGO that supports orphanages and helps children in need." },
  { instruction: "How do I volunteer for events?", input: "", output: "Check the 'Volunteer' page for upcoming events and click 'Apply' to register." },
  { instruction: "How do I register as a donor?", input: "", output: "Go to the 'Sign Up' page, select 'Donor', and complete the registration form." },
  { instruction: "How do I register as a donee?", input: "", output: "On the 'Sign Up' page, select 'Donee' and fill in the required details." },
  { instruction: "How can I donate money?", input: "", output: "Currently, Harmoni supports only item-based donations, not monetary donations." },
  { instruction: "How do I donate food or clothes?", input: "", output: "Visit the 'Donate' page, list the items you want to donate, and submit your request." },
  { instruction: "What is Harmoni?", input: "", output: "Harmoni is a donation and volunteering platform that connects donors, donees, and NGOs." },
  { instruction: "Can I track my donations?", input: "", output: "Yes, visit your 'Donor Dashboard' to check the status of your donations." },
  { instruction: "How do I contact an NGO?", input: "", output: "You can use the 'Chat' feature or check the NGO’s profile for contact details." },
  { instruction: "Is my data safe on Harmoni?", input: "", output: "Yes, we use secure authentication and encryption to protect user data." },
  { instruction: "Can organizations create events?", input: "", output: "Yes, NGOs can post events through their organization dashboard." },
  { instruction: "How do I edit my profile?", input: "", output: "Go to 'Edit Profile' in your dashboard to update your details." },
  { instruction: "What kind of items can I donate?", input: "", output: "You can donate clothes, food, books, toys, and other essentials." },
  { instruction: "How do I see pending donation requests?", input: "", output: "Go to 'Check Donations' under your dashboard to view pending donations." },
  { instruction: "Can I donate anonymously?", input: "", output: "No, but your personal details are only shared with the recipient for coordination purposes." },
  { instruction: "How do I check upcoming volunteering events?", input: "", output: "Visit the 'Volunteer' page to see a list of upcoming events." },
  { instruction: "Do I get any rewards for volunteering?", input: "", output: "Yes! Volunteers earn badges and recognition for their contributions." },
  { instruction: "What are badges in Harmoni?", input: "", output: "Badges are awarded to volunteers based on their participation and contributions." },
  { instruction: "How do I submit an impact story?", input: "", output: "Use the 'Add Impact Story' option on your dashboard to share your experience." },
  { instruction: "Can I volunteer remotely?", input: "", output: "Yes, some NGOs offer online volunteering opportunities like mentoring or content creation." },
  { instruction: "What happens if an NGO rejects my donation?", input: "", output: "You’ll receive a notification, and you can choose to donate to a different NGO." },
  { instruction: "How do I know if an NGO is trustworthy?", input: "", output: "All NGOs on Harmoni go through a verification process before being listed." },
  { instruction: "Can I see a history of my donations?", input: "", output: "Yes, visit the 'Donor Dashboard' to view your donation history." },
  { instruction: "How do I delete my account?", input: "", output: "Go to 'Settings' and select 'Delete Account'. This action is irreversible." },
];

const seedFAQs = async () => {
  try {
    await FAQ.deleteMany({}); // Clear existing FAQs to avoid duplicates
    await FAQ.insertMany(faqs);
    console.log('FAQs seeded successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding FAQs:', error);
    mongoose.connection.close();
  }
};

seedFAQs();
