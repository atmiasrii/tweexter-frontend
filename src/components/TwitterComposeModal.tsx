
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Globe, ImageIcon, FileText, BarChart3, Smile, Calendar, MapPin } from "lucide-react";

interface TwitterComposeModalProps {
  onPost: () => void;
}

export const TwitterComposeModal = ({ onPost }: TwitterComposeModalProps) => {
  const [postText, setPostText] = useState("built an algorithm that analyzes your digital footprint to create content that triggers you to react. at scale");
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    setIsPosting(true);
    
    // Simulate posting delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onPost();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black border border-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Compose post</h2>
          <div className="w-6 h-6"></div> {/* Spacer for centering */}
        </div>

        {/* Compose Area */}
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <Avatar className="w-12 h-12 flex-shrink-0">
              <AvatarImage src="/placeholder.svg?height=48&width=48" />
              <AvatarFallback className="bg-blue-500 text-white text-lg font-medium">A</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-h-0">
              <textarea
                className="w-full min-h-[200px] text-xl placeholder-gray-500 border-none outline-none resize-none bg-transparent font-normal text-white leading-7 mb-4"
                placeholder="What's happening?"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                }}
              />
              
              {/* Reply setting */}
              <div className="flex items-center space-x-2 mb-6">
                <Globe className="h-4 w-4 text-blue-500" />
                <span className="text-blue-500 text-sm font-medium hover:underline cursor-pointer">Everyone can reply</span>
              </div>

              {/* Divider line */}
              <div className="border-t border-gray-800 my-4"></div>

              {/* Bottom toolbar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-500/10 h-10 w-10 rounded-full p-0">
                    <ImageIcon className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-500/10 h-10 w-10 rounded-full p-0">
                    <FileText className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-500/10 h-10 w-10 rounded-full p-0">
                    <BarChart3 className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-500/10 h-10 w-10 rounded-full p-0">
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-500/10 h-10 w-10 rounded-full p-0">
                    <Calendar className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-500/10 h-10 w-10 rounded-full p-0">
                    <MapPin className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Character count circle */}
                  <div className="w-6 h-6 rounded-full border-2 border-gray-600"></div>
                  
                  <Button
                    onClick={handlePost}
                    disabled={isPosting || !postText.trim()}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-full px-8 py-2 text-[15px] font-bold min-w-[80px] h-10 transition-all duration-200"
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
      </div>
    </div>
  );
};
