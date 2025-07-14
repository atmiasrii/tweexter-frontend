
export const StatisticalConfidence = () => {
  const metrics = [
    { label: 'Likes', percentage: '92.4%', trend: '+12.3%' },
    { label: 'Comments', percentage: '88.7%', trend: '+8.9%' },
    { label: 'Retweets', percentage: '95.2%', trend: '+15.7%' },
    { label: 'Shares', percentage: '89.1%', trend: '+11.2%' },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
      
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-center">
              <h4 className="text-gray-700 font-medium">{metric.label}</h4>
              <span className="text-sm text-green-600 font-medium">{metric.trend}</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-blue-600">
                {metric.percentage}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
