const express = require("express");
const { GoogleGenerativeAI, GoogleAIFileManager } = require("@google/generative-ai");
require("dotenv").config();

const router = express.Router();
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

let uploadedFile = null; // Store the uploaded file reference

// Upload the file once and reuse it
async function uploadFile() {
    try {
        const uploadResult = await fileManager.uploadFile("../../data.txt", {
            mimeType: "text/plain",
            displayName: "Harmoni Data",
        });
        uploadedFile = uploadResult.file;
        console.log(`Uploaded file: ${uploadedFile.displayName} (ID: ${uploadedFile.name})`);
    } catch (error) {
        console.error("File upload error:", error);
    }
}

// Call the function to upload the file on server start
uploadFile();

router.post("/chat", async (req, res) => {
    try {
        if (!uploadedFile) {
            return res.status(500).json({ error: "File upload failed" });
        }

        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ error: "Message cannot be empty" });
        }

        // Use the file in chat session
        const chatSession = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [
                        {
                            fileData: {
                                mimeType: "text/plain",
                                fileUri: uploadedFile.uri,
                            },
                        },
                        {
                            text: "You are an assistant for Harmoni. Use the file to provide accurate answers.",
                        },
                    ],
                },
            ],
        });

        const result = await chatSession.sendMessage(userMessage);

        res.json({ response: result.response.text() });
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        res.status(500).json({ error: "Internal server error" });
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