
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";

const data = [
  { time: '12 AM', engagement: 50 },
  { time: '2 AM', engagement: 30 },
  { time: '4 AM', engagement: 25 },
  { time: '6 AM', engagement: 45 },
  { time: '8 AM', engagement: 120 },
  { time: '10 AM', engagement: 180 },
  { time: '12 PM', engagement: 250 },
  { time: '2 PM', engagement: 320 },
  { time: '4 PM', engagement: 380 },
  { time: '6 PM', engagement: 420 },
  { time: '8 PM', engagement: 450 },
  { time: '10 PM', engagement: 470 },
];

export const TwitterEngagementChart = ({ likes, scalingFactor }: { likes?: number; scalingFactor?: number }) => {
  const baseData = data;
  const lastBase = baseData[baseData.length - 1].engagement;
  const likesValue = typeof likes === 'number' ? likes : lastBase;
  const ratio = lastBase > 0 ? likesValue / lastBase : 1;
  const targetData = baseData.map(item => ({
    ...item,
    adjusted: typeof scalingFactor === 'number' ? Math.max(0, Math.round(item.engagement * scalingFactor * ratio)) : undefined,
  }));

  const [animatedData, setAnimatedData] = useState(
    baseData.map(item => ({ ...item, engagement: 0, adjusted: typeof scalingFactor === 'number' ? 0 : undefined })) as any
  );

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setAnimatedData(
        targetData.map(item => {
          const baseVal = baseData.find(d => d.time === item.time)?.engagement || 0;
          return {
            ...item,
            engagement: Math.round(baseVal * ratio * easeProgress),
            adjusted: typeof scalingFactor === 'number'
              ? Math.round(baseVal * scalingFactor * ratio * easeProgress)
              : undefined,
          };
        }) as any
      );

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [scalingFactor, likes]);

  return (
    <div className="w-full h-full">
      <Card className="bg-card border-border h-full shadow-lg rounded-3xl">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground">Likes timeline</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">Real-time</span>
            </div>
          </div>
          
          <div className="flex-1 bg-accent/20 rounded-2xl p-4 border border-border/30">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={animatedData as any} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  tickMargin={8}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  tickMargin={8}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    color: 'hsl(var(--card-foreground))',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--muted-foreground))', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, fill: 'hsl(var(--muted-foreground))', stroke: 'hsl(var(--background))', strokeWidth: 3 }}
                  name="Likes"
                />
                {typeof scalingFactor === 'number' && (
                  <Line 
                    type="monotone" 
                    dataKey="adjusted" 
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 3 }}
                    name="Followers-adjusted"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Peak activity: 6-10 PM • Avg response time: 2.3min
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
