
import { ChevronDown } from "lucide-react";

export const VersionComparison = () => {
  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="flex items-center space-x-3">
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
      <div className="mt-4">
        <p className="text-gray-900 text-base leading-relaxed">
          built an algorithm that analyzes your digital footprint to create content that triggers you to react. at scale
        </p>
      </div>
    </div>
  );
};
