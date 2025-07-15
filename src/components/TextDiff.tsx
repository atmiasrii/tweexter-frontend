
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface TextDiffProps {
  original: string;
  improved: string;
  className?: string;
}

export const TextDiff: React.FC<TextDiffProps> = ({ 
  original, 
  improved, 
  className = "" 
}) => {
  // Simple diff algorithm - in production you'd use a more sophisticated one
  const getTextDiff = (originalText: string, improvedText: string) => {
    const originalWords = originalText.split(/(\s+)/);
    const improvedWords = improvedText.split(/(\s+)/);
    
    const result: Array<{
      text: string;
      type: 'unchanged' | 'added' | 'removed';
    }> = [];
    
    // Simple word-by-word comparison (placeholder logic)
    const maxLength = Math.max(originalWords.length, improvedWords.length);
    
    for (let i = 0; i < maxLength; i++) {
      const originalWord = originalWords[i];
      const improvedWord = improvedWords[i];
      
      if (originalWord === improvedWord) {
        if (originalWord) {
          result.push({ text: originalWord, type: 'unchanged' });
        }
      } else {
        if (originalWord && !improvedWord) {
          result.push({ text: originalWord, type: 'removed' });
        } else if (!originalWord && improvedWord) {
          result.push({ text: improvedWord, type: 'added' });
        } else if (originalWord && improvedWord) {
          result.push({ text: originalWord, type: 'removed' });
          result.push({ text: improvedWord, type: 'added' });
        }
      }
    }
    
    return result;
  };

  const diffResult = getTextDiff(original, improved);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="outline" className="text-xs">
          Text Improvements
        </Badge>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500/20 border border-red-500/50 rounded"></div>
            <span>Removed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500/20 border border-green-500/50 rounded"></div>
            <span>Added</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30">
        <div className="text-white text-[15px] leading-6">
          {diffResult.map((item, index) => (
            <span
              key={index}
              className={
                item.type === 'removed'
                  ? 'bg-red-500/20 text-red-200 line-through px-1 rounded'
                  : item.type === 'added'
                  ? 'bg-green-500/20 text-green-200 px-1 rounded'
                  : ''
              }
            >
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
