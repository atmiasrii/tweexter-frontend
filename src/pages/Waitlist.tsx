import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, ImageIcon, Smile, MapPin, Calendar, BarChart3, Gift, Hash } from "lucide-react";
import { TwitterDashboard } from "@/components/TwitterDashboard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WaitlistData {
  email: string;
  name: string;
}

interface WaitlistProps {
  onSignup?: (data: WaitlistData) => void;
}

export const Waitlist = ({ onSignup }: WaitlistProps) => {
  const [waitlistText, setWaitlistText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-focus the textarea when the component mounts
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSignup = async () => {
    if (waitlistText.trim() && !isSubmitting) {
      setIsSubmitting(true);
      
      try {
        // Parse the input to extract email and X handle
        const text = waitlistText.trim();
        const parts = text.split(/\s+/); // Split by whitespace
        
        let email = "";
        let xHandle = "";
        
        // Find email (contains @something.com pattern) and handle
        for (const part of parts) {
          if (part.includes("@") && part.includes(".")) {
            // This looks like an email
            email = part;
          } else if (part.startsWith("@") || (!email && !part.includes("@"))) {
            // This looks like a handle (starts with @ or is the other non-email part)
            xHandle = part.startsWith("@") ? part : `@${part}`;
          } else if (!email) {
            // If no email found yet and this doesn't look like email, treat as handle
            xHandle = part.startsWith("@") ? part : part;
          }
        }
        
        // If we couldn't find both, try a different approach
        if (!email || !xHandle) {
          const emailPattern = /\S+@\S+\.\S+/;
          const emailMatch = text.match(emailPattern);
          
          if (emailMatch) {
            email = emailMatch[0];
            // Remove email from text to get handle
            const remainingText = text.replace(email, "").trim();
            xHandle = remainingText || text.split(/\s+/)[0] || "";
          } else {
            // No clear email pattern, treat first part as handle, second as email
            const firstPart = parts[0] || "";
            const secondPart = parts[1] || "";
            
            if (firstPart.includes("@") && firstPart.includes(".")) {
              email = firstPart;
              xHandle = secondPart;
            } else {
              xHandle = firstPart;
              email = secondPart;
            }
          }
        }
        
        // Clean up handle (remove @ if present for storage)
        const cleanHandle = xHandle.startsWith("@") ? xHandle.slice(1) : xHandle;
        
        if (!email || !cleanHandle) {
          toast.error("Please provide both an email and X handle");
          setIsSubmitting(false);
          return;
        }
        
        // Save to database
        const { error } = await supabase
          .from('waitlist')
          .insert({
            email: email,
            x_handle: cleanHandle
          });
        
        if (error) {
          toast.error("Failed to join waitlist. Please try again.");
          console.error('Error saving to waitlist:', error);
        } else {
          toast.success("Successfully joined the waitlist!");
          setWaitlistText("");
          
          // Call onSignup if provided for backwards compatibility
          if (onSignup) {
            onSignup({ email, name: cleanHandle });
          }
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
        console.error('Error:', error);
      }
      
      setIsSubmitting(false);
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
      <div className="relative z-10 flex items-start justify-center pt-12 min-h-screen">
        <div className="bg-background rounded-2xl rounded-b-3xl w-full max-w-[600px] mx-4 shadow-xl border border-border">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <button 
              onClick={() => navigate("/")}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
            <Button
              variant="ghost"
              className="text-primary hover:text-primary font-normal text-[15px] px-0"
            >
              Join Waitlist
            </Button>
          </div>

          {/* Main compose area */}
          <div className="p-4 rounded-b-3xl">
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
                  value={waitlistText}
                  onChange={(e) => setWaitlistText(e.target.value)}
                  placeholder="Drop in your email and X handle to join the waitlist."
                  className="w-full text-xl placeholder:text-muted-foreground bg-transparent border-none outline-none resize-none min-h-[120px] font-normal text-foreground"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  }}
                />

                {/* Image previews - keeping same functionality */}
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
              </div>
            </div>

          {/* Everyone can reply - aligned with avatar */}
          <div className="flex items-center gap-1 mt-4 pb-4 border-b border-border ml-3">
            <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="text-primary text-[15px] font-normal">Early access notification</span>
          </div>

          {/* Bottom toolbar - aligned with avatar */}
          <div className="flex items-center justify-between mt-3 ml-3">
              <div className="flex items-center gap-4">
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
                  className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                
                <button className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary">
                  <Gift className="w-5 h-5" />
                </button>
                
                <button className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary">
                  <Hash className="w-5 h-5" />
                </button>
                
                <button className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary">
                  <Smile className="w-5 h-5" />
                </button>
                
                <button className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary">
                  <Calendar className="w-5 h-5" />
                </button>
                
                <button className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary">
                  <MapPin className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-4 py-1.5 text-[15px] font-bold border-border text-foreground hover:bg-secondary"
                >
                  Share on X
                </Button>
                
                <Button
                  onClick={handleSignup}
                  disabled={isSubmitting || !waitlistText.trim()}
                  className="bg-foreground hover:bg-foreground/90 disabled:bg-foreground/50 text-background rounded-full px-6 py-1.5 text-[15px] font-bold min-w-[60px] h-8"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  }}
                >
                  {isSubmitting ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
