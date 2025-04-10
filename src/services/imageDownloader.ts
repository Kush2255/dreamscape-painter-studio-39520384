
import { toast } from 'sonner';

// Function to download an image with improved error handling
export const downloadImage = async (url: string, filename: string = 'generated-image.jpg') => {
  try {
    console.log(`Downloading image from: ${url}`);
    
    // For CORS-enabled sources, we can use this method
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
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
    
    // Fallback method for browsers that support it
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (fallbackError) {
      console.error('Fallback download method failed:', fallbackError);
    }
  }
};
