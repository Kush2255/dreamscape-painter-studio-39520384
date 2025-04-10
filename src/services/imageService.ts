
import { toast } from "sonner";
import { findRelevantImageId } from './promptAnalyzer';
import { downloadImage } from './imageDownloader';
import { GenerateImageParams, GeneratedImage, MODELS, SIZES } from './models';

// Re-export all the types and constants for backward compatibility
export { MODELS, SIZES } from './models';
export type { GenerateImageParams, GeneratedImage } from './models';
export { downloadImage } from './imageDownloader';

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
