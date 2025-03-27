import { GoogleGenerativeAI } from "@google/generative-ai";
import Donor from '../models/donor.js';

class GeminiVolunteerSearch {
  constructor() {
    // Initialize Gemini AI
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash" 
    });
  }

  // Semantic search method using Gemini
  async semanticSearch(searchQuery) {
    try {
      // Step 1: Enhance and understand the search query
      const queryEnhancementPrompt = `
        Given the search query: "${searchQuery}", 
        generate a comprehensive set of related skills, alternative terms, synonyms, and broader or specialized skill variations.  
  Additionally, identify relevant volunteer roles, job roles, and areas where these skills are commonly applied. 
        Provide a detailed, nuanced interpretation 
        that captures the essence of the required skills.
      `;

      const enhancementResult = await this.model.generateContent(queryEnhancementPrompt);
      const enhancedQueryContext = enhancementResult.response.text();

      // Step 2: Fetch all volunteers
      const volunteers = await Donor.find();

      // Step 3: Use Gemini to score relevance for each donor
      const scoredVolunteers = await Promise.all(
        volunteers.map(async (donor) => {
          const relevancePrompt = `
            Evaluate the relevance of a donor with 
            the following profile against this search context:

            Search Context: ${enhancedQueryContext}

            Donor Profile:
            Name: ${donor.name}
            Skills: ${donor.skills}
            Skill Description: ${donor.description}

            Provide a relevance score from 0 to 1, 
            where 1 is a perfect match and 0 is completely irrelevant. 
            Explain your reasoning briefly.
          `;

          try {
            const relevanceResult = await this.model.generateContent(relevancePrompt);
            const responseText = relevanceResult.response.text();
            
            // Extract numerical score (this might need refinement)
            const scoreMatch = responseText.match(/(\d+(\.\d+)?)/);
            const relevanceScore = scoreMatch ? parseFloat(scoreMatch[0]) : 0;

            return {
              ...donor.toObject(),
              relevanceScore,
              matchReason: responseText
            };
          } catch (scoringError) {
            console.error('Scoring error for donor:', donor.name, scoringError);
            return {
              ...donor.toObject(),
              relevanceScore: 0,
              matchReason: 'Could not evaluate'
            };
          }
        })
      );

      // Filter and sort volunteers by relevance
      return scoredVolunteers
        .filter(v => v.relevanceScore > 0.5)
        .sort((a, b) => b.relevanceScore - a.relevanceScore);
    } catch (error) {
      console.error('Gemini Semantic Search Error:', error);
      throw error;
    }
  }
}

export default GeminiVolunteerSearch;