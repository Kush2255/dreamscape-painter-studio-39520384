
import { CATEGORIES } from './categoryMapping';

// Enhanced function to find the most relevant image ID based on prompt content
export const findRelevantImageId = (prompt: string): number => {
  prompt = prompt.toLowerCase();
  
  // Parse prompt words for more accurate matching
  const promptWords = prompt.split(/\s+/).filter(word => word.length > 2);
  
  // Score each category based on keyword matches with weighting for importance
  const categoryScores = Object.entries(CATEGORIES).map(([categoryName, categoryItems]) => {
    let score = 0;
    let matches = 0;
    let bestMatchingId = null;
    let bestMatchScore = 0;
    
    // For each image in the category, check for keyword matches
    categoryItems.forEach(item => {
      let itemScore = 0;
      
      // Direct phrase match (highest priority)
      if (item.keywords.some(keyword => prompt.includes(keyword.toLowerCase()))) {
        itemScore += 5;
      }
      
      // Individual word matches
      item.keywords.forEach(keyword => {
        const keywordWords = keyword.toLowerCase().split(/\s+/);
        
        promptWords.forEach(promptWord => {
          // Exact word match
          if (keywordWords.includes(promptWord)) {
            itemScore += 3;
          }
          // Partial word match for longer words
          else if (promptWord.length > 3) {
            keywordWords.forEach(keywordWord => {
              if (keywordWord.includes(promptWord) || promptWord.includes(keywordWord)) {
                itemScore += 1;
              }
            });
          }
        });
      });
      
      // Track if this item had any matches
      if (itemScore > 0) {
        matches++;
        score += itemScore;
        
        // Keep track of the best matching item in this category
        if (itemScore > bestMatchScore) {
          bestMatchScore = itemScore;
          bestMatchingId = item.id;
        }
      }
    });
    
    // Adjust score based on distribution of matches across category items
    if (matches > 0) {
      // More distributed matches slightly reduce score to favor focused matches
      score = score * (1 + (matches / categoryItems.length));
    }
    
    return { 
      categoryName, 
      score, 
      bestMatchingId: bestMatchingId || categoryItems[0].id 
    };
  });
  
  // Sort categories by score (highest first)
  categoryScores.sort((a, b) => b.score - a.score);

  // Debug information to help diagnose matches
  console.log('Top category matches:', categoryScores.slice(0, 3).map(c => 
    `${c.categoryName} (score: ${c.score.toFixed(1)}, id: ${c.bestMatchingId})`
  ).join(', '));
  
  // If we have a clear winner with matches
  if (categoryScores[0].score > 0) {
    return categoryScores[0].bestMatchingId;
  }
  
  // Fallback if no matches: use a random ID from any category
  const allItems = Object.values(CATEGORIES).flat();
  const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
  return randomItem.id;
};
