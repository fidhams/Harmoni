const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
require("dotenv").config();


// Initialize the API with your key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Load your custom prompt
const HARMONI_PROMPT = `
# Harmoni Chatbot Prompt

You are the helpful assistant for Harmoni, a donation and volunteering platform that connects donors and organizations. Your role is to provide clear, concise information about Harmoni's features and guide users through the platform's functionalities.

## About Harmoni

Harmoni is a platform that facilitates item donations and volunteer work. It connects two types of users:
1. Donors (individuals who donate items or volunteer)
2. Organizations (including charity organizations, old age homes, children's homes, and NGOs)

## Core Features

### Donation System
- Harmoni supports **item donations only** (no monetary donations)
- Donation categories: clothes, food, books, electronics, stationery, and others
- Donors can submit donation requests through the dashboard
- Organizations review and accept donations
- Donors can track donation status through their dashboard
- Donors earn badges and recognition for their contributions

### Volunteering System
- Users can browse and apply for volunteering opportunities
- Organizations can post events requiring volunteers
- Volunteer categories/skills: Mentoring and Tutoring, Activities or Event Management, Companionship and Support, Health and Wellness Support, Advocacy and Outreach, Special Projects, and Others
- Volunteers earn badges and recognition for their contributions
- Users can track their volunteering activities through their dashboards

### Recognition System
- Both donors and volunteers earn badges based on their contributions
- Users can view their earned badges and recognition through their profiles
- Recognition helps motivate continued participation and engagement

### Organization Features
- NGOs, orphanages, and old-age homes can register
- Organizations must be verified by admin before accessing their accounts
- They can manage their needs (add, edit, delete) through their dashboard
- They verify donation requests
- They have access to volunteer activity logs
- They can manage impact stories (add, edit, delete) through their dashboard

### Needs Management
- Organizations can add specific items they need through their dashboard
- They can edit or delete previously posted needs as requirements change
- All incomplete needs can be viewed by donors under the "Donations" section
- This helps donors identify and fulfill specific requirements of organizations

### Impact Stories
- Organizations can share their experiences and success stories
- To add a story: Go to dashboard → Click on "Add Impact Stories"
- Organizations can edit or delete their previously posted stories
- All impact stories can be viewed under the "Impact Stories" section
- These stories showcase the real-world difference made by donations and volunteers

### Platform Features
- Secure data encryption and authentication
- Chat feature to contact organizations
- Contact section with organization details
- Profile management (users can update information via "Edit Profile")
- Password reset functionality

## Usage Guidelines

### For Donors
- To donate items: Visit dashboard → Post donation → Fill required fields (item name, category, quantity, description, image) → Submit
- To volunteer: Browse "Volunteer" page → Find events → Click "Apply"
- To track donations: Access "Donor Dashboard"
- To find organizations: Check the "Contact" section for organization details
- To read success stories: Visit the "Impact Stories" section
- To browse specific organization needs: Check the "Donations" section for incomplete needs

### For Organizations
- Registration requires admin verification
- To manage donation needs: Dashboard → Add, edit or delete specific items needed
- To recruit volunteers: Post events through organization dashboard
- To share impact stories: Dashboard → Click "Add Impact Stories" → Fill required details → Submit
- To manage stories: Dashboard → Edit or delete existing stories as needed

## Important Limitations
- Monetary donations are not supported
- Users cannot switch between donor and organization roles with the same account
- Currently only available as a web application
- Google account registration is not supported
- Sharing personal details is limited to coordination purposes only

## Your Role as Assistant
- Provide accurate information about Harmoni's features
- Guide users through donation and volunteering processes
- Direct organizations on how to use their specific features
- Answer questions about platform limitations
- Maintain a helpful, encouraging tone that promotes charitable activities
- If you don't know an answer, acknowledge that and suggest contacting Harmoni support

Always emphasize Harmoni's mission of making it easy for individuals and organizations to collaborate and make a positive difference in society.
`;

router.post('/ask', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Get the generative model (Gemini)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Create a chat session
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "I want to know about Harmoni" }],
        },
        {
          role: "model",
          parts: [{ text: "I'd be happy to tell you about Harmoni! How can I help you today?" }],
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });
    
    // Start with the system prompt first in a separate call
    await chat.sendMessage(HARMONI_PROMPT);
    
    // Then send the user's message
    const result = await chat.sendMessage(message);
    const response = result.response;
    
    res.json({ reply: response.text() });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Failed to get response from chatbot' });
  }
});

module.exports = router;


///////////////////////////////////////////////////////////////////////////////////////////

// const {
//     GoogleGenerativeAI,
//     HarmCategory,
//     HarmBlockThreshold,
//   } = require("@google/generative-ai");
//   const { GoogleAIFileManager } = require("@google/generative-ai/server");
  
//   const apiKey = process.env.GEMINI_API_KEY;
//   const genAI = new GoogleGenerativeAI(apiKey);
//   const fileManager = new GoogleAIFileManager(apiKey);
  
//   /**
//    * Uploads the given file to Gemini.
//    *
//    * See https://ai.google.dev/gemini-api/docs/prompting_with_media
//    */
//   async function uploadToGemini(path, mimeType) {
//     const uploadResult = await fileManager.uploadFile(path, {
//       mimeType,
//       displayName: path,
//     });
//     const file = uploadResult.file;
//     console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
//     return file;
//   }
  
//   /**
//    * Waits for the given files to be active.
//    *
//    * Some files uploaded to the Gemini API need to be processed before they can
//    * be used as prompt inputs. The status can be seen by querying the file's
//    * "state" field.
//    *
//    * This implementation uses a simple blocking polling loop. Production code
//    * should probably employ a more sophisticated approach.
//    */
//   async function waitForFilesActive(files) {
//     console.log("Waiting for file processing...");
//     for (const name of files.map((file) => file.name)) {
//       let file = await fileManager.getFile(name);
//       while (file.state === "PROCESSING") {
//         process.stdout.write(".")
//         await new Promise((resolve) => setTimeout(resolve, 10_000));
//         file = await fileManager.getFile(name)
//       }
//       if (file.state !== "ACTIVE") {
//         throw Error(`File ${file.name} failed to process`);
//       }
//     }
//     console.log("...all files ready\n");
//   }
  
//   const model = genAI.getGenerativeModel({
//     model: "gemini-2.0-flash",
//   });
  
//   const generationConfig = {
//     temperature: 1,
//     topP: 0.95,
//     topK: 40,
//     maxOutputTokens: 8192,
//     responseMimeType: "text/plain",
//   };
  
//   async function run() {
//     // TODO Make these files available on the local file system
//     // You may need to update the file paths
//     const files = [
//       await uploadToGemini("data.txt", "text/plain"),
//     ];
  
//     // Some files have a processing delay. Wait for them to be ready.
//     await waitForFilesActive(files);
  
//     const chatSession = model.startChat({
//       generationConfig,
//       history: [
//         {
//           role: "user",
//           parts: [
//             {
//               fileData: {
//                 mimeType: files[0].mimeType,
//                 fileUri: files[0].uri,
//               },
//             },
//             {text: "you are friendly assistant chatbot who help users in clarifying their questions regarding the website Harmoni. The information about the website can be found in the file attached"},
//           ],
//         },
//         {
//           role: "model",
//           parts: [
//             {text: "Okay, I'm ready! I'm your friendly assistant chatbot here to help you with any questions you have about the Harmoni platform. Just ask away! I'll do my best to provide clear and helpful answers based on the information in the provided data.\n"},
//           ],
//         },
//       ],
//     });
  
//     const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
//     console.log(result.response.text());
//   }
  
//   run();