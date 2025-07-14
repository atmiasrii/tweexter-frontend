
import { 
  Image, 
  Calendar, 
  FileText, 
  MoreHorizontal,
  Smile,
  Plus,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Toolbar = () => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 cursor-pointer">
            <Image className="w-5 h-5" />
          </div>
          <div className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 cursor-pointer">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 cursor-pointer">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 cursor-pointer">
            <Plus className="w-5 h-5" />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Smile className="w-5 h-5 text-gray-600 hover:text-blue-600 cursor-pointer" />
          <Clock className="w-5 h-5 text-gray-600" />
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium">
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};
