
export const StatisticalConfidence = () => {
  const metrics = [
    { label: 'Likes', percentage: '92.4%', trend: '+12.3%' },
    { label: 'Comments', percentage: '88.7%', trend: '+8.9%' },
    { label: 'Retweets', percentage: '95.2%', trend: '+15.7%' },
    { label: 'Shares', percentage: '89.1%', trend: '+11.2%' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance Metrics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-gray-700 font-medium">{metric.label}</h4>
              <span className="text-sm text-green-600 font-medium">{metric.trend}</span>
            </div>
            <div>
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
