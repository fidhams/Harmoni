const { NlpManager } = require('node-nlp');
const fs = require('fs');
const path = require('path');

class HarmoniNlpProcessor {
  constructor() {
    this.manager = new NlpManager({ 
      languages: ['en'],
      forceNER: true,
      nlu: { log: false }
    });
    this.trained = false;
  }
  
  async trainFromJSONL(filePath) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const lines = data.trim().split('\n');
      
      for (const line of lines) {
        const { instruction, output } = JSON.parse(line);
        
        // Create an intent from the instruction
        const intent = this.createIntentName(instruction);
        
        // Add document and answer
        this.manager.addDocument('en', instruction, intent);
        this.manager.addAnswer('en', intent, output);
        
        // Add variations of the instruction for better matching
        this.addVariations(instruction, intent);
      }
      
      console.log('Training NLP model...');
      await this.manager.train();
      this.trained = true;
      console.log('NLP model trained successfully');
      
      // Save the model for future use (optional)
      await this.manager.save(path.join(__dirname, 'harmoni-model.nlp'));
      
      return true;
    } catch (error) {
      console.error('Error training from JSONL:', error);
      return false;
    }
  }
  
  // Process an array of QA objects
  async trainFromArray(qaArray) {
    try {
      for (const qa of qaArray) {
        const { instruction, output } = qa;
        
        // Create an intent from the instruction
        const intent = this.createIntentName(instruction);
        
        // Add document and answer
        this.manager.addDocument('en', instruction, intent);
        this.manager.addAnswer('en', intent, output);
        
        // Add variations of the instruction for better matching
        this.addVariations(instruction, intent);
      }
      
      console.log('Training NLP model...');
      await this.manager.train();
      this.trained = true;
      console.log('NLP model trained successfully');
      
      // Save the model for future use (optional)
      await this.manager.save(path.join(__dirname, 'harmoni-model.nlp'));
      
      return true;
    } catch (error) {
      console.error('Error training from array:', error);
      return false;
    }
  }
  
  // Create a standardized intent name from a question
  createIntentName(question) {
    // Clean the question and convert to lowercase
    const cleaned = question.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50); // Limit length
    
    // Add a prefix to make it clear this is a Harmoni intent
    return `harmoni.${cleaned}`;
  }
  
  // Add variations of questions to improve matching
  addVariations(question, intent) {
    // Generate common variations of questions
    const variations = [
      question.replace('How do I', 'How can I'),
      question.replace('How do I', 'How to'),
      question.replace('Can I', 'Is it possible to'),
      question.replace('What is', 'Tell me about'),
      question.replace('?', '')
    ];
    
    // Only add valid variations (not same as original and not empty)
    for (const variation of variations) {
      if (variation !== question && variation.trim().length > 5) {
        this.manager.addDocument('en', variation, intent);
      }
    }
  }
  
  async processMessage(message) {
    // Make sure the model is trained
    if (!this.trained) {
      throw new Error('NLP model not trained. Please train the model first.');
    }
    
    // Process the message
    const result = await this.manager.process('en', message);
    
    // If confidence is too low, provide a fallback response
    if (result.intent === 'None' || result.score < 0.5) {
      return {
        intent: 'unknown',
        score: result.score,
        response: "I'm not sure I understand your question about Harmoni. Could you rephrase it or ask something about donations, volunteering, or using the platform?"
      };
    }
    
    return {
      intent: result.intent,
      score: result.score,
      response: result.answer
    };
  }
  
  // Load a previously saved model
  async loadModel(modelPath) {
    try {
      await this.manager.load(modelPath);
      this.trained = true;
      console.log('Model loaded successfully');
      return true;
    } catch (error) {
      console.error('Error loading model:', error);
      return false;
    }
  }
}

module.exports = new HarmoniNlpProcessor();