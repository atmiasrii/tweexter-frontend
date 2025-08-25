import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, ImageIcon, Smile, MapPin, Calendar, BarChart3, Gift, Hash } from "lucide-react";
import { TwitterDashboard } from "@/components/TwitterDashboard";
import { usePredictionStore } from "@/store/prediction";

interface PostData {
  content: string;
  images: File[];
}

interface LandingProps {
  onPost: (data: PostData) => void;
}

export const Landing = ({ onPost }: LandingProps) => {
  const [postText, setPostText] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setTweetText, fetchPrediction } = usePredictionStore();

  const handlePost = async () => {
    if (postText.trim() && !isPosting) {
      setIsPosting(true);
      
      console.log('🚀 Landing - storing tweet text:', postText);
      
      // Store tweet text and run prediction in background
      setTweetText(postText);
      try {
        console.log('🔮 Landing - fetching prediction for text:', postText);
        await fetchPrediction();
      } catch (error) {
        console.error('Prediction failed:', error);
      }
      
      // Always redirect to login, don't call onPost yet
      navigate('/login');
      setIsPosting(false);
    }
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
    <div className="min-h-screen bg-background">
      {/* Background content - blurred */}
      <div className="fixed inset-0 blur-sm opacity-30">
        <TwitterDashboard hasPosted={false} postData={{ content: "", images: [] }} />
      </div>
      
      {/* Foreground modal */}
      <div className="relative z-10 flex items-start justify-center pt-4 sm:pt-12 min-h-screen px-2 sm:px-4">
        <div className="bg-background rounded-2xl w-full max-w-[600px] shadow-xl max-h-[95vh] sm:max-h-[85vh] overflow-y-auto border border-border mx-2 sm:mx-4">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
            <button className="p-2 hover:bg-secondary rounded-full transition-colors">
              <X className="w-5 h-5 text-foreground" />
            </button>
            <Button
              variant="ghost"
              className="text-primary hover:text-primary font-normal text-sm sm:text-[15px] px-0"
            >
              Drafts
            </Button>
          </div>

          {/* Main compose area */}
          <div className="p-3 sm:p-4">
            <div className="flex gap-2 sm:gap-3">
              {/* Avatar */}
              <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>

              {/* Text area and content */}
              <div className="flex-1 min-h-0">
                <textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  <textarea placeholder="What's happening?
                  Type a tweet to see its likes."></textarea>
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  }}
                />

                {/* Image previews */}
                {selectedImages.length > 0 && (
                  <div className="mt-3">
                    <div className={`grid gap-1 ${
                      selectedImages.length === 1 ? 'grid-cols-1' : 
                      selectedImages.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 
                      selectedImages.length === 3 ? 'grid-cols-2 sm:grid-cols-3' :
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
                                  ? 'aspect-[16/10] max-h-[300px] sm:max-h-[400px]' 
                                  : selectedImages.length === 2
                                  ? 'aspect-square'
                                  : 'aspect-square'
                              }`}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                          </div>
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white rounded-full p-1.5 transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                            aria-label="Remove image"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          {/* Everyone can reply - aligned with avatar */}
          <div className="flex items-center gap-1 mt-4 pb-3 sm:pb-4 border-b border-border ml-2 sm:ml-3">
            <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="text-primary text-sm sm:text-[15px] font-normal">Everyone can reply</span>
          </div>

          {/* Bottom toolbar - aligned with avatar */}
          <div className="flex items-center justify-between mt-3 ml-2 sm:ml-3 mr-3 sm:mr-4">
              <div className="flex items-center gap-1 sm:gap-4 overflow-x-auto">
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
                  className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary min-w-[36px]"
                >
                  <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                
                <button className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary min-w-[36px] hidden sm:block">
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                
                <button className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary min-w-[36px] hidden sm:block">
                  <Hash className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                
                <button className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary min-w-[36px]">
                  <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                
                <button className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary min-w-[36px] hidden sm:block">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                
                <button className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary min-w-[36px] hidden sm:block">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-3 sm:px-4 py-1.5 text-sm sm:text-[15px] font-bold border-border text-foreground hover:bg-secondary hidden sm:block"
                >
                  Promote
                </Button>
                
                <Button
                  onClick={handlePost}
                  disabled={isPosting || !postText.trim()}
                  className="bg-foreground hover:bg-foreground/90 disabled:bg-foreground/50 text-background rounded-full px-4 sm:px-6 py-1.5 text-sm sm:text-[15px] font-bold min-w-[60px] h-8"
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
    </div>
  );
};