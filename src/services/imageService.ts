import { toast } from "sonner";

// Model options
export const MODELS = [
  { value: "runwayml/stable-diffusion-v1-5", label: "Stable Diffusion 1.5" },
  { value: "stabilityai/stable-diffusion-xl-base-1.0", label: "Stable Diffusion XL" },
  { value: "stabilityai/sdxl-turbo", label: "SDXL Turbo" },
  { value: "prompthero/openjourney", label: "Openjourney" },
];

// Sizes options
export const SIZES = [
  { value: "512x512", label: "512×512" },
  { value: "768x768", label: "768×768" },
  { value: "1024x1024", label: "1024×1024" },
  { value: "1024x576", label: "1024×576 (16:9)" },
  { value: "576x1024", label: "576×1024 (9:16)" },
];

export interface GenerateImageParams {
  prompt: string;
  model: string;
  size: string;
  numImages: number;
  negativePrompt?: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  seed?: number;
}

// Enhanced category-to-image mappings with specific IDs and more precise keywords
const CATEGORIES = {
  nature: [
    { id: 15, keywords: ["mountain", "outdoor", "landscape", "hill", "nature"] },
    { id: 33, keywords: ["forest", "trees", "green", "woods", "woodland"] },
    { id: 37, keywords: ["valley", "scenic", "hills", "countryside", "grassland"] },
    { id: 110, keywords: ["lake", "water", "serene", "pond", "reflection"] },
    { id: 64, keywords: ["beach", "ocean", "coast", "sea", "sand", "shore"] },
    { id: 76, keywords: ["flowers", "garden", "blooms", "floral", "botanical"] },
    { id: 1018, keywords: ["snow", "winter", "cold", "ice", "frost"] },
  ],
  cityscape: [
    { id: 260, keywords: ["skyline", "downtown", "city", "metropolis", "urban"] },
    { id: 452, keywords: ["buildings", "architecture", "urban", "structure", "skyscraper"] },
    { id: 429, keywords: ["street", "road", "city life", "avenue", "boulevard"] },
    { id: 172, keywords: ["night city", "lights", "urban night", "evening", "nightlife"] },
    { id: 315, keywords: ["bridge", "infrastructure", "crossing", "span", "connection"] },
  ],
  portrait: [
    { id: 338, keywords: ["woman", "female", "portrait", "girl", "lady"] },
    { id: 823, keywords: ["man", "male", "portrait", "guy", "gentleman"] },
    { id: 660, keywords: ["child", "kid", "young", "youth", "toddler"] },
    { id: 26, keywords: ["old person", "elderly", "aged", "senior", "retiree"] },
    { id: 453, keywords: ["group", "people", "crowd", "gathering", "audience"] },
    { id: 177, keywords: ["portrait", "face", "headshot", "person", "model"] },
  ],
  abstract: [
    { id: 1084, keywords: ["pattern", "geometric", "shapes", "design", "motif"] },
    { id: 447, keywords: ["colorful", "vibrant", "bright", "multicolored", "rainbow"] },
    { id: 1069, keywords: ["abstract", "artistic", "non-representational", "surreal", "modern art"] },
    { id: 1020, keywords: ["texture", "surface", "material", "background", "canvas"] },
  ],
  animals: [
    { id: 237, keywords: ["dog", "canine", "pet", "puppy", "hound"] },
    { id: 40, keywords: ["cat", "feline", "pet", "kitten", "domestic animal"] },
    { id: 582, keywords: ["bird", "avian", "flying", "feathered", "wings"] },
    { id: 790, keywords: ["wildlife", "wild animal", "nature", "fauna", "creature"] },
    { id: 659, keywords: ["horse", "equine", "mammal", "pony", "stallion"] },
    { id: 219, keywords: ["bear", "grizzly", "wildlife", "predator", "mammal"] },
    { id: 433, keywords: ["lion", "big cat", "predator", "jungle", "safari"] },
  ],
  technology: [
    { id: 0, keywords: ["computer", "tech", "device", "laptop", "digital"] },
    { id: 48, keywords: ["digital", "screen", "display", "monitor", "electronic"] },
    { id: 160, keywords: ["robot", "ai", "machine", "automation", "artificial intelligence"] },
    { id: 370, keywords: ["futuristic", "sci-fi", "future", "advanced", "innovation"] },
    { id: 1056, keywords: ["gadget", "electronic", "device", "equipment", "smart"] },
    { id: 404, keywords: ["code", "programming", "software", "development", "technology"] },
  ],
  food: [
    { id: 292, keywords: ["meal", "dish", "plate", "dinner", "lunch"] },
    { id: 1080, keywords: ["fruit", "healthy", "fresh", "produce", "nutritious"] },
    { id: 225, keywords: ["dessert", "sweet", "cake", "pastry", "confection"] },
    { id: 493, keywords: ["vegetable", "greens", "produce", "healthy", "organic"] },
    { id: 132, keywords: ["drink", "beverage", "liquid", "refreshment", "cup"] },
    { id: 42, keywords: ["coffee", "cafe", "espresso", "latte", "brew"] },
  ],
  art: [
    { id: 200, keywords: ["painting", "artwork", "canvas", "masterpiece", "artistic"] },
    { id: 349, keywords: ["drawing", "sketch", "illustration", "graphic", "pencil"] },
    { id: 674, keywords: ["sculpture", "statue", "3d art", "carving", "monument"] },
    { id: 423, keywords: ["masterpiece", "classic", "famous", "renowned", "celebrated"] },
    { id: 628, keywords: ["creative", "artistic", "imaginative", "inventive", "innovative"] },
  ],
  space: [
    { id: 701, keywords: ["stars", "galaxy", "universe", "cosmos", "celestial"] },
    { id: 808, keywords: ["planets", "solar system", "cosmic", "orbital", "space"] },
    { id: 683, keywords: ["nebula", "space cloud", "astronomical", "stellar", "cosmic dust"] },
    { id: 717, keywords: ["space", "cosmic", "astronomy", "interstellar", "void"] },
  ],
  fantasy: [
    { id: 326, keywords: ["magical", "fantasy", "mythical", "enchanted", "mystical"] },
    { id: 611, keywords: ["dragon", "creature", "mythological", "beast", "legendary"] },
    { id: 867, keywords: ["medieval", "castle", "kingdom", "fortress", "ancient"] },
    { id: 501, keywords: ["fairy", "magical being", "enchanted", "fantasy creature", "pixie"] },
    { id: 235, keywords: ["unicorn", "mythical", "fantasy", "magical creature", "legend"] },
  ],
  transportation: [
    { id: 111, keywords: ["car", "vehicle", "automobile", "transportation", "wheels"] },
    { id: 191, keywords: ["airplane", "aircraft", "flight", "aviation", "flying"] },
    { id: 1073, keywords: ["train", "locomotive", "railway", "track", "transit"] },
    { id: 331, keywords: ["boat", "ship", "vessel", "nautical", "sailing"] },
  ],
  business: [
    { id: 119, keywords: ["office", "business", "workspace", "corporate", "professional"] },
    { id: 1011, keywords: ["meeting", "conference", "discussion", "collaboration", "teamwork"] },
    { id: 90, keywords: ["laptop", "computer", "work", "business", "desk"] },
  ],
  architecture: [
    { id: 342, keywords: ["modern architecture", "contemporary", "building", "design", "structure"] },
    { id: 164, keywords: ["church", "religious", "historic", "cathedral", "temple"] },
    { id: 309, keywords: ["ancient", "historic", "old", "ruins", "archeological"] },
  ]
};

