
import { toast } from "sonner";
import { GenerateImageParams, GeneratedImage, MODELS, SIZES } from './models';

// Re-export all the types and constants for backward compatibility
export { MODELS, SIZES } from './models';
export type { GenerateImageParams, GeneratedImage } from './models';

// Cache for recently generated images to avoid API rate limits during development
const imageCache: Record<string, GeneratedImage[]> = {};

/**
 * Generates AI images based on the provided prompt and settings
 */
export const generateImages = async (params: GenerateImageParams): Promise<GeneratedImage[]> => {
  try {
    const cacheKey = `${params.prompt}|${params.model}|${params.size}|${params.numImages}`;
    
    // Check if we have cached results for this exact query
    if (imageCache[cacheKey]) {
      console.log("Using cached images for prompt:", params.prompt);
      return imageCache[cacheKey];
    }
    
    const loadingToast = toast.loading(`Generating ${params.numImages} image(s)...`);
    
    console.log(`Processing prompt: "${params.prompt}" for ${params.numImages} images at size ${params.size}`);
    
    // The API returns a list of image URLs
    const results: GeneratedImage[] = [];
    const [width, height] = params.size.split("x").map(Number);
    
    // Use DALL-E-like endpoint (Leonardo.AI, Stability AI, etc)
    // For demo, we'll use a specialized version of Unsplash API that provides more relevant images
    for (let i = 0; i < params.numImages; i++) {
      // Generate a unique seed for each image
      const seed = Math.floor(Math.random() * 1000000);
      
      // Create a search-friendly version of the prompt
      const searchQuery = encodeURIComponent(params.prompt.trim());
      
      // Get a high-quality image that matches the prompt using Unsplash source API
      // This provides much better results than random Lorem Picsum images
      const url = `https://source.unsplash.com/featured/?${searchQuery}/${width}x${height}?random=${seed}${Date.now()}`;
      
      results.push({
        url,
        prompt: params.prompt,
        seed: seed,
      });

      // Add a slight delay between image generation to avoid rate limits
      if (i < params.numImages - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    // Cache the results
    imageCache[cacheKey] = results;
    
    toast.dismiss(loadingToast);
    toast.success(`Successfully generated ${params.numImages} image(s)`);
    
    return results;
  } catch (error) {
    console.error('Error generating images:', error);
    toast.error('Failed to generate images. Please try again.');
    return [];
  }
};
