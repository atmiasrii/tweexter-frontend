import React from "react";
import { Card } from "@/components/ui/card";
import RangeStat from "@/components/RangeStat";
import { Ranges } from "@/types/prediction";

export const TwitterMetrics = ({ ranges }: { ranges?: Ranges }) => {
  return (
    <div className="w-full h-full">
      <Card className="bg-card border-border shadow-lg rounded-3xl w-full">
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-foreground">Post performance</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-4 w-full">
            <RangeStat label="Likes" range={ranges?.likes} />
            <RangeStat label="Retweets" range={ranges?.retweets} />
            <RangeStat label="Replies" range={ranges?.replies} />
          </div>
        </div>
      </Card>
    </div>
  );
};