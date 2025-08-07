
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";

const metricsData = [
  { label: 'Likes', value: 56, trend: '+12.5%' },
  { label: 'Retweets', value: 4, trend: '+25.0%' },
  { label: 'Replies', value: 17, trend: '+8.3%' },
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
    <div className="bg-card border-border rounded-xl p-3 hover:bg-accent/50 transition-all duration-300 hover:shadow-md hover:border-border/70">
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-muted-foreground font-medium text-sm">{metric.label}</h4>
        <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full border border-green-200">
          {metric.trend}
        </span>
      </div>
      <div>
        <span className="text-2xl font-bold text-foreground tracking-tight">
          {formatNumber(currentValue)}
        </span>
      </div>
    </div>
  );
};

export const TwitterMetrics = () => {
  return (
    <div className="w-full h-full">
      <Card className="bg-card border-border h-full shadow-lg rounded-3xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground">Post performance</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 w-full">
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
