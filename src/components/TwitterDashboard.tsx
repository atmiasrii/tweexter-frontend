
import { TwitterCompose } from "@/components/TwitterCompose";
import { TwitterEngagementChart } from "@/components/TwitterEngagementChart";
import { TwitterMetrics } from "@/components/TwitterMetrics";

interface TwitterDashboardProps {
  hasPosted?: boolean;
}

export const TwitterDashboard = ({ hasPosted = false }: TwitterDashboardProps) => {
  return (
    <div className="min-h-screen bg-black animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 py-6">
          {/* Left side - Performance Metrics and Chart */}
          <div className="w-full lg:w-1/2 xl:w-3/5 space-y-6">
            {/* Performance Metrics */}
            <TwitterMetrics />
            
            {/* Engagement Chart */}
            <TwitterEngagementChart />
          </div>
          
          {/* Right side - Twitter Compose */}
          <div className="w-full lg:w-1/2 xl:w-2/5">
            <div className="lg:sticky lg:top-6">
              <TwitterCompose hasPosted={hasPosted} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
