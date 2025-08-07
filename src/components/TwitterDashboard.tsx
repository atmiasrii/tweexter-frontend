
import { useState } from "react";
import { TwitterCompose } from "@/components/TwitterCompose";
import { TwitterEngagementChart } from "@/components/TwitterEngagementChart";
import { TwitterMetrics } from "@/components/TwitterMetrics";
import { Card } from "@/components/ui/card";

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
    <div className="h-screen bg-background overflow-hidden animate-fade-in">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 py-6 h-full">
          {/* Left side - Twitter Compose - Centered vertically */}
          <div className="w-full lg:w-1/2 xl:w-2/5 h-full flex items-center">
            <div className="w-full">
              <TwitterCompose 
                hasPosted={hasPosted} 
                postData={postData}
                onPostUpdate={onPostUpdate}
                onAnalyticsRefresh={handleAnalyticsRefresh}
              />
            </div>
          </div>
          
          {/* Right side - Analytics Container */}
          <div className="w-full lg:w-1/2 xl:w-3/5 h-full flex items-center">
            <Card className="w-full h-[90%] bg-card border-border shadow-lg rounded-3xl overflow-hidden">
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-muted-foreground">Live</span>
                  </div>
                </div>
                
                {/* Performance Metrics - Very Compact */}
                <div className="h-[35%] mb-4">
                  <TwitterMetrics key={`metrics-${refreshKey}`} />
                </div>
                
                {/* Engagement Chart - Larger */}
                <div className="h-[60%]">
                  <TwitterEngagementChart key={`chart-${refreshKey}`} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
