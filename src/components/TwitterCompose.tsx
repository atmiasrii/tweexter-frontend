import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Eye } from "lucide-react";
import { HighlightedText } from "@/components/HighlightedText";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PostData {
  content: string;
  images: File[];
}

interface TwitterComposeProps {
  hasPosted?: boolean;
  postData?: PostData;
  onPostUpdate?: (updatedContent: string) => void;
  onAnalyticsRefresh?: () => void;
}

interface TextSegment {
  text: string;
  isImproved: boolean;
  originalText?: string;
}

export const TwitterCompose = ({ 
  hasPosted = false, 
  postData = { content: "", images: [] },
  onPostUpdate,
  onAnalyticsRefresh
}: TwitterComposeProps) => {
  const [currentContent, setCurrentContent] = useState(postData.content);
  const [textSegments, setTextSegments] = useState<TextSegment[]>([
    { text: postData.content, isImproved: false }
  ]);
  const [hasBeenImproved, setHasBeenImproved] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  if (!hasPosted || !currentContent) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Card className="bg-card border-border p-8 shadow-lg rounded-3xl max-w-lg w-full">
          <div className="text-muted-foreground text-lg text-center">No post to display</div>
        </Card>
      </div>
    );
  }

  const generateImprovedText = (originalText: string): string => {
    // Simulate AI improvement - in real app this would call an API
    const improvements = [
      { original: "built", improved: "developed" },
      { original: "algorithm", improved: "AI system" },
      { original: "analyzes", improved: "intelligently analyzes" },
      { original: "digital footprint", improved: "user behavior patterns" },
      { original: "content", improved: "personalized content" },
      { original: "triggers", improved: "maximizes" },
      { original: "react", improved: "engagement" },
      { original: "at scale", improved: "at enterprise scale 🚀" }
    ];

    let improvedText = originalText;
    improvements.forEach(({ original, improved }) => {
      const regex = new RegExp(`\\b${original}\\b`, 'gi');
      improvedText = improvedText.replace(regex, improved);
    });

    return improvedText + " #AI #TechInnovation";
  };

  const createTextSegments = (original: string, improved: string): TextSegment[] => {
    const originalWords = original.split(/(\s+)/);
    const improvedWords = improved.split(/(\s+)/);
    const segments: TextSegment[] = [];
    
    let originalIndex = 0;
    let improvedIndex = 0;
    
    while (originalIndex < originalWords.length || improvedIndex < improvedWords.length) {
      if (originalIndex < originalWords.length && 
          improvedIndex < improvedWords.length && 
          originalWords[originalIndex] === improvedWords[improvedIndex]) {
        // Words are the same
        segments.push({
          text: originalWords[originalIndex],
          isImproved: false
        });
        originalIndex++;
        improvedIndex++;
      } else {
        // Find the next matching point or handle differences
        let foundMatch = false;
        
        // Look for next matching word
        for (let i = improvedIndex; i < improvedWords.length; i++) {
          if (originalIndex < originalWords.length && 
              originalWords[originalIndex] === improvedWords[i]) {
            // Found match, everything before is an improvement
            const improvedSegment = improvedWords.slice(improvedIndex, i).join('');
            if (improvedSegment.trim()) {
              segments.push({
                text: improvedSegment,
                isImproved: true,
                originalText: originalWords[originalIndex]
              });
            }
            improvedIndex = i;
            foundMatch = true;
            break;
          }
        }
        
        if (!foundMatch) {
          // Handle remaining text
          if (improvedIndex < improvedWords.length) {
            const remainingImproved = improvedWords.slice(improvedIndex).join('');
            const remainingOriginal = originalIndex < originalWords.length ? 
              originalWords.slice(originalIndex).join('') : '';
            
            segments.push({
              text: remainingImproved,
              isImproved: true,
              originalText: remainingOriginal || remainingImproved
            });
          }
          break;
        }
      }
    }
    
    return segments;
  };

  const handleImproveClick = async () => {
    setIsImproving(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const improvedText = generateImprovedText(postData.content);
    const newSegments = createTextSegments(postData.content, improvedText);
    
    setTextSegments(newSegments);
    setCurrentContent(improvedText);
    setHasBeenImproved(true);
    setIsImproving(false);
    
    if (onPostUpdate) {
      onPostUpdate(improvedText);
    }
    
    // Trigger analytics refresh with animation
    if (onAnalyticsRefresh) {
      onAnalyticsRefresh();
    }
  };

  const handleRevertText = (originalText: string, segmentIndex: number) => {
    const newSegments = [...textSegments];
    newSegments[segmentIndex] = {
      text: originalText,
      isImproved: false
    };
    setTextSegments(newSegments);
    
    const newContent = newSegments.map(segment => segment.text).join('');
    setCurrentContent(newContent);
    
    if (onPostUpdate) {
      onPostUpdate(newContent);
    }
  };

  const handlePost = async () => {
    setIsPosting(true);
    
    // Simulate posting delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsPosting(false);
    
    // Trigger analytics refresh
    if (onAnalyticsRefresh) {
      onAnalyticsRefresh();
    }
  };

  const renderContent = () => {
    if (!hasBeenImproved) {
      return currentContent;
    }

    return textSegments.map((segment, index) => {
      if (segment.isImproved && segment.originalText) {
        return (
          <HighlightedText
            key={index}
            originalText={segment.originalText}
            improvedText={segment.text}
            onRevert={(originalText) => handleRevertText(originalText, index)}
          />
        );
      }
      return <span key={index}>{segment.text}</span>;
    });
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Card className="bg-card border-border shadow-lg rounded-3xl w-full max-w-lg">
        <ScrollArea className="max-h-[80vh]">
          <div className="p-6 sm:p-8">
            <div className="flex items-start space-x-3">
              <Avatar className="w-12 h-12 flex-shrink-0 ring-2 ring-border">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face" />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-medium">DA</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-foreground font-semibold">Data Analytics</span>
                  <span className="text-muted-foreground text-sm">@dataanalytics</span>
                  <span className="text-muted-foreground text-sm">·</span>
                  <span className="text-muted-foreground text-sm">2m</span>
                </div>
                <p className="text-foreground text-[15px] leading-5 mb-3 font-normal">
                  {renderContent()}
                </p>
                
                {/* Display uploaded images */}
                {postData.images.length > 0 && (
                  <div className={`grid gap-2 mb-3 ${
                    postData.images.length === 1 ? 'grid-cols-1' : 
                    postData.images.length === 2 ? 'grid-cols-2' : 
                    'grid-cols-2'
                  }`}>
                    {postData.images.map((image, index) => (
                      <div key={index} className="relative overflow-hidden rounded-2xl border border-border">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Post image ${index + 1}`}
                          className="w-full aspect-square object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Blue globe icon and reply setting */}
                <div className="flex items-center space-x-2 mb-4">
                  <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span className="text-primary text-sm font-normal">Everyone can reply</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-muted-foreground">
                    <div className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-medium">89.1K</span>
                    </div>
                    <div className="flex items-center space-x-2 hover:text-green-500 transition-colors cursor-pointer">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-medium">3.2K</span>
                    </div>
                    <div className="flex items-center space-x-2 hover:text-purple-500 transition-colors cursor-pointer">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-medium">+15.7%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button 
                      size="sm" 
                      onClick={handleImproveClick}
                      disabled={isImproving}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 disabled:opacity-50"
                    >
                      {isImproving ? "Improving..." : "Improve"}
                    </Button>
                    <Button
                      onClick={handlePost}
                      disabled={isPosting}
                      className="bg-foreground hover:bg-foreground/90 disabled:bg-foreground/50 text-background rounded-full px-8 py-2 text-[15px] font-bold min-w-[100px] h-10 transition-all duration-200"
                      style={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                      }}
                    >
                      {isPosting ? "Posting..." : "Post"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};
