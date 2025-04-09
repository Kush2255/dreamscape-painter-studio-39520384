
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PromptInput from '@/components/PromptInput';
import ImageGallery from '@/components/ImageGallery';
import EmptyState from '@/components/EmptyState';
import GenerationSettings from '@/components/GenerationSettings';
import { 
  generateImages, 
  GeneratedImage, 
  MODELS, 
  SIZES
} from '@/services/imageService';

const Index = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [model, setModel] = useState(MODELS[0].value);
  const [size, setSize] = useState(SIZES[0].value);
  const [numImages, setNumImages] = useState(1);

  const handleGenerateImages = async (prompt: string, negativePrompt: string) => {
    setIsGenerating(true);
    try {
      const generated = await generateImages({
        prompt,
        model,
        size,
        numImages,
        negativePrompt
      });
      
      setImages(generated);
    } catch (error) {
      console.error('Error generating images:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 md:px-8">
      <header className="max-w-6xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight gradient-text mb-2">
          Dreamscape Painter Studio
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Turn your imagination into stunning visuals with AI-powered image generation.
        </p>
      </header>
      
      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                <PromptInput 
                  onSubmit={handleGenerateImages} 
                  isGenerating={isGenerating} 
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <GenerationSettings
              model={model}
              setModel={setModel}
              size={size}
              setSize={setSize}
              numImages={numImages}
              setNumImages={setNumImages}
              isGenerating={isGenerating}
            />
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="space-y-6">
          {isGenerating ? (
            <div className="grid image-grid">
              {Array.from({ length: numImages }).map((_, index) => (
                <Card key={index} className="overflow-hidden animate-pulse-gentle">
                  <CardContent className="p-0 relative">
                    <div 
                      className="w-full aspect-square bg-muted/30 animate-shimmer"
                      style={{
                        backgroundSize: '200% 100%'
                      }}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : images.length > 0 ? (
            <ImageGallery images={images} />
          ) : (
            <EmptyState />
          )}
        </div>
      </main>
      
      <footer className="max-w-6xl mx-auto mt-12 text-center text-sm text-muted-foreground">
        <p>
          Dreamscape Painter Studio &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default Index;
