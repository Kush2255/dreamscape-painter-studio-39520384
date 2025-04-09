
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { GeneratedImage } from '@/services/imageService';
import { toast } from 'sonner';

interface ImageGalleryProps {
  images: GeneratedImage[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [loadingImages, setLoadingImages] = useState<{[key: number]: boolean}>({});

  if (images.length === 0) {
    return null;
  }

  const handleDownload = (image: GeneratedImage) => {
    try {
      window.open(image.url, '_blank');
      toast.success('Image opened in new tab. Right-click and select "Save image as..." to download');
    } catch (error) {
      console.error('Error opening image:', error);
      toast.error('Failed to open image');
    }
  };

  const handleImageLoad = (index: number) => {
    setLoadingImages(prev => ({ ...prev, [index]: false }));
  };

  const handleImageError = (index: number) => {
    console.error(`Failed to load image at index ${index}`);
    setLoadingImages(prev => ({ ...prev, [index]: false }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <Card key={index} className="overflow-hidden group">
          <CardContent className="p-0 relative">
            <div className={`w-full aspect-square bg-muted/30 ${loadingImages[index] ? 'animate-pulse' : ''}`}>
              <img 
                src={image.url} 
                alt={`Generated image from prompt: ${image.prompt}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onLoad={() => handleImageLoad(index)}
                onError={() => handleImageError(index)}
              />
            </div>
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
