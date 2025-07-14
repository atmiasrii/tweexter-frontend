
export const StatisticalConfidence = () => {
  const metrics = [
    { label: 'Likes', percentage: '92.4%', trend: '+12.3%' },
    { label: 'Comments', percentage: '88.7%', trend: '+8.9%' },
    { label: 'Retweets', percentage: '95.2%', trend: '+15.7%' },
    { label: 'Shares', percentage: '89.1%', trend: '+11.2%' },
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4">Performance Metrics</h3>
      
      <div className="space-y-3">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-700/30 rounded-lg p-3 border border-white/5">
            <div className="flex justify-between items-center">
              <h4 className="text-gray-300 text-sm">{metric.label}</h4>
              <span className="text-xs text-green-400 font-medium">{metric.trend}</span>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {metric.percentage}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
