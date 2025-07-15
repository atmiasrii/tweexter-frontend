
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Eye, Sparkles } from "lucide-react";
import { TwitterImprovementModal } from "@/components/TwitterImprovementModal";

interface PostData {
  content: string;
  images: File[];
}

interface TwitterComposeProps {
  hasPosted?: boolean;
  postData?: PostData;
  onPostUpdate?: (updatedContent: string) => void;
}

export const TwitterCompose = ({ 
  hasPosted = false, 
  postData = { content: "", images: [] },
  onPostUpdate 
}: TwitterComposeProps) => {
  const [isImprovementModalOpen, setIsImprovementModalOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState(postData.content);
  const [hasBeenImproved, setHasBeenImproved] = useState(false);

  if (!hasPosted || !currentContent) {
    return (
      <div className="w-full h-full flex flex-col">
        <Card className="bg-black/50 backdrop-blur-xl border-gray-700/50 flex-1 flex flex-col justify-center items-center shadow-2xl shadow-black/20 rounded-3xl">
          <div className="text-gray-500 text-lg">No post to display</div>
        </Card>
      </div>
    );
  }

  const handleImproveClick = () => {
    setIsImprovementModalOpen(true);
  };

  const handleApplyImprovement = (improvedText: string) => {
    setCurrentContent(improvedText);
    setHasBeenImproved(true);
    if (onPostUpdate) {
      onPostUpdate(improvedText);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Card className="bg-black/50 backdrop-blur-xl border-gray-700/50 flex-1 flex flex-col justify-center shadow-2xl shadow-black/20 rounded-3xl">
        <div className="p-6 sm:p-8 flex justify-center items-center min-h-0">
          <div className="w-full max-w-lg">
            <div className="flex items-start space-x-3">
              <Avatar className="w-12 h-12 flex-shrink-0 ring-2 ring-gray-700/50">
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-lg font-medium">DA</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-white font-semibold">Data Analytics</span>
                  <span className="text-gray-400 text-sm">@dataanalytics</span>
                  <span className="text-gray-500 text-sm">·</span>
                  <span className="text-gray-400 text-sm">2m</span>
                  {hasBeenImproved && (
                    <div className="flex items-center gap-1 bg-blue-500/20 px-2 py-0.5 rounded-full">
                      <Sparkles className="h-3 w-3 text-blue-400" />
                      <span className="text-xs text-blue-400 font-medium">Improved</span>
                    </div>
                  )}
                </div>
                <p className="text-white text-[15px] leading-5 mb-3 font-normal">
                  {currentContent}
                </p>
                
                {/* Display uploaded images */}
                {postData.images.length > 0 && (
                  <div className={`grid gap-2 mb-3 ${
                    postData.images.length === 1 ? 'grid-cols-1' : 
                    postData.images.length === 2 ? 'grid-cols-2' : 
                    'grid-cols-2'
                  }`}>
                    {postData.images.map((image, index) => (
                      <div key={index} className="relative overflow-hidden rounded-2xl border border-gray-700/30">
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
                  <div className="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-blue-500 text-sm font-normal">Everyone can reply</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-gray-400">
                    <div className="flex items-center space-x-2 hover:text-blue-400 transition-colors cursor-pointer">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-medium">89.1K</span>
                    </div>
                    <div className="flex items-center space-x-2 hover:text-green-400 transition-colors cursor-pointer">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-medium">3.2K</span>
                    </div>
                    <div className="flex items-center space-x-2 hover:text-purple-400 transition-colors cursor-pointer">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-medium">+15.7%</span>
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    onClick={handleImproveClick}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ml-auto"
                  >
                    <Sparkles className="h-4 w-4 mr-1.5" />
                    Improve
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <TwitterImprovementModal
        isOpen={isImprovementModalOpen}
        onClose={() => setIsImprovementModalOpen(false)}
        originalText={postData.content}
        onApplyImprovement={handleApplyImprovement}
      />
    </div>
  );
};
