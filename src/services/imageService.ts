
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

// More specific category-to-image mappings with curated IDs that match the category
const CATEGORIES = {
  nature: [
    { id: 15, keywords: ["mountain", "outdoor", "landscape"] },
    { id: 33, keywords: ["forest", "trees", "green"] },
    { id: 37, keywords: ["valley", "scenic", "hills"] },
    { id: 110, keywords: ["lake", "water", "serene"] },
    { id: 64, keywords: ["beach", "ocean", "coast"] },
    { id: 76, keywords: ["flowers", "garden", "blooms"] },
  ],
  cityscape: [
    { id: 260, keywords: ["skyline", "downtown", "city"] },
    { id: 452, keywords: ["buildings", "architecture", "urban"] },
    { id: 429, keywords: ["street", "road", "city life"] },
    { id: 172, keywords: ["night city", "lights", "urban night"] },
    { id: 315, keywords: ["bridge", "infrastructure", "crossing"] },
  ],
  portrait: [
    { id: 338, keywords: ["woman", "female", "portrait"] },
    { id: 823, keywords: ["man", "male", "portrait"] },
    { id: 660, keywords: ["child", "kid", "young"] },
    { id: 26, keywords: ["old person", "elderly", "aged"] },
    { id: 453, keywords: ["group", "people", "crowd"] },
  ],
  abstract: [
    { id: 1084, keywords: ["pattern", "geometric", "shapes"] },
    { id: 447, keywords: ["colorful", "vibrant", "bright"] },
    { id: 1069, keywords: ["abstract", "artistic", "non-representational"] },
    { id: 1020, keywords: ["texture", "surface", "material"] },
  ],
  animals: [
    { id: 237, keywords: ["dog", "canine", "pet"] },
    { id: 40, keywords: ["cat", "feline", "pet"] },
    { id: 582, keywords: ["bird", "avian", "flying"] },
    { id: 790, keywords: ["wildlife", "wild animal", "nature"] },
    { id: 659, keywords: ["horse", "equine", "mammal"] },
  ],
  technology: [
    { id: 0, keywords: ["computer", "tech", "device"] },
    { id: 48, keywords: ["digital", "screen", "display"] },
    { id: 160, keywords: ["robot", "ai", "machine"] },
    { id: 370, keywords: ["futuristic", "sci-fi", "future"] },
    { id: 1056, keywords: ["gadget", "electronic", "device"] },
  ],
  food: [
    { id: 292, keywords: ["meal", "dish", "plate"] },
    { id: 1080, keywords: ["fruit", "healthy", "fresh"] },
    { id: 225, keywords: ["dessert", "sweet", "cake"] },
    { id: 493, keywords: ["vegetable", "greens", "produce"] },
    { id: 132, keywords: ["drink", "beverage", "liquid"] },
  ],
  art: [
    { id: 200, keywords: ["painting", "artwork", "canvas"] },
    { id: 349, keywords: ["drawing", "sketch", "illustration"] },
    { id: 674, keywords: ["sculpture", "statue", "3d art"] },
    { id: 423, keywords: ["masterpiece", "classic", "famous"] },
    { id: 628, keywords: ["creative", "artistic", "imaginative"] },
  ],
  space: [
    { id: 701, keywords: ["stars", "galaxy", "universe"] },
    { id: 808, keywords: ["planets", "solar system", "cosmic"] },
    { id: 683, keywords: ["nebula", "space cloud", "astronomical"] },
    { id: 717, keywords: ["space", "cosmic", "astronomy"] },
  ],
  fantasy: [
    { id: 326, keywords: ["magical", "fantasy", "mythical"] },
    { id: 611, keywords: ["dragon", "creature", "mythological"] },
    { id: 867, keywords: ["medieval", "castle", "kingdom"] },
    { id: 501, keywords: ["fairy", "magical being", "enchanted"] },
  ]
};

// Function to find the most relevant image ID based on prompt content
const findRelevantImageId = (prompt: string): number => {
  prompt = prompt.toLowerCase();
  
  // Score each category based on keyword matches
  const categoryScores = Object.entries(CATEGORIES).map(([categoryName, categoryItems]) => {
    let score = 0;
    
    // For each image in the category, check for keyword matches
    categoryItems.forEach(item => {
      item.keywords.forEach(keyword => {
        if (prompt.includes(keyword.toLowerCase())) {
          score += 2; // Direct keyword match
        } else {
          // Check for partial matches
          const words = prompt.split(/\s+/);
          words.forEach(word => {
            if (keyword.toLowerCase().includes(word) && word.length > 3) {
              score += 1; // Partial match for longer words
            }
          });
        }
      });
    });
    
    return { categoryName, score, items: categoryItems };
  });
  
  // Sort categories by score (highest first)
  categoryScores.sort((a, b) => b.score - a.score);
  
  // If we have a clear winner with matches
  if (categoryScores[0].score > 0) {
    const topCategory = categoryScores[0];
    // Pick a random image from the top category
    const randomIndex = Math.floor(Math.random() * topCategory.items.length);
    return topCategory.items[randomIndex].id;
  }
  
  // Fallback if no matches: use a random ID from any category
  const allItems = Object.values(CATEGORIES).flat();
  const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
  return randomItem.id;
};

// Mock generation service - in a real app, this would call an actual API
export const generateImages = async (params: GenerateImageParams): Promise<GeneratedImage[]> => {
  try {
    // Show a loading toast when starting
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
    }
    
    // Dismiss the loading toast and show success toast
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
