
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

// Mock generation service - in a real app, this would call an actual API
export const generateImages = async (params: GenerateImageParams): Promise<GeneratedImage[]> => {
  try {
    // Show a loading toast when starting
    const loadingToast = toast.loading(`Generating ${params.numImages} image(s)...`);
    
    // For demo purposes, simulate an API call with a timeout
    // In a real app, you would replace this with an actual API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const results: GeneratedImage[] = [];
    const [width, height] = params.size.split("x").map(Number);
    
    // Generate placeholder images using placeholders with the prompt text
    for (let i = 0; i < params.numImages; i++) {
      const randomSeed = Math.floor(Math.random() * 1000000);
      
      // For the demo, we're using placeholder images from placekitten
      // In a real app, this would be the URL returned from your image generation API
      const url = `https://placekitten.com/${width}/${height}?${randomSeed}`;
      
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
    toast.error('Failed to download image');
  }
};
