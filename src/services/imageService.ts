
import { toast } from "sonner";
import { findRelevantImageId } from './promptAnalyzer';
import { downloadImage } from './imageDownloader';
import { GenerateImageParams, GeneratedImage, MODELS, SIZES } from './models';

// Re-export all the types and constants for backward compatibility
export { MODELS, SIZES } from './models';
export type { GenerateImageParams, GeneratedImage } from './models';
export { downloadImage } from './imageDownloader';

// Improved generation service with better image selection
export const generateImages = async (params: GenerateImageParams): Promise<GeneratedImage[]> => {
  try {
    const loadingToast = toast.loading(`Generating ${params.numImages} image(s)...`);
    
    // For demo purposes, simulate an API call with a timeout
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const results: GeneratedImage[] = [];
    const [width, height] = params.size.split("x").map(Number);
    
    console.log(`Processing prompt: "${params.prompt}" for ${params.numImages} images at size ${width}x${height}`);
    
    // Generate images that are relevant to the prompt
    for (let i = 0; i < params.numImages; i++) {
      const randomSeed = Math.floor(Math.random() * 1000000);
      
      // Find the most relevant image ID based on the prompt with improved analysis
      const relevantImageId = findRelevantImageId(params.prompt);
      console.log(`Selected image ID ${relevantImageId} for image ${i+1} of ${params.numImages}`);
      
      // Use Picsum photos with specific IDs for better context matching
      // Add cache-busting parameter to ensure fresh images
      const url = `https://picsum.photos/id/${relevantImageId}/${width}/${height}?random=${randomSeed}${Date.now()}`;
      
      results.push({
        url,
        prompt: params.prompt,
        seed: randomSeed,
      });

      // Add a slight delay between image generation to simulate a more natural flow
      if (i < params.numImages - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
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
