
import { TwitterCompose } from "@/components/TwitterCompose";
import { TwitterEngagementChart } from "@/components/TwitterEngagementChart";
import { TwitterMetrics } from "@/components/TwitterMetrics";

export const TwitterDashboard = () => {
  return (
    <div className="min-h-screen bg-black animate-fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Twitter-style compose card */}
        <div className="border-b border-gray-800">
          <TwitterCompose />
        </div>
        
        {/* Performance Metrics */}
        <div className="border-b border-gray-800">
          <TwitterMetrics />
        </div>
        
        {/* Engagement Chart */}
        <div>
          <TwitterEngagementChart />
        </div>
      </div>
    </div>
  );
};
