
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { GeneratedImage, downloadImage } from '@/services/imageService';

interface ImageGalleryProps {
  images: GeneratedImage[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  if (images.length === 0) {
    return null;
  }

  const handleDownload = (image: GeneratedImage) => {
    const filename = `image-${image.seed || Date.now()}.jpg`;
    downloadImage(image.url, filename);
  };

  return (
    <div className="image-grid">
      {images.map((image, index) => (
        <Card key={index} className="overflow-hidden group">
          <CardContent className="p-0 relative">
            <img 
              src={image.url} 
              alt={`Generated image from prompt: ${image.prompt}`}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0" 
                onClick={() => handleDownload(image)}
                title="Download image"
              >
                <Download size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ImageGallery;
