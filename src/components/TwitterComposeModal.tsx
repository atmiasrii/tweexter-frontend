
import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Globe, ImageIcon, FileText, BarChart3, Smile, Calendar, MapPin, X } from "lucide-react";

interface TwitterComposeModalProps {
  onPost: (content: string, images: File[]) => void;
}

export const TwitterComposeModal = ({ onPost }: TwitterComposeModalProps) => {
  const [postText, setPostText] = useState("built an algorithm that analyzes your digital footprint to create content that triggers you to react. at scale");
  const [isPosting, setIsPosting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePost = async () => {
    setIsPosting(true);
    
    // Simulate posting delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onPost(postText, selectedImages);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages(prev => [...prev, ...files].slice(0, 4)); // Max 4 images
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const insertEmoji = (emoji: string) => {
    setPostText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const popularEmojis = ['😀', '😂', '❤️', '🔥', '👍', '🎉', '💯', '🚀', '✨', '🙌'];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black border border-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Compose Analytics Post</h2>
          <div className="w-6 h-6"></div>
        </div>

        {/* Compose Area */}
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <Avatar className="w-12 h-12 flex-shrink-0">
              <AvatarImage src="/placeholder.svg?height=48&width=48" />
              <AvatarFallback className="bg-blue-500 text-white text-lg font-medium">DA</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-h-0">
              <textarea
                className="w-full min-h-[160px] text-xl placeholder-gray-500 border-none outline-none resize-none bg-transparent font-normal text-white leading-7 mb-4"
                placeholder="Share your data insights..."
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                }}
              />

              {/* Image Preview */}
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded-xl"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-black/90"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Reply setting */}
              <div className="flex items-center space-x-2 mb-6">
                <Globe className="h-4 w-4 text-blue-500" />
                <span className="text-blue-500 text-sm font-medium hover:underline cursor-pointer">Everyone can reply</span>
              </div>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="mb-4 p-3 bg-gray-900 rounded-xl border border-gray-700">
                  <div className="grid grid-cols-5 gap-2">
                    {popularEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => insertEmoji(emoji)}
                        className="text-2xl p-2 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Picker */}
              {showLocationPicker && (
                <div className="mb-4 p-3 bg-gray-900 rounded-xl border border-gray-700">
                  <div className="space-y-2">
                    <button className="w-full text-left p-2 hover:bg-gray-800 rounded-lg text-white">
                      📍 Current Location
                    </button>
                    <button className="w-full text-left p-2 hover:bg-gray-800 rounded-lg text-white">
                      🏢 San Francisco, CA
                    </button>
                    <button className="w-full text-left p-2 hover:bg-gray-800 rounded-lg text-white">
                      🌉 Silicon Valley
                    </button>
                  </div>
                </div>
              )}

              {/* Scheduler */}
              {showScheduler && (
                <div className="mb-4 p-3 bg-gray-900 rounded-xl border border-gray-700">
                  <div className="text-white text-sm mb-2">Schedule for later</div>
                  <input
                    type="datetime-local"
                    className="bg-gray-800 text-white p-2 rounded-lg border border-gray-600 w-full"
                  />
                </div>
              )}

              {/* Divider line */}
              <div className="border-t border-gray-800 my-4"></div>

              {/* Bottom toolbar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-blue-500 hover:bg-blue-500/10 h-10 w-10 rounded-full p-0"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-500/10 h-10 w-10 rounded-full p-0">
                    <FileText className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-500/10 h-10 w-10 rounded-full p-0">
                    <BarChart3 className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-blue-500 hover:bg-blue-500/10 h-10 w-10 rounded-full p-0"
                    onClick={() => {
                      setShowEmojiPicker(!showEmojiPicker);
                      setShowLocationPicker(false);
                      setShowScheduler(false);
                    }}
                  >
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-blue-500 hover:bg-blue-500/10 h-10 w-10 rounded-full p-0"
                    onClick={() => {
                      setShowScheduler(!showScheduler);
                      setShowEmojiPicker(false);
                      setShowLocationPicker(false);
                    }}
                  >
                    <Calendar className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-blue-500 hover:bg-blue-500/10 h-10 w-10 rounded-full p-0"
                    onClick={() => {
                      setShowLocationPicker(!showLocationPicker);
                      setShowEmojiPicker(false);
                      setShowScheduler(false);
                    }}
                  >
                    <MapPin className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Character count circle */}
                  <div className="w-6 h-6 rounded-full border-2 border-gray-600"></div>
                  
                  <Button
                    onClick={handlePost}
                    disabled={isPosting || !postText.trim()}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-full px-8 py-2 text-[15px] font-bold min-w-[100px] h-10 transition-all duration-200"
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                    }}
                  >
                    {isPosting ? "Publishing..." : "Publish Analysis"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
