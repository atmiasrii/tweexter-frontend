import React from "react";
import { Card } from "@/components/ui/card";
import RangeStat from "@/components/RangeStat";
import { Ranges } from "@/types/prediction";

export const TwitterMetrics = ({ ranges, winnerRanges }: { ranges?: Ranges; winnerRanges?: Ranges }) => {
  // Use winner stats if available, otherwise fall back to regular ranges
  const displayRanges = winnerRanges || ranges;
  return (
    <div className="w-full h-full">
      <Card className="bg-card border-border shadow-lg rounded-3xl w-full">
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-foreground">
              {winnerRanges ? "Winner performance" : "Post performance"}
            </h3>
          </div>
          
          <div className="grid grid-cols-3 gap-4 w-full">
            <RangeStat label="Likes" range={displayRanges?.likes} />
            <RangeStat label="Retweets" range={displayRanges?.replies} />
            <RangeStat label="Replies" range={displayRanges?.retweets} />
          </div>
        </div>
      </Card>
    </div>
  );
};