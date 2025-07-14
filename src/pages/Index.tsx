
import { VersionComparison } from "@/components/VersionComparison";
import { Toolbar } from "@/components/Toolbar";
import { EngagementChart } from "@/components/EngagementChart";
import { StatisticalConfidence } from "@/components/StatisticalConfidence";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 text-white p-4">
      <div className="container mx-auto max-w-6xl bg-gray-900/40 backdrop-blur-sm rounded-xl border-2 border-white/20 p-6 shadow-2xl">
        <VersionComparison />
        <Toolbar />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EngagementChart />
          <StatisticalConfidence />
        </div>
      </div>
    </div>
  );
};

export default Index;
