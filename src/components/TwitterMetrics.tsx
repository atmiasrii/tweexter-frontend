
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";

const metricsData = [
  { label: 'Impressions', value: 89100, trend: '+11.2%', description: 'Times your post was seen' },
  { label: 'Engagements', value: 3200, trend: '+8.9%', description: 'Total interactions with your post' },
  { label: 'Likes', value: 2300, trend: '+15.7%', description: 'Times your post was liked' },
  { label: 'Retweets', value: 847, trend: '+12.3%', description: 'Times your post was retweeted' },
];

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const AnimatedMetric = ({ metric, delay }: { metric: typeof metricsData[0], delay: number }) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1500; // 1.5 seconds
      const steps = 60;
      const stepDuration = duration / steps;
      const increment = metric.value / steps;

      let currentStep = 0;
      const counter = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeProgress = 1 - Math.pow(1 - progress, 2); // Ease out
        
        setCurrentValue(Math.round(metric.value * easeProgress));

        if (currentStep >= steps) {
          clearInterval(counter);
          setCurrentValue(metric.value);
        }
      }, stepDuration);

      return () => clearInterval(counter);
    }, delay);

    return () => clearTimeout(timer);
  }, [metric.value, delay]);

  return (
    <div className="border border-gray-800 rounded-2xl p-4 hover:bg-gray-900/30 transition-colors cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-gray-400 font-medium text-sm">{metric.label}</h4>
        <span className="text-xs text-green-400 font-medium bg-green-400/10 px-2 py-1 rounded-full">
          {metric.trend}
        </span>
      </div>
      <div className="mb-2">
        <span className="text-2xl font-bold text-white">
          {formatNumber(currentValue)}
        </span>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">
        {metric.description}
      </p>
    </div>
  );
};

export const TwitterMetrics = () => {
  return (
    <div className="p-4">
      <Card className="bg-black border-gray-800">
        <div className="p-4">
          <h3 className="text-xl font-bold text-white mb-6">Performance Metrics</h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metricsData.map((metric, index) => (
              <AnimatedMetric 
                key={index} 
                metric={metric} 
                delay={index * 200} // Stagger the animations
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
