
import { TwitterCompose } from "@/components/TwitterCompose";
import { TwitterEngagementChart } from "@/components/TwitterEngagementChart";
import { TwitterMetrics } from "@/components/TwitterMetrics";

interface TwitterDashboardProps {
  hasPosted?: boolean;
}

export const TwitterDashboard = ({ hasPosted = false }: TwitterDashboardProps) => {
  return (
    <div className="min-h-screen bg-black animate-fade-in">
      <div className="max-w-6xl mx-auto flex">
        {/* Left side - Performance Metrics and Chart */}
        <div className="flex-1 max-w-2xl">
          {/* Performance Metrics */}
          <TwitterMetrics />
          
          {/* Engagement Chart */}
          <TwitterEngagementChart />
        </div>
        
        {/* Right side - Twitter Compose */}
        <div className="flex-1 max-w-2xl">
          <TwitterCompose hasPosted={hasPosted} />
        </div>
      </div>
    </div>
  );
};
