
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Globe, ImageIcon, FileText, BarChart3, Smile, Calendar, MapPin } from "lucide-react";

export const TwitterCompose = () => {
  return (
    <div className="bg-black text-white p-4">
      {/* Main compose area */}
      <div className="flex items-start space-x-3">
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src="/placeholder.svg?height=40&width=40" />
          <AvatarFallback className="bg-blue-500 text-white text-sm">A</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <textarea
            className="w-full min-h-[60px] text-xl placeholder-gray-500 border-none outline-none resize-none bg-transparent font-normal text-white"
            placeholder="What's happening?"
            defaultValue="built an algorithm that analyzes your digital footprint to create content that triggers you to react. at scale"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            }}
          />
          
          {/* Reply setting */}
          <div className="flex items-center space-x-2 mb-4 mt-2">
            <Globe className="h-4 w-4 text-blue-500" />
            <span className="text-blue-500 text-sm font-medium">Everyone can reply</span>
          </div>

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between border-t border-gray-800 pt-3">
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-500/10 h-8 w-8 rounded-full">
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-500/10 h-8 w-8 rounded-full">
                <FileText className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-500/10 h-8 w-8 rounded-full">
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-500/10 h-8 w-8 rounded-full">
                <Smile className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-500/10 h-8 w-8 rounded-full">
                <Calendar className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-500/10 h-8 w-8 rounded-full">
                <MapPin className="h-4 w-4" />
              </Button>
            </div>

            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-1.5 text-sm font-bold"
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
  );
};
