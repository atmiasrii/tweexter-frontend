import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Repeat2, Heart, Bookmark, Edit3 } from "lucide-react";
import { HighlightedText } from "@/components/HighlightedText";
import { formatTextWithMarkdown } from "@/utils/formatText";

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
  const [isEditing, setIsEditing] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const editableRef = useRef<HTMLDivElement>(null);

  // Twitter typically truncates at around 280 characters, but for display purposes, 
  // they show more and truncate around 3-4 lines which is roughly 200-250 characters
  const TRUNCATE_LENGTH = 240;

  // Sync component state when postData.content changes (for new posts)
  useEffect(() => {
    if (postData.content !== currentContent) {
      setCurrentContent(postData.content);
      setTextSegments([{ text: postData.content, isImproved: false }]);
      setHasBeenImproved(false);
      setShowFullText(false);
    }
  }, [postData.content, currentContent]);

  useEffect(() => {
    if (isEditing && editableRef.current) {
      editableRef.current.focus();
      // Restore cursor position after edit
      const range = document.createRange();
      const selection = window.getSelection();
      const textNode = editableRef.current.firstChild;
      if (textNode) {
        const position = Math.min(cursorPosition, textNode.textContent?.length || 0);
        range.setStart(textNode, position);
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, [isEditing, cursorPosition]);

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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditableInput = () => {
    if (editableRef.current) {
      // Save cursor position before updating content
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        setCursorPosition(range.startOffset);
      }
      
      const newContent = editableRef.current.textContent || '';
      setCurrentContent(newContent);
      setTextSegments([{ text: newContent, isImproved: false }]);
      setHasBeenImproved(false);
      
      if (onPostUpdate) {
        onPostUpdate(newContent);
      }
    }
  };

  const handleEditableBlur = () => {
    setIsEditing(false);
  };

  const handleEditableKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      setIsEditing(false);
    }
  };

  const shouldTruncateText = () => {
    return currentContent.length > TRUNCATE_LENGTH && !showFullText;
  };

  const getTruncatedText = () => {
    if (shouldTruncateText()) {
      return currentContent.substring(0, TRUNCATE_LENGTH) + '...';
    }
    return currentContent;
  };

  const renderContent = () => {
    if (isEditing) {
      return (
        <div
          ref={editableRef}
          contentEditable
          suppressContentEditableWarning={true}
          onInput={handleEditableInput}
          onBlur={handleEditableBlur}
          onKeyDown={handleEditableKeyDown}
          className="outline-none text-[15px] leading-5 font-normal min-h-[20px] cursor-text"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          }}
          dangerouslySetInnerHTML={{ __html: currentContent }}
        />
      );
    }

    const displayText = shouldTruncateText() ? getTruncatedText() : currentContent;
    
    const content = !hasBeenImproved ? 
      formatTextWithMarkdown(displayText) : 
      textSegments.map((segment, index) => {
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
        return <span key={index}>{formatTextWithMarkdown(segment.text)}</span>;
      });

    return (
      <div className="text-[15px] leading-5 font-normal">
        {content}
        {shouldTruncateText() && (
          <button
            onClick={() => setShowFullText(true)}
            className="text-primary hover:underline"
          >
            Show more
          </button>
        )}
        {showFullText && currentContent.length > TRUNCATE_LENGTH && (
          <button
            onClick={() => setShowFullText(false)}
            className="text-primary hover:underline ml-1"
          >
            Show less
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Card className="bg-card border-border shadow-lg rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col relative">

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Main content area with photo and text side by side */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-start space-x-4">
              {/* Avatar */}
              <Avatar className="w-12 h-12 flex-shrink-0 ring-2 ring-border">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face" />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-medium">DA</AvatarFallback>
              </Avatar>
              
              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="text-foreground space-y-3">
                  {renderContent()}
                  
                  {/* Display uploaded images after text */}
                  {postData.images.length > 0 && (
                    <div className={`grid gap-2 ${
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
                </div>
              </div>
            </div>
            
            {/* Bottom sections - Everyone can reply and engagement metrics */}
            <div className="mt-6 space-y-3">
              {/* Blue globe icon and reply setting */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 hover:bg-muted/50 rounded-full px-2 py-1 -mx-2 transition-colors cursor-pointer">
                  <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span className="text-primary text-sm font-normal">Everyone can reply</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="flex items-center justify-between w-full text-muted-foreground px-8">
                  <div className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">17</span>
                  </div>
                  <div className="flex items-center space-x-2 hover:text-green-500 transition-colors cursor-pointer">
                    <Repeat2 className="h-4 w-4" />
                    <span className="text-sm font-medium">4</span>
                  </div>
                  <div className="flex items-center space-x-2 hover:text-red-500 transition-colors cursor-pointer">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm font-medium">56</span>
                  </div>
                  <div className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer">
                    <Bookmark className="h-4 w-4" />
                    <span className="text-sm font-medium">56</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Fixed buttons at the bottom */}
        {!isEditing && (
          <div className="flex-shrink-0 px-4 pb-3 border-t border-border/50 bg-card/80 backdrop-blur-sm rounded-b-3xl">
            <div className="flex items-center justify-center space-x-3 pt-2">
              <Button 
                onClick={handleImproveClick}
                disabled={isImproving}
                className="bg-foreground hover:bg-foreground/90 disabled:bg-foreground/50 text-background rounded-full px-8 py-2 text-[15px] font-bold min-w-[100px] h-10 transition-all duration-200"
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                }}
              >
                {isImproving ? "Improving..." : "Improve"}
              </Button>
              <Button
                onClick={handleEditClick}
                disabled={false}
                className="bg-foreground hover:bg-foreground/90 disabled:bg-foreground/50 text-background rounded-full px-8 py-2 text-[15px] font-bold min-w-[100px] h-10 transition-all duration-200"
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                }}
              >
                Edit
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
