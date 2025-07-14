
import { 
  Image, 
  FileText, 
  X, 
  BarChart3, 
  MessageCircle, 
  Camera, 
  MapPin, 
  Bold, 
  Italic, 
  Heart,
  Plus 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Toolbar = () => {
  const iconStyle = "w-5 h-5 text-blue-400";
  
  return (
    <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-700">
      <div className="flex items-center space-x-4">
        <Image className={iconStyle} />
        <FileText className={iconStyle} />
        <X className={iconStyle} />
        <BarChart3 className={iconStyle} />
        <MessageCircle className={iconStyle} />
        <Camera className={iconStyle} />
        <MapPin className={iconStyle} />
        <Bold className={iconStyle} />
        <Italic className={iconStyle} />
      </div>
      
      <div className="flex items-center space-x-4">
        <Heart className="w-5 h-5 text-gray-500" />
        <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
          <Plus className="w-4 h-4 text-white" />
        </div>
        <Button 
          className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-full font-medium"
        >
          Predict
        </Button>
      </div>
    </div>
  );
};
