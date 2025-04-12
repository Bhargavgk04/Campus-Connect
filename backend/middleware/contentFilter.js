import { BadRequestError } from '../utils/errorHandler.js';
import RestrictedWord from '../models/RestrictedWord.js';

// Default restricted words (can be overridden by database entries)
const defaultRestrictedWords = [
  // Profanity
  { word: 'fuck', category: 'profanity', severity: 'high' },
  { word: 'shit', category: 'profanity', severity: 'high' },
  { word: 'damn', category: 'profanity', severity: 'medium' },
  { word: 'hell', category: 'profanity', severity: 'medium' },
  { word: 'bitch', category: 'profanity', severity: 'high' },
  { word: 'ass', category: 'profanity', severity: 'medium' },
  { word: 'crap', category: 'profanity', severity: 'medium' },
  { word: 'dick', category: 'profanity', severity: 'high' },
  { word: 'pussy', category: 'profanity', severity: 'high' },
  
  // Hate speech
  { word: 'hate', category: 'hate', severity: 'high' },
  { word: 'kill', category: 'violence', severity: 'high' },
  { word: 'suicide', category: 'violence', severity: 'high' },
  { word: 'murder', category: 'violence', severity: 'high' },
  { word: 'terror', category: 'violence', severity: 'high' },
  { word: 'bomb', category: 'violence', severity: 'high' },
  
  // Drugs
  { word: 'drug', category: 'drugs', severity: 'high' },
  { word: 'weed', category: 'drugs', severity: 'medium' },
  { word: 'cocaine', category: 'drugs', severity: 'high' },
  { word: 'heroin', category: 'drugs', severity: 'high' },
  { word: 'marijuana', category: 'drugs', severity: 'medium' },
  { word: 'cannabis', category: 'drugs', severity: 'medium' },
  
  // Insults
  { word: 'stupid', category: 'insult', severity: 'medium' },
  { word: 'idiot', category: 'insult', severity: 'medium' },
  { word: 'dumb', category: 'insult', severity: 'medium' },
  { word: 'retard', category: 'insult', severity: 'high' },
  { word: 'moron', category: 'insult', severity: 'medium' }
];

// Function to check if content contains restricted words
const containsRestrictedWords = (content, restrictedWords) => {
  // Convert content to lowercase and remove punctuation
  const normalizedContent = content.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ');
  
  // Split into words and remove empty strings
  const words = normalizedContent.split(/\s+/).filter(word => word.length > 0);
  
  // Check for exact matches
  for (const restrictedWord of restrictedWords) {
    if (words.includes(restrictedWord.word.toLowerCase())) {
      return restrictedWord;
    }
  }
  
  // Check for partial matches (words containing restricted words)
  for (const word of words) {
    const foundWord = restrictedWords.find(restrictedWord => 
      word.includes(restrictedWord.word.toLowerCase())
    );
    if (foundWord) {
      return foundWord;
    }
  }
  
  return null;
};

export const contentFilter = async (req, res, next) => {
  try {
    // Get content to check
    const contentToCheck = [];
    
    // Check question content
    if (req.body.title) contentToCheck.push(req.body.title);
    if (req.body.content) contentToCheck.push(req.body.content);
    
    // Check answer content
    if (req.body.answer) contentToCheck.push(req.body.answer);
    if (req.body.content) contentToCheck.push(req.body.content); // For answers
    
    // Check comment content
    if (req.body.comment) contentToCheck.push(req.body.comment);

    // Get restricted words from database
    let restrictedWords = await RestrictedWord.find({}, 'word category severity');
    
    // If no words in database, use default words
    if (restrictedWords.length === 0) {
      restrictedWords = defaultRestrictedWords;
    }

    // Check each piece of content
    for (const content of contentToCheck) {
      if (!content) continue; // Skip empty content
      
      const restrictedWord = containsRestrictedWords(content, restrictedWords);
      if (restrictedWord) {
        throw new BadRequestError(
          `Your content contains inappropriate language. The word "${restrictedWord.word}" (${restrictedWord.category}) is not allowed.`
        );
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}; 