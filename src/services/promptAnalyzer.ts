import { CATEGORIES } from './categoryMapping';

// Enhanced function to find the most relevant image ID based on prompt content
export const findRelevantImageId = (prompt: string): number => {
  prompt = prompt.toLowerCase();
  console.log("Analyzing prompt:", prompt);
  
  // Parse prompt words for more accurate matching
  const promptWords = prompt.split(/\s+/).filter(word => word.length > 2);
  
  // Score each category based on keyword matches with improved weighting
  const categoryScores = Object.entries(CATEGORIES).map(([categoryName, categoryItems]) => {
    let score = 0;
    let matches = 0;
    let bestMatchingId = null;
    let bestMatchScore = 0;
    let matchDetails = [];
    
    // For each image in the category, check for keyword matches
    categoryItems.forEach(item => {
      let itemScore = 0;
      let itemMatchDetails = [];
      
      // Exact match with full prompt (highest priority)
      if (item.keywords.some(keyword => prompt === keyword.toLowerCase())) {
        itemScore += 20;
        itemMatchDetails.push(`Exact full prompt match: +20`);
      }
      
      // Direct phrase match (high priority)
      item.keywords.forEach(keyword => {
        if (prompt.includes(keyword.toLowerCase())) {
          const addedScore = 5 + (keyword.length / prompt.length) * 5;
          itemScore += addedScore;
          itemMatchDetails.push(`Phrase match: "${keyword}" +${addedScore.toFixed(1)}`);
        }
      });
      
      // Individual word matches with weighted importance
      const promptWordsSet = new Set(promptWords);
      item.keywords.forEach(keyword => {
        const keywordWords = keyword.toLowerCase().split(/\s+/);
        
        keywordWords.forEach(keywordWord => {
          if (promptWordsSet.has(keywordWord)) {
            const wordImportance = keywordWord.length / 3; // Longer words are more important
            itemScore += 3 * wordImportance;
            itemMatchDetails.push(`Word match: "${keywordWord}" +${(3 * wordImportance).toFixed(1)}`);
          }
          // Partial word match for longer words
          else if (keywordWord.length > 3) {
            promptWords.forEach(promptWord => {
              if (promptWord.length > 3) {
                if (keywordWord.includes(promptWord) || promptWord.includes(keywordWord)) {
                  const partialScore = Math.min(promptWord.length, keywordWord.length) / Math.max(promptWord.length, keywordWord.length);
                  itemScore += partialScore * 2;
                  itemMatchDetails.push(`Partial match: "${promptWord}" ~ "${keywordWord}" +${(partialScore * 2).toFixed(1)}`);
                }
              }
            });
          }
        });
      });
      
      // Track if this item had any matches
      if (itemScore > 0) {
        matches++;
        score += itemScore;
        matchDetails.push(`Image ID ${item.id}: score ${itemScore.toFixed(1)} (${itemMatchDetails.join(', ')})`);
        
        // Keep track of the best matching item in this category
        if (itemScore > bestMatchScore) {
          bestMatchScore = itemScore;
          bestMatchingId = item.id;
        }
      }
    });
    
    // Adjust score based on distribution of matches across category items
    if (matches > 0) {
      // More distributed matches across many items gives slightly lower confidence
      score = score * (1 + (matches / categoryItems.length) * 0.5);
    }
    
    return { 
      categoryName, 
      score, 
      bestMatchingId: bestMatchingId || categoryItems[0].id,
      matches,
      matchDetails
    };
  });
  
  // Sort categories by score (highest first)
  categoryScores.sort((a, b) => b.score - a.score);

  // Debug information to help diagnose matches
  console.log('Top category matches:');
  categoryScores.slice(0, 3).forEach(c => {
    console.log(`${c.categoryName}: score ${c.score.toFixed(1)}, id: ${c.bestMatchingId} (${c.matches} matches)`);
    c.matchDetails.forEach(detail => console.log(`  - ${detail}`));
  });
  
  // If we have a clear winner with matches
  if (categoryScores[0].score > 0) {
    console.log(`Selected best match: ${categoryScores[0].categoryName}, image ID: ${categoryScores[0].bestMatchingId}`);
    return categoryScores[0].bestMatchingId;
  }
  
  // Fallback if no matches: use a random ID from any category
  const allItems = Object.values(CATEGORIES).flat();
  const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
  console.log(`No strong matches found, using random image ID: ${randomItem.id}`);
  return randomItem.id;
};
