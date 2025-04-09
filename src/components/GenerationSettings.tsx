
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { MODELS, SIZES } from '@/services/imageService';

interface GenerationSettingsProps {
  model: string;
  setModel: (model: string) => void;
  size: string;
  setSize: (size: string) => void;
  numImages: number;
  setNumImages: (num: number) => void;
  isGenerating: boolean;
}

const GenerationSettings: React.FC<GenerationSettingsProps> = ({
  model,
  setModel,
  size,
  setSize,
  numImages,
  setNumImages,
  isGenerating
}) => {
  return (
    <div className="space-y-4 bg-secondary/30 rounded-lg p-4">
      <div className="space-y-1.5">
        <Label htmlFor="model">Model</Label>
        <Select
          disabled={isGenerating}
          value={model}
          onValueChange={setModel}
        >
          <SelectTrigger id="model">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {MODELS.map((modelOption) => (
              <SelectItem key={modelOption.value} value={modelOption.value}>
                {modelOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="size">Image Size</Label>
        <Select
          disabled={isGenerating}
          value={size}
          onValueChange={setSize}
        >
          <SelectTrigger id="size">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            {SIZES.map((sizeOption) => (
              <SelectItem key={sizeOption.value} value={sizeOption.value}>
                {sizeOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between">
          <Label htmlFor="num-images">Number of Images</Label>
          <span className="text-sm text-muted-foreground">{numImages}</span>
        </div>
        <Slider
          id="num-images"
          disabled={isGenerating}
          value={[numImages]}
          min={1}
          max={4}
          step={1}
          onValueChange={(value) => setNumImages(value[0])}
        />
      </div>
    </div>
  );
};

export default GenerationSettings;
