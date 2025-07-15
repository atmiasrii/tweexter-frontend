
import React, { useState } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface HighlightedTextProps {
  originalText: string;
  improvedText: string;
  onRevert: (originalText: string) => void;
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({
  originalText,
  improvedText,
  onRevert
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    onRevert(originalText);
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span
          className="bg-blue-500/20 border-b border-blue-400/50 cursor-pointer transition-all duration-200 hover:bg-blue-500/30 hover:border-blue-400/70 px-1 rounded-sm"
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {improvedText}
        </span>
      </HoverCardTrigger>
      <HoverCardContent 
        side="top" 
        className="w-auto max-w-xs bg-gray-900/95 border border-gray-700/50 backdrop-blur-sm text-white text-sm p-2 rounded-lg shadow-lg"
      >
        <div className="space-y-1">
          <p className="text-xs text-gray-400 font-medium">Original:</p>
          <p className="text-gray-200">{originalText}</p>
          <p className="text-xs text-blue-400 mt-2">Click to revert</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
