
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Globe, ImageIcon, FileText, BarChart3, Smile, Calendar, MapPin, TrendingUp, Users, Eye } from "lucide-react";

interface TwitterComposeProps {
  hasPosted?: boolean;
  postedContent?: string;
}

export const TwitterCompose = ({ hasPosted = false, postedContent = "" }: TwitterComposeProps) => {
  const [postText, setPostText] = useState(postedContent || "built an algorithm that analyzes your digital footprint to create content that triggers you to react. at scale");
  const [originalText] = useState("built an algorithm that analyzes your digital footprint to create content that triggers you to react. at scale");
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    setIsPosting(true);
    
    // Simulate posting delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsPosting(false);
  };

  const hasContentChanged = postText.trim() !== originalText.trim();
  const canPost = hasContentChanged && postText.trim().length > 0;

  return (
    <div className="w-full h-full flex flex-col">
      <Card className="bg-black border-gray-800 flex-1 flex flex-col">
        <div className="p-4 sm:p-6 flex-1 flex flex-col">
          {hasPosted && (
            <div className="mb-4 pb-4 border-b border-gray-800">
              <div className="flex items-center space-x-2 mb-3">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                <span className="text-blue-500 text-sm font-medium">Published Analysis</span>
              </div>
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">DA</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-white font-medium">Data Analytics</span>
                    <span className="text-gray-500 text-sm">@dataanalytics</span>
                    <span className="text-gray-500 text-sm">·</span>
                    <span className="text-gray-500 text-sm">2m</span>
                  </div>
                  <p className="text-white text-base leading-6 mb-3">
                    {postedContent || postText}
                  </p>
                  <div className="flex items-center space-x-6 text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">89.1K</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">3.2K</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">+15.7%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main compose area */}
          <div className="flex items-start space-x-3 flex-1">
            <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">DA</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-h-0 w-full flex flex-col">
              <textarea
                className="w-full flex-1 min-h-[100px] text-lg sm:text-xl placeholder-gray-500 border-none outline-none resize-none bg-transparent font-normal text-white leading-6"
                placeholder={hasPosted ? "Share another insight..." : "What analytics insights are you sharing?"}
                value={hasPosted ? "" : postText}
                onChange={(e) => setPostText(e.target.value)}
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                }}
              />
              
              {/* Reply setting */}
              <div className="flex items-center space-x-2 mb-4 mt-2">
                <Globe className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-blue-500 text-sm font-medium hover:underline cursor-pointer">Everyone can see analytics</span>
              </div>

              {/* Divider line */}
              <div className="border-t border-gray-800 my-3"></div>

              {/* Bottom toolbar */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center space-x-1 overflow-x-auto">
                  <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-500/10 h-8 w-8 sm:h-9 sm:w-9 rounded-full p-0 flex-shrink-0">
                    <BarChart3 className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-500/10 h-8 w-8 sm:h-9 sm:w-9 rounded-full p-0 flex-shrink-0">
                    <ImageIcon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-500/10 h-8 w-8 sm:h-9 sm:w-9 rounded-full p-0 flex-shrink-0">
                    <FileText className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-500/10 h-8 w-8 sm:h-9 sm:w-9 rounded-full p-0 flex-shrink-0">
                    <Smile className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-500/10 h-8 w-8 sm:h-9 sm:w-9 rounded-full p-0 flex-shrink-0">
                    <Calendar className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-500/10 h-8 w-8 sm:h-9 sm:w-9 rounded-full p-0 flex-shrink-0">
                    <MapPin className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  </Button>
                </div>

                <div className="flex items-center space-x-3 flex-shrink-0">
                  {/* Character count circle (placeholder) */}
                  <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={handlePost}
                      disabled={isPosting || (!hasPosted && !canPost)}
                      className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-full px-4 sm:px-6 py-1.5 text-sm sm:text-[15px] font-bold min-w-[80px] sm:min-w-[90px] h-8 sm:h-9"
                      style={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                      }}
                    >
                      {isPosting ? "Publishing..." : hasPosted ? "Post Update" : "Publish"}
                    </Button>
                    
                    {hasPosted && (
                      <Button
                        className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-4 sm:px-6 py-1.5 text-sm sm:text-[15px] font-bold min-w-[80px] sm:min-w-[90px] h-8 sm:h-9"
                        style={{
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                        }}
                      >
                        Optimize
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
