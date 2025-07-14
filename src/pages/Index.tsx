
import { VersionComparison } from "@/components/VersionComparison";
import { Toolbar } from "@/components/Toolbar";
import { EngagementChart } from "@/components/EngagementChart";
import { StatisticalConfidence } from "@/components/StatisticalConfidence";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <VersionComparison />
          <Toolbar />
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EngagementChart />
              <StatisticalConfidence />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
