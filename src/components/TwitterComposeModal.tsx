import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ImageIcon, Smile, MapPin, Calendar, Gift, Hash, Bold, Italic, RotateCcw } from "lucide-react";

interface PostData {
  content: string;
  images: File[];
}

interface TwitterComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (data: PostData) => void;
}

export const TwitterComposeModal: React.FC<TwitterComposeModalProps> = ({ isOpen, onClose, onPost }) => {
  const [postText, setPostText] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePost = async () => {
    if (postText.trim() && !isPosting) {
      setIsPosting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const postData = { content: postText, images: selectedImages };
      onPost(postData);
      setIsPosting(false);
      handleClose();
    }
  };

  const handleClose = () => {
    setPostText("");
    setSelectedImages([]);
    setIsPosting(false);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
      e.preventDefault();
      formatText('**');
    } else if ((e.ctrlKey || e.metaKey) && (e.key === 'i' || e.key === 'I')) {
      e.preventDefault();
      formatText('*');
    }
  };

  const handleSelectionChange = () => {
    if (textareaRef.current) {
      setSelectionStart(textareaRef.current.selectionStart);
      setSelectionEnd(textareaRef.current.selectionEnd);
      setCursorPosition(textareaRef.current.selectionStart);
    }
  };

  const isTextBold = () => {
    if (!textareaRef.current) return false;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = postText.substring(start, end);
    
    // Check if selection is wrapped with **
    const beforeText = postText.substring(Math.max(0, start - 2), start);
    const afterText = postText.substring(end, Math.min(postText.length, end + 2));
    
    return beforeText === '**' && afterText === '**' && selectedText.length > 0;
  };

  const isTextItalic = () => {
    if (!textareaRef.current) return false;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = postText.substring(start, end);
    
    // Check if selection is wrapped with * (but not **)
    const beforeText = postText.substring(Math.max(0, start - 1), start);
    const afterText = postText.substring(end, Math.min(postText.length, end + 1));
    const beforeTwoChars = postText.substring(Math.max(0, start - 2), start);
    const afterTwoChars = postText.substring(end, Math.min(postText.length, end + 2));
    
    return beforeText === '*' && afterText === '*' && selectedText.length > 0 && beforeTwoChars !== '**' && afterTwoChars !== '**';
  };

  const toggleBold = () => {
    formatText('**');
  };

  const toggleItalic = () => {
    formatText('*');
  };

  const formatText = (wrapper: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = postText.substring(start, end);
    
    let newText: string;
    let newCursorPos: number;
    
    if (selectedText) {
      // Check if text is already wrapped and remove if so
      const wrapperLength = wrapper.length;
      const beforeText = postText.substring(Math.max(0, start - wrapperLength), start);
      const afterText = postText.substring(end, Math.min(postText.length, end + wrapperLength));
      
      if (beforeText === wrapper && afterText === wrapper) {
        // Remove wrapper
        newText = postText.substring(0, start - wrapperLength) + selectedText + postText.substring(end + wrapperLength);
        newCursorPos = start - wrapperLength + selectedText.length;
      } else {
        // Add wrapper
        newText = postText.substring(0, start) + wrapper + selectedText + wrapper + postText.substring(end);
        newCursorPos = end + wrapper.length * 2;
      }
    } else {
      // Insert wrapper at cursor position
      newText = postText.substring(0, start) + wrapper + wrapper + postText.substring(start);
      newCursorPos = start + wrapper.length;
    }
    
    setPostText(newText);
    
    // Restore cursor position after state update
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (selectedImages.length + files.length <= 4) {
      setSelectedImages(prev => [...prev, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[600px] p-0 gap-0 bg-background border-border [&>button[aria-label='Close']]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
          <Button
            variant="ghost"
            className="text-primary hover:text-primary font-normal text-[15px] px-0"
          >
            Drafts
          </Button>
        </div>

        {/* Main compose area */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          <div className="flex gap-3">
            {/* Avatar */}
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>

            {/* Text area and content */}
            <div className="flex-1 min-h-0">
              <textarea
                ref={textareaRef}
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                onKeyDown={handleKeyDown}
                onSelect={handleSelectionChange}
                onClick={handleSelectionChange}
                onKeyUp={handleSelectionChange}
                placeholder="What's happening?"
                className="w-full text-xl placeholder:text-muted-foreground bg-transparent border-none outline-none resize-none min-h-[120px] font-normal text-foreground"
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                }}
                autoFocus
              />

              {/* Image previews */}
              {selectedImages.length > 0 && (
                <div className="mt-3">
                  <div className={`grid gap-1 ${
                    selectedImages.length === 1 ? 'grid-cols-1' : 
                    selectedImages.length === 2 ? 'grid-cols-2' : 
                    selectedImages.length === 3 ? 'grid-cols-3' :
                    'grid-cols-2'
                  } rounded-2xl overflow-hidden border border-border`}>
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="relative overflow-hidden bg-muted">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Upload ${index + 1}`}
                            className={`w-full object-cover transition-transform group-hover:scale-105 ${
                              selectedImages.length === 1 
                                ? 'aspect-[16/10] max-h-[400px]' 
                                : selectedImages.length === 2
                                ? 'aspect-square'
                                : 'aspect-square'
                            }`}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </div>
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white rounded-full p-1.5 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                          aria-label="Remove image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Everyone can reply */}
              <div className="flex items-center gap-1 mt-4 pb-4 border-b border-border">
                <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="text-primary text-[15px] font-normal">Everyone can reply</span>
              </div>

              {/* Bottom toolbar */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  {/* Existing media buttons */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 hover:bg-primary/10 rounded-full transition-colors text-primary"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  
                  <button className="p-1.5 hover:bg-primary/10 rounded-full transition-colors text-primary">
                    <Gift className="w-4 h-4" />
                  </button>
                  
                  <button className="p-1.5 hover:bg-primary/10 rounded-full transition-colors text-primary">
                    <Hash className="w-4 h-4" />
                  </button>
                  
                  <button className="p-1.5 hover:bg-primary/10 rounded-full transition-colors text-primary">
                    <Smile className="w-4 h-4" />
                  </button>
                  
                  <button className="p-1.5 hover:bg-primary/10 rounded-full transition-colors text-primary">
                    <Calendar className="w-4 h-4" />
                  </button>
                  
                  <button className="p-1.5 hover:bg-primary/10 rounded-full transition-colors text-primary">
                    <MapPin className="w-4 h-4" />
                  </button>
                  
                  {/* Formatting buttons on the right */}
                  <button
                    onClick={toggleBold}
                    className={`w-7 h-7 flex items-center justify-center rounded transition-colors text-sm font-bold ${
                      isTextBold() 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-primary/10 text-primary'
                    }`}
                  >
                    B
                  </button>
                  
                  <button
                    onClick={toggleItalic}
                    className={`w-7 h-7 flex items-center justify-center rounded transition-colors text-sm font-bold italic ${
                      isTextItalic() 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-primary/10 text-primary'
                    }`}
                  >
                    I
                  </button>
                  
                  <button className="w-7 h-7 flex items-center justify-center hover:bg-primary/10 rounded transition-colors text-primary">
                    <div className="w-4 h-4 relative">
                      <svg className="w-4 h-4 transform -rotate-90" viewBox="0 0 16 16">
                        <circle
                          cx="8"
                          cy="8"
                          r="6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill="none"
                          className="opacity-20"
                        />
                        <circle
                          cx="8"
                          cy="8"
                          r="6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill="none"
                          strokeDasharray="37.7"
                          strokeDashoffset="25"
                          strokeLinecap="round"
                          className="text-primary"
                        />
                      </svg>
                    </div>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full px-4 py-1.5 text-[15px] font-bold border-border text-foreground hover:bg-secondary"
                  >
                    Promote
                  </Button>
                  
                  <Button
                    onClick={handlePost}
                    disabled={isPosting || !postText.trim()}
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};