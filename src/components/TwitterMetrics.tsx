
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";

const metricsData = [
  { label: 'Impressions', value: 89100, trend: '+11.2%', description: 'Times your post was seen' },
  { label: 'Engagements', value: 3200, trend: '+8.9%', description: 'Total interactions' },
  { label: 'Engagement rate', value: 2.3, trend: '+15.7%', description: 'Engagements ÷ impressions' },
  { label: 'Profile visits', value: 847, trend: '+12.3%', description: 'Visits to your profile' },
];

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  if (num < 10) {
    return num.toFixed(1) + '%';
  }
  return num.toString();
};

const AnimatedMetric = ({ metric, delay }: { metric: typeof metricsData[0], delay: number }) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1500;
      const steps = 60;
      const stepDuration = duration / steps;
      const increment = metric.value / steps;

      let currentStep = 0;
      const counter = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeProgress = 1 - Math.pow(1 - progress, 2);
        
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
    <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 hover:bg-gray-900/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:border-gray-600/50">
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-gray-300 font-medium text-sm">{metric.label}</h4>
        <span className="text-xs text-green-400 font-semibold bg-green-400/15 px-2 py-1 rounded-full border border-green-400/20">
          {metric.trend}
        </span>
      </div>
      <div className="mb-2">
        <span className="text-2xl font-bold text-white tracking-tight">
          {formatNumber(currentValue)}
        </span>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed">
        {metric.description}
      </p>
    </div>
  );
};

export const TwitterMetrics = () => {
  return (
    <div className="w-full h-full">
      <Card className="bg-black/50 backdrop-blur-xl border-gray-700/50 h-full shadow-2xl shadow-black/20 rounded-3xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Post performance</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">Live</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metricsData.map((metric, index) => (
              <AnimatedMetric 
                key={index} 
                metric={metric} 
                delay={index * 200}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
