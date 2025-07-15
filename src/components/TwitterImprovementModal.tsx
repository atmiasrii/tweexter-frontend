
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TextDiff } from "@/components/TextDiff";
import { Sparkles, X, Check, RotateCcw, Loader2 } from "lucide-react";

interface TwitterImprovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  onApplyImprovement: (improvedText: string) => void;
}

export const TwitterImprovementModal: React.FC<TwitterImprovementModalProps> = ({
  isOpen,
  onClose,
  originalText,
  onApplyImprovement
}) => {
  const [isImproving, setIsImproving] = useState(false);
  const [improvedText, setImprovedText] = useState('');
  const [showDiff, setShowDiff] = useState(false);

  // Placeholder improvement function - replace with your AI API call
  const generateImprovement = async () => {
    setIsImproving(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Placeholder improved text - replace with actual AI response
    const placeholderImprovement = originalText
      .replace(/built/g, 'developed')
      .replace(/algorithm/g, 'AI system')
      .replace(/triggers you to react/g, 'maximizes user engagement')
      + ' 🚀 #AI #TechInnovation';
    
    setImprovedText(placeholderImprovement);
    setShowDiff(true);
    setIsImproving(false);
  };

  const handleApply = () => {
    onApplyImprovement(improvedText);
    onClose();
    resetState();
  };

  const handleRegenerate = () => {
    setShowDiff(false);
    setImprovedText('');
    generateImprovement();
  };

  const resetState = () => {
    setShowDiff(false);
    setImprovedText('');
    setIsImproving(false);
  };

  const handleClose = () => {
    onClose();
    resetState();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-black/95 border-gray-700/50 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-blue-400" />
            Improve Your Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Original Text */}
          <div>
            <Badge variant="outline" className="mb-3 text-xs">
              Original Post
            </Badge>
            <div className="bg-gray-900/30 rounded-lg p-4 border border-gray-700/30">
              <p className="text-gray-300 text-[15px] leading-6">{originalText}</p>
            </div>
          </div>

          {/* Loading State */}
          {isImproving && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3 text-blue-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">AI is improving your post...</span>
              </div>
            </div>
          )}

          {/* Diff View */}
          {showDiff && improvedText && (
            <TextDiff 
              original={originalText} 
              improved={improvedText}
            />
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700/30">
            <Button
              variant="outline"
              onClick={handleClose}
              className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>

            <div className="flex items-center gap-3">
              {!showDiff && !isImproving && (
                <Button
                  onClick={generateImprovement}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Improvement
                </Button>
              )}

              {showDiff && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleRegenerate}
                    className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                  <Button
                    onClick={handleApply}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Apply Changes
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
