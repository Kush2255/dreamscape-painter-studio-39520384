
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
