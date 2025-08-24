import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Repeat2, Heart, Bookmark, Edit3, Loader2 } from "lucide-react";
import { HighlightedText } from "@/components/HighlightedText";
import { formatTextWithMarkdown } from "@/utils/formatText";
import { improveText } from "@/lib/api";

interface PostData {
  content: string;
  images: File[];
}

interface TwitterComposeProps {
  hasPosted?: boolean;
  postData?: PostData;
  tweetText?: string;
  followers?: number;
  loading?: boolean;
  ranges?: {
    likes: { low: number; mid: number; high: number };
    retweets: { low: number; mid: number; high: number };
    replies: { low: number; mid: number; high: number };
  } | null;
  onTweetTextChange?: (text: string) => void;
  onFollowersChange?: (followers: number) => void;
  onPostUpdate?: (updatedContent: string) => void;
  onPredict?: () => void;
  onAnalyticsRefresh?: () => void;
  onWinnerStats?: (ranges: any) => void;
}

interface TextSegment {
  text: string;
  isImproved: boolean;
  originalText?: string;
}

export const TwitterCompose = ({ 
  hasPosted = false, 
  postData = { content: "", images: [] },
  tweetText = "",
  followers = 1000,
  loading = false,
  ranges = null,
  onTweetTextChange,
  onFollowersChange,
  onPostUpdate,
  onPredict,
  onAnalyticsRefresh,
  onWinnerStats
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
    if (postData.content && postData.content !== currentContent && !isEditing) {
      setCurrentContent(postData.content);
      setTextSegments([{ text: postData.content, isImproved: false }]);
      setHasBeenImproved(false);
      setShowFullText(false);
    }
  }, [postData.content, isEditing]);

  // Sync with store's tweetText when editing directly (but only if no postData.content)
  useEffect(() => {
    if (tweetText && tweetText !== currentContent && !postData.content && !isEditing) {
      setCurrentContent(tweetText);
      setTextSegments([{ text: tweetText, isImproved: false }]);
      setHasBeenImproved(false);
    }
  }, [tweetText, postData.content, isEditing]);

  useEffect(() => {
    if (isEditing && editableRef.current) {
      editableRef.current.focus();
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
      <div className="w-full flex items-center justify-center">
        <Card className="bg-card border-border p-6 sm:p-8 shadow-lg rounded-3xl w-full">
          <div className="text-muted-foreground text-base sm:text-lg text-center">No post to display</div>
        </Card>
      </div>
    );
  }

  const stripVersionWrapper = (text: string): string => {
    if (!text || typeof text !== 'string') return text;
    
    const versionPattern = /^\{'v\d+'\s*:\s*'(.+)'\}$|^\{\"v\d+\"\s*:\s*\"(.+)\"\}$/;
    const match = text.match(versionPattern);
    if (match) {
      return match[1] || match[2];
    }
    
    return text;
  };

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

    return improvedText;
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
        segments.push({
          text: originalWords[originalIndex],
          isImproved: false
        });
        originalIndex++;
        improvedIndex++;
      } else {
        let foundMatch = false;
        
        for (let i = improvedIndex; i < improvedWords.length; i++) {
          if (originalIndex < originalWords.length && 
              originalWords[originalIndex] === improvedWords[i]) {
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
    console.log('🔧 Tweak button clicked, starting improvement...');
    console.log('📝 Original text:', currentContent);
    setIsImproving(true);
    
    try {
      console.log('🌐 Calling improveText API...');
      const response = await improveText({ text: currentContent });
      const rawImprovedText = response.improved_text;
      const improvedText = stripVersionWrapper(rawImprovedText);
      console.log('✅ API response received:', improvedText);
      
      setTextSegments([{ text: improvedText, isImproved: false }]);
      setCurrentContent(improvedText);
      setHasBeenImproved(false);
      
      if (onTweetTextChange) {
        console.log('🔄 Syncing improved text with store...');
        onTweetTextChange(improvedText);
      }
      
      if (onPostUpdate) {
        onPostUpdate(improvedText);
      }
      
      if (onAnalyticsRefresh) {
        onAnalyticsRefresh();
      }
      
      if (onWinnerStats) {
        console.log('📊 Getting winner stats for improved text...');
        try {
          const predictionResponse = await import('@/lib/api').then(api => 
            api.predictEngagement({ 
              text: improvedText, 
              followers: followers || 1000 
            })
          );
          onWinnerStats(predictionResponse.ranges);
          console.log('✅ Winner stats set:', predictionResponse.ranges);
        } catch (error) {
          console.error('❌ Failed to get winner stats:', error);
        }
      }
      
      console.log('🎉 Text improvement completed successfully!');
    } catch (error) {
      console.error('❌ Failed to improve text:', error);
      const improvedText = generateImprovedText(currentContent);
      console.log('🔄 Using fallback improvement:', improvedText);
      
      setTextSegments([{ text: improvedText, isImproved: false }]);
      setCurrentContent(improvedText);
      setHasBeenImproved(false);
      
      if (onTweetTextChange) {
        console.log('🔄 Syncing fallback text with store...');
        onTweetTextChange(improvedText);
      }
      
      if (onPostUpdate) {
        onPostUpdate(improvedText);
      }
      
      if (onAnalyticsRefresh) {
        onAnalyticsRefresh();
      }
    } finally {
      setIsImproving(false);
      console.log('🏁 Improvement process finished');
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
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsPosting(false);
    
    if (onAnalyticsRefresh) {
      onAnalyticsRefresh();
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditableInput = () => {
    if (editableRef.current) {
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
      if (onTweetTextChange) {
        onTweetTextChange(newContent);
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
      <div className="text-xl placeholder:text-muted-foreground bg-transparent border-none outline-none resize-none min-h-[120px] font-normal text-foreground">
        {content}
        {shouldTruncateText() && (
          <button
            onClick={() => setShowFullText(true)}
            className="text-primary hover:underline touch-manipulation p-1 -m-1"
          >
            Show more
          </button>
        )}
        {showFullText && currentContent.length > TRUNCATE_LENGTH && (
          <button
            onClick={() => setShowFullText(false)}
            className="text-primary hover:underline ml-1 touch-manipulation p-1 -m-1"
          >
            Show less
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      <Card className="bg-background border-border shadow-xl rounded-2xl w-full flex flex-col relative p-0 gap-0">
        {/* Loading overlay */}
        {isImproving && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl z-50 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground font-medium">Improving your text...</p>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEditClick}
            className="text-muted-foreground hover:text-foreground p-2 h-auto"
            disabled={isEditing}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            className="text-primary hover:text-primary font-normal text-[15px] px-0"
          >
            Drafts
          </Button>
        </div>

        {/* Main compose area */}
        <div className="p-4">
          <div className="flex gap-3 mb-4">
            {/* Avatar */}
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>

            {/* Text area and content */}
            <div className="flex-1 min-h-0">
              <div 
                className="text-xl placeholder:text-muted-foreground bg-transparent border-none outline-none resize-none min-h-[120px] font-normal text-foreground"
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                }}
              >
                {renderContent()}
              </div>

              {/* Image previews */}
              {postData.images.length > 0 && (
                <div className="mt-3">
                  <div className={`grid gap-1 ${
                    postData.images.length === 1 ? 'grid-cols-1' : 
                    postData.images.length === 2 ? 'grid-cols-2' : 
                    postData.images.length === 3 ? 'grid-cols-3' :
                    'grid-cols-2'
                  } rounded-2xl overflow-hidden border border-border`}>
                    {postData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="relative overflow-hidden bg-muted">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Upload ${index + 1}`}
                            className={`w-full object-cover transition-transform group-hover:scale-105 ${
                              postData.images.length === 1 
                                ? 'aspect-[16/10] max-h-[400px]' 
                                : postData.images.length === 2
                                ? 'aspect-square'
                                : 'aspect-square'
                            }`}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Everyone can reply - aligned with avatar */}
          <div className="flex items-center gap-1 mt-4 pb-4 border-b border-border ml-3">
            <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="text-primary text-[15px] font-normal">Everyone can reply</span>
          </div>

          {/* Bottom toolbar - aligned with avatar */}
          <div className="flex items-center justify-between mt-3 ml-3">
            {/* Engagement Metrics Row */}
            <div className="flex items-center justify-between flex-1 space-x-6 mr-6">
              {/* Retweet */}
              <button className="group flex items-center space-x-2 text-muted-foreground hover:text-green-600 transition-colors p-2 -m-2 rounded-full hover:bg-green-50">
                <Repeat2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium group-hover:font-semibold">
                  {ranges?.retweets ? 
                    `${ranges.retweets.low}–${ranges.retweets.high}` : 
                    `${Math.floor(Math.random() * 50) + 10}`
                  }
                </span>
              </button>
              
              {/* Like */}
              <button className="group flex items-center space-x-2 text-muted-foreground hover:text-red-600 transition-colors p-2 -m-2 rounded-full hover:bg-red-50">
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium group-hover:font-semibold">
                  {ranges?.likes ? 
                    `${ranges.likes.low}–${ranges.likes.high}` : 
                    `${Math.floor(Math.random() * 200) + 50}`
                  }
                </span>
              </button>
              
              {/* Bookmark */}
              <button className="group flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors p-2 -m-2 rounded-full hover:bg-primary/10">
                <Bookmark className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium group-hover:font-semibold">
                  {ranges?.replies ? 
                    `${ranges.replies.low}–${ranges.replies.high}` : 
                    `${Math.floor(Math.random() * 30) + 5}`
                  }
                </span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                onClick={handleImproveClick} 
                variant="outline" 
                size="sm"
                disabled={isImproving || !currentContent.trim()}
                className="rounded-full px-4 py-1.5 text-[15px] font-bold border-border text-foreground hover:bg-secondary"
              >
                {isImproving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Tweaking...
                  </>
                ) : (
                  'Promote'
                )}
              </Button>
              
              <Button 
                onClick={handlePost}
                disabled={isPosting || !currentContent.trim()}
                className="bg-foreground hover:bg-foreground/90 disabled:bg-foreground/50 text-background rounded-full px-6 py-1.5 text-[15px] font-bold min-w-[60px] h-8"
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                }}
              >
                {isPosting ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
