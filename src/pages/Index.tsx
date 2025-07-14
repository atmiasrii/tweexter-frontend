
import { Header } from "@/components/Header";
import { VersionComparison } from "@/components/VersionComparison";
import { Toolbar } from "@/components/Toolbar";
import { EngagementChart } from "@/components/EngagementChart";
import { StatisticalConfidence } from "@/components/StatisticalConfidence";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Header />
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <VersionComparison />
        <Toolbar />
        <EngagementChart />
        <StatisticalConfidence />
      </div>
    </div>
  );
};

export default Index;
