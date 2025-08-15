
import { Card } from "@/components/ui/card";
import LikesBandChart from "./charts/LikesBandChart";
import { MetricRange } from "@/types/prediction";

export const TwitterEngagementChart = ({ likesRange }: { likesRange?: MetricRange }) => {
  const lowTotal = likesRange?.low ?? 0;
  const highTotal = likesRange?.high ?? 0;

  return (
    <div className="w-full h-full min-h-0">
      <Card className="bg-card border-border h-full shadow-lg rounded-3xl min-h-0">
        <div className="p-6 h-full flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <h3 className="text-xl font-bold text-foreground">Likes timeline</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">Real-time</span>
            </div>
          </div>
          
          <div className="flex-1 bg-accent/20 rounded-2xl p-4 border border-border/30 min-h-0 overflow-hidden">
            <LikesBandChart lowTotal={lowTotal} highTotal={highTotal} />
          </div>
          
          <div className="mt-4 text-center flex-shrink-0">
            <p className="text-xs text-muted-foreground">
              Estimates from a model, not a feed. • Simulated crowd; live behavior varies.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
