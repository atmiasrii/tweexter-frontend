
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

export const TwitterEngagementChart = () => {
  const [animatedData, setAnimatedData] = useState(data.map(item => ({ ...item, engagement: 0 })));

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setAnimatedData(data.map(item => ({
        ...item,
        engagement: Math.round(item.engagement * easeProgress)
      })));

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full">
      <Card className="bg-black border-gray-800 h-full">
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Real-time Engagement</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-400">Live Data</span>
            </div>
          </div>
          
          <div className="flex-1 bg-gray-900/20 rounded-xl p-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={animatedData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 10 }}
                  tickMargin={5}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 10 }}
                  tickMargin={5}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB',
                    fontSize: '12px'
                  }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 1, r: 3 }}
                  activeDot={{ r: 5, fill: '#3B82F6', stroke: '#1F2937', strokeWidth: 2 }}
                  filter="drop-shadow(0 0 4px rgba(59, 130, 246, 0.3))"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-500">
              Peak activity: 6-10 PM • Avg response time: 2.3min
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
