
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Download, ZoomIn, X } from 'lucide-react';
import { GeneratedImage } from '@/services/models';
import { downloadImage } from '@/services/imageDownloader';
import { toast } from 'sonner';

interface ImageGalleryProps {
  images: GeneratedImage[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [loadingImages, setLoadingImages] = useState<{[key: number]: boolean}>({});
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // Initialize loading state for all images
  useEffect(() => {
    if (images.length > 0) {
      const initialLoadingState: {[key: number]: boolean} = {};
      images.forEach((_, index) => {
        initialLoadingState[index] = true;
      });
      setLoadingImages(initialLoadingState);
    }
  }, [images]);

  if (images.length === 0) {
    return null;
  }

  const handleDownload = (image: GeneratedImage) => {
    try {
      // Use the dedicated download function
      downloadImage(image.url, `generated-image-${image.seed || Date.now()}.jpg`);
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    }
  };

  const handleImageLoad = (index: number) => {
    setLoadingImages(prev => ({ ...prev, [index]: false }));
  };

  const handleImageError = (index: number) => {
    console.error(`Failed to load image at index ${index}`);
    setLoadingImages(prev => ({ ...prev, [index]: false }));
    toast.error(`Failed to load an image. Please try again with a different prompt.`);
  };

  const handleZoom = (url: string) => {
    setExpandedImage(url);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <Card key={index} className="overflow-hidden group">
            <CardContent className="p-0 relative">
              <div className={`w-full aspect-square relative ${loadingImages[index] ? 'bg-muted/30 animate-pulse' : ''}`}>
                <img 
                  src={image.url} 
                  alt={`Generated image from prompt: ${image.prompt}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                />
                {loadingImages[index] && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex justify-between">
                <div className="text-xs max-w-[70%] truncate">
                  {image.prompt}
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0" 
                    onClick={() => handleZoom(image.url)}
                    title="Zoom image"
                  >
                    <ZoomIn size={16} />
                  </Button>
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {expandedImage && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
        >
          <div className="max-w-4xl max-h-[90vh] relative">
            <img 
              src={expandedImage} 
              alt="Expanded view" 
              className="max-w-full max-h-[90vh] object-contain"
            />
            <Button 
              className="absolute top-2 right-2"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                setExpandedImage(null);
              }}
            >
              <X size={16} className="mr-1" /> Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
