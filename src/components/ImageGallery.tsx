
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import { GeneratedImage, downloadImage } from '@/services/imageService';
import { toast } from 'sonner';

interface ImageGalleryProps {
  images: GeneratedImage[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  if (images.length === 0) {
    return null;
  }

  const handleDownload = (image: GeneratedImage) => {
    try {
      const filename = `image-${image.seed || Date.now()}.jpg`;
      // For placekitten images, we can't download directly due to CORS
      // So we'll open in a new tab instead
      window.open(image.url, '_blank');
      toast.success('Image opened in new tab. Right-click and select "Save image as..." to download');
    } catch (error) {
      console.error('Error opening image:', error);
      toast.error('Failed to open image');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <Card key={index} className="overflow-hidden group">
          <CardContent className="p-0 relative">
            <img 
              src={image.url} 
              alt={`Generated image from prompt: ${image.prompt}`}
              className="w-full h-auto object-cover aspect-square"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0" 
                onClick={() => handleDownload(image)}
                title="Open image in new tab"
              >
                <ExternalLink size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ImageGallery;
