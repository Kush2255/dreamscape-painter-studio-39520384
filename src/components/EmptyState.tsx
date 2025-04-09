
import React from 'react';
import { Sparkles } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/30 rounded-lg h-[400px]">
      <div className="bg-primary/10 p-4 rounded-full mb-4">
        <Sparkles className="h-12 w-12 text-primary animate-float" />
      </div>
      <h3 className="text-xl font-semibold mb-2 gradient-text">Dreamscape Painter Studio</h3>
      <p className="text-muted-foreground max-w-md">
        Enter a prompt to generate unique AI images. Be as descriptive as possible for the best results.
      </p>
    </div>
  );
};

export default EmptyState;
