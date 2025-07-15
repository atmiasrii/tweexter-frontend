
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";

const metricsData = [
  { label: 'Reach', value: 89100, trend: '+11.2%', description: 'Total unique viewers' },
  { label: 'Engagement', value: 3200, trend: '+8.9%', description: 'Interactions per post' },
  { label: 'CTR', value: 2.3, trend: '+15.7%', description: 'Click-through rate %' },
  { label: 'Conversions', value: 847, trend: '+12.3%', description: 'Actions taken' },
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
    <div className="border border-gray-800 rounded-xl p-3 hover:bg-gray-900/30 transition-colors cursor-pointer">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-gray-400 font-medium text-xs">{metric.label}</h4>
        <span className="text-xs text-green-400 font-medium bg-green-400/10 px-1.5 py-0.5 rounded-full">
          {metric.trend}
        </span>
      </div>
      <div className="mb-1">
        <span className="text-xl font-bold text-white">
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
    <div className="w-full h-full">
      <Card className="bg-black border-gray-800 h-full">
        <div className="p-4">
          <h3 className="text-lg font-bold text-white mb-4">Analytics Dashboard</h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
