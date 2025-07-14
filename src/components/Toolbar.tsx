
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
  const iconStyle = "w-5 h-5 text-cyan-400";
  
  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/20">
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
        <Heart className="w-5 h-5 text-pink-400" />
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
          <Plus className="w-4 h-4 text-white" />
        </div>
        <Button 
          className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-6 py-2 rounded-full font-medium border border-white/20"
        >
          Predict
        </Button>
      </div>
    </div>
  );
};
