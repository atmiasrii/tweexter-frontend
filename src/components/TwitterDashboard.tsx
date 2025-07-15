
import { useState } from "react";
import { TwitterCompose } from "@/components/TwitterCompose";
import { TwitterEngagementChart } from "@/components/TwitterEngagementChart";
import { TwitterMetrics } from "@/components/TwitterMetrics";

interface PostData {
  content: string;
  images: File[];
}

interface TwitterDashboardProps {
  hasPosted?: boolean;
  postData?: PostData;
  onPostUpdate?: (updatedContent: string) => void;
}

export const TwitterDashboard = ({ 
  hasPosted = false, 
  postData = { content: "", images: [] },
  onPostUpdate
}: TwitterDashboardProps) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAnalyticsRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden animate-fade-in">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 py-6 h-full">
          {/* Left side - Performance Metrics and Chart */}
          <div className="w-full lg:w-1/2 xl:w-3/5 space-y-6 overflow-y-auto">
            {/* Performance Metrics - Compact */}
            <div className="h-[45%]">
              <TwitterMetrics key={`metrics-${refreshKey}`} />
            </div>
            
            {/* Engagement Chart - Compact */}
            <div className="h-[50%]">
              <TwitterEngagementChart key={`chart-${refreshKey}`} />
            </div>
          </div>
          
          {/* Right side - Twitter Compose */}
          <div className="w-full lg:w-1/2 xl:w-2/5 h-full overflow-y-auto">
            <div className="h-full">
              <TwitterCompose 
                hasPosted={hasPosted} 
                postData={postData}
                onPostUpdate={onPostUpdate}
                onAnalyticsRefresh={handleAnalyticsRefresh}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
