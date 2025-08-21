
import { Link, Edit, Share2, Mail, Globe, MoreHorizontal } from "lucide-react";

export const Header = () => {
  return (
    <div className="bg-orange-500/90 backdrop-blur-sm px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-4 h-4 bg-orange-600 rounded-full"></div>
        <span className="text-white font-medium">tweexter.co</span>
      </div>
      <div className="flex items-center space-x-2">
        <Link className="w-4 h-4 text-white" />
        <Edit className="w-4 h-4 text-white" />
        <Share2 className="w-4 h-4 text-white" />
        <Mail className="w-4 h-4 text-white" />
        <Globe className="w-4 h-4 text-white" />
        <MoreHorizontal className="w-4 h-4 text-white" />
      </div>
    </div>
  );
};
