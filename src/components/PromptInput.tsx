
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface PromptInputProps {
  onSubmit: (prompt: string, negativePrompt: string) => void;
  isGenerating: boolean;
}

const EXAMPLE_PROMPTS = [
  "A serene mountain landscape at sunset with a flowing river",
  "Futuristic cyberpunk city with neon lights and flying cars",
  "A magical forest with glowing mushrooms and fairy creatures",
  "Portrait of a robot artist painting on a canvas"
];

const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [showNegativePrompt, setShowNegativePrompt] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate an image");
      return;
    }
    
    onSubmit(prompt, negativePrompt);
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="min-h-[120px] resize-none text-lg"
          />
          
          {showNegativePrompt && (
            <div className="mt-2">
              <label className="block text-xs text-muted-foreground mb-1">Negative prompt (what to exclude)</label>
              <Textarea
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="Elements to exclude from the image... (blurry, low quality, etc.)"
                className="min-h-[80px] resize-none"
              />
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap justify-between items-center gap-2">
          <Button 
            variant="link" 
            type="button" 
            className="h-auto p-0 text-muted-foreground text-xs"
            onClick={() => setShowNegativePrompt(!showNegativePrompt)}
          >
            {showNegativePrompt ? 'Hide negative prompt' : 'Add negative prompt'}
          </Button>
          
          <Button 
            type="submit" 
            className="gap-2" 
            disabled={isGenerating || !prompt.trim()}
          >
            <Sparkles size={16} />
            {isGenerating ? 'Generating...' : 'Generate'} 
          </Button>
        </div>
      </form>

      <div className="pt-2">
        <p className="text-xs text-muted-foreground mb-2">Try an example:</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="text-xs bg-muted px-3 py-1.5 rounded-full hover:bg-muted/80 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
