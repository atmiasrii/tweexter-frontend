
import { VersionComparison } from "@/components/VersionComparison";
import { Toolbar } from "@/components/Toolbar";
import { EngagementChart } from "@/components/EngagementChart";
import { StatisticalConfidence } from "@/components/StatisticalConfidence";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        {/* LinkedIn-style Post Input Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
          <VersionComparison />
          <Toolbar />
        </div>
        
        {/* Performance Metrics */}
        <div className="mb-6">
          <StatisticalConfidence />
        </div>
        
        {/* Full-width Engagement Chart */}
        <div className="w-full">
          <EngagementChart />
        </div>
      </div>
    </div>
  );
};

export default Index;
