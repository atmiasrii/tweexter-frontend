
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
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60; // 60 steps for smooth animation
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

      setAnimatedData(data.map(item => ({
        ...item,
        engagement: Math.round(item.engagement * easeProgress)
      })));

      if (currentStep >= steps) {
        clearInterval(timer);
        setIsAnimating(false);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-4">
      <Card className="bg-black border-gray-800">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Engagement Over Time</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-400">Hourly Engagement</span>
              </div>
            </div>
          </div>
          
          <div className="h-80 w-full bg-gray-900/20 rounded-xl p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={animatedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickMargin={10}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: '#3B82F6', stroke: '#1F2937', strokeWidth: 3 }}
                  filter="drop-shadow(0 0 6px rgba(59, 130, 246, 0.3))"
                  animationDuration={2000}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Peak engagement occurs during evening hours (6-10 PM)
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
