
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Globe, ImageIcon, FileText, BarChart3, Smile, Calendar, MapPin } from "lucide-react";

export const TwitterCompose = () => {
  return (
    <div className="bg-black">
      {/* Card container matching X's design */}
      <div className="bg-black border-b border-gray-800">
        <div className="p-4">
          {/* Main compose area */}
          <div className="flex items-start space-x-3">
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">A</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-h-0">
              <textarea
                className="w-full min-h-[120px] text-xl placeholder-gray-500 border-none outline-none resize-none bg-transparent font-normal text-white leading-6"
                placeholder="What's happening?"
                defaultValue="built an algorithm that analyzes your digital footprint to create content that triggers you to react. at scale"
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                }}
              />
              
              {/* Reply setting */}
              <div className="flex items-center space-x-2 mb-4 mt-2">
                <Globe className="h-4 w-4 text-blue-500" />
                <span className="text-blue-500 text-sm font-medium hover:underline cursor-pointer">Everyone can reply</span>
              </div>

              {/* Divider line */}
              <div className="border-t border-gray-800 my-3"></div>

              {/* Bottom toolbar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-500/10 h-9 w-9 rounded-full p-0">
                    <ImageIcon className="h-[18px] w-[18px]" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-500/10 h-9 w-9 rounded-full p-0">
                    <FileText className="h-[18px] w-[18px]" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-500/10 h-9 w-9 rounded-full p-0">
                    <BarChart3 className="h-[18px] w-[18px]" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-500/10 h-9 w-9 rounded-full p-0">
                    <Smile className="h-[18px] w-[18px]" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-500/10 h-9 w-9 rounded-full p-0">
                    <Calendar className="h-[18px] w-[18px]" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-500/10 h-9 w-9 rounded-full p-0">
                    <MapPin className="h-[18px] w-[18px]" />
                  </Button>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Character count circle (placeholder) */}
                  <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>
                  
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-1.5 text-[15px] font-bold min-w-[64px] h-9"
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                    }}
                  >
                    Post
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
