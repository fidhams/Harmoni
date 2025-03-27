const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const API_KEY = process.env.GEMINI_API_KEY; 
const genAI = new GoogleGenerativeAI(API_KEY);

async function testGemini() {
  try {
      const { searchQuery } = req.body;
  
      // Use Gemini to enhance the search query
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      // Generate semantic search enhancement
      const enhancedQueryResult = await model.generateContent(
        `Expand this search query into a comprehensive set of relevant skills and keywords: ${searchQuery}`
      );
      const enhancedQuery = enhancedQueryResult.response.text();
  
      // MongoDB aggregation pipeline for intelligent search
      const volunteers = await Donor.aggregate([
        {
          $addFields: {
            // Calculate semantic match score
            semanticMatchScore: {
              $function: {
                body: function(skills, description, query) {
                  // Implement custom semantic matching logic
                  const matchLogic = (skillsStr, descStr, queryStr) => {
                    const skillMatch = skillsStr.toLowerCase().includes(queryStr.toLowerCase());
                    const descMatch = descStr.toLowerCase().includes(queryStr.toLowerCase());
                    return skillMatch || descMatch ? 1 : 0;
                  };
                  return matchLogic(skills, description, query);
                },
                args: ["$skills", "$skillDescription", enhancedQuery],
                lang: "js"
              }
            }
          }
        },
        // Filter volunteers with matching semantic score
        { $match: { semanticMatchScore: { $gt: 0 } } },
        // Sort by match relevance
        { $sort: { semanticMatchScore: -1 } }
      ]);
  
      res.json({
        success: true,
        results: volunteers,
        enhancedQuery
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Search failed", 
        error: error.message 
      });
    };
}
// async function testGemini() {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
//     const result = await model.generateContent(["Hello, how are you?"]);
//     console.log(result.response.text());
//   } catch (err) {
//     console.error("Error:", err);
//   }
// }

testGemini();
