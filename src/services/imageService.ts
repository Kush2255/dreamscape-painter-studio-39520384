
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

// Categories for different types of prompts
const CATEGORIES = {
  nature: [1, 10, 15, 25, 33, 37, 49],
  cityscape: [50, 65, 70, 85, 100],
  portrait: [200, 201, 202, 203, 204],
  abstract: [150, 160, 180, 190],
  animals: [237, 250, 255, 260, 270],
  technology: [300, 302, 304, 305, 310],
  food: [400, 410, 420, 430],
  art: [500, 510, 520, 530]
};

// Function to determine category based on prompt
const determineCategory = (prompt: string): number[] => {
  prompt = prompt.toLowerCase();
  
  if (prompt.includes("nature") || prompt.includes("landscape") || prompt.includes("mountain") || 
      prompt.includes("forest") || prompt.includes("tree") || prompt.includes("river") || 
      prompt.includes("ocean") || prompt.includes("sunset")) {
    return CATEGORIES.nature;
  }
  
  if (prompt.includes("city") || prompt.includes("building") || prompt.includes("urban") || 
      prompt.includes("architecture") || prompt.includes("skyline")) {
    return CATEGORIES.cityscape;
  }
  
  if (prompt.includes("person") || prompt.includes("face") || prompt.includes("portrait") || 
      prompt.includes("man") || prompt.includes("woman") || prompt.includes("people")) {
    return CATEGORIES.portrait;
  }
  
  if (prompt.includes("abstract") || prompt.includes("pattern") || prompt.includes("geometric") || 
      prompt.includes("colorful") || prompt.includes("art") || prompt.includes("digital")) {
    return CATEGORIES.abstract;
  }
  
  if (prompt.includes("animal") || prompt.includes("dog") || prompt.includes("cat") || 
      prompt.includes("bird") || prompt.includes("wildlife")) {
    return CATEGORIES.animals;
  }
  
  if (prompt.includes("technology") || prompt.includes("computer") || prompt.includes("digital") || 
      prompt.includes("robot") || prompt.includes("futuristic") || prompt.includes("sci-fi")) {
    return CATEGORIES.technology;
  }
  
  if (prompt.includes("food") || prompt.includes("meal") || prompt.includes("fruit") || 
      prompt.includes("vegetable") || prompt.includes("dish")) {
    return CATEGORIES.food;
  }
  
  if (prompt.includes("painting") || prompt.includes("drawing") || prompt.includes("sketch") || 
      prompt.includes("artwork") || prompt.includes("masterpiece")) {
    return CATEGORIES.art;
  }
  
  // Default to a mix of categories
  const allIds = Object.values(CATEGORIES).flat();
  return allIds;
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
    
    // Get relevant category IDs based on the prompt
    const categoryIds = determineCategory(params.prompt);
    
    // Generate images that are more relevant to the prompt
    for (let i = 0; i < params.numImages; i++) {
      const randomSeed = Math.floor(Math.random() * 1000000);
      // Pick a random ID from the appropriate category
      const randomCategoryIndex = Math.floor(Math.random() * categoryIds.length);
      const imageId = categoryIds[randomCategoryIndex];
      
      // Using Picsum photos with specific IDs for better context matching
      const url = `https://picsum.photos/id/${imageId}/${width}/${height}?random=${randomSeed}`;
      
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
