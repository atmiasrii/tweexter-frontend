
export const StatisticalConfidence = () => {
  const metrics = [
    { label: 'Likes', percentageA: '100.0%', percentageB: null, winner: 'A' },
    { label: 'Comments', percentageA: '100.0%', percentageB: null, winner: 'A' },
    { label: 'Retweets', percentageA: '100.0%', percentageB: null, winner: 'A' },
    { label: 'Quotes', percentageA: null, percentageB: '94.4%', winner: 'B' },
  ];

  return (
    <div>
      <h3 className="text-2xl font-bold text-white mb-6">Statistical Confidence</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4">
            <h4 className="text-gray-400 text-sm mb-2">{metric.label}</h4>
            <div className="flex flex-col space-y-1">
              {metric.percentageA && (
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-white">{metric.percentageA}</span>
                  <span className="text-xs text-blue-400 font-medium">VER. A</span>
                </div>
              )}
              {metric.percentageB && (
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-white">{metric.percentageB}</span>
                  <span className="text-xs text-green-400 font-medium">VER. B</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