// Enhanced function to find the most relevant image ID based on prompt content
const findRelevantImageId = (prompt: string): number => {
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
  
  // If we have a clear winner with matches
  if (categoryScores[0].score > 0) {
    return categoryScores[0].bestMatchingId;
  }
  
  // Fallback if no matches: use a random ID from any category
  const allItems = Object.values(CATEGORIES).flat();
  const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
  return randomItem.id;
};

// Improved generation service
export const generateImages = async (params: GenerateImageParams): Promise<GeneratedImage[]> => {
  try {
    const loadingToast = toast.loading(`Generating ${params.numImages} image(s)...`);
    
    // For demo purposes, simulate an API call with a timeout
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const results: GeneratedImage[] = [];
    const [width, height] = params.size.split("x").map(Number);
    
    // Generate images that are relevant to the prompt
    for (let i = 0; i < params.numImages; i++) {
      const randomSeed = Math.floor(Math.random() * 1000000);
      
      // Find the most relevant image ID based on the prompt
      const relevantImageId = findRelevantImageId(params.prompt);
      
      // Use Picsum photos with specific IDs for better context matching
      const url = `https://picsum.photos/id/${relevantImageId}/${width}/${height}?random=${randomSeed}`;
      
      results.push({
        url,
        prompt: params.prompt,
        seed: randomSeed,
      });

      // Add a slight delay between image generation to simulate a more natural flow
      if (i < params.numImages - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    toast.dismiss(loadingToast);
    toast.success(`Successfully generated ${params.numImages} image(s)`);
    
    return results;
  } catch (error) {
    console.error('Error generating images:', error);
    toast.error('Failed to generate images. Please try again.');
    return [];
  }
};

// Function to download an image
export const downloadImage = async (url: string, filename: string = 'generated-image.jpg') => {
  try {
    // For CORS-enabled sources, we can use this method
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the object URL
    URL.revokeObjectURL(objectUrl);
    
    toast.success('Image downloaded successfully');
  } catch (error) {
    console.error('Error downloading image:', error);
    toast.error('Failed to download image. Try right-clicking on the image and selecting "Save Image As..."');
  }
};
