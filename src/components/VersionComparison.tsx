
import { ChevronDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export const VersionComparison = () => {
  return (
    <div className="bg-white p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-lg">A</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-gray-900">Version A</h2>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-sm text-gray-600">Post to Anyone</p>
        </div>
      </div>
      
      <div className="mb-4">
        <Textarea 
          placeholder="What do you want to talk about?"
          className="min-h-[120px] resize-none border-none shadow-none text-base placeholder:text-gray-500 focus-visible:ring-0 p-0"
          defaultValue="built an algorithm that analyzes your digital footprint to create content that triggers you to react. at scale"
        />
      </div>
    </div>
  );
};
