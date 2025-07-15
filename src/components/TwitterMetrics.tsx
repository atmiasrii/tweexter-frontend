
export const TwitterMetrics = () => {
  const metrics = [
    { label: 'Likes', value: '12.3K', trend: '+15.7%' },
    { label: 'Retweets', value: '3.2K', trend: '+8.9%' },
    { label: 'Replies', value: '847', trend: '+12.3%' },
    { label: 'Views', value: '89.1K', trend: '+11.2%' },
  ];

  return (
    <div className="bg-black text-white p-4">
      <h3 className="text-xl font-bold text-white mb-4">Performance Metrics</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="border border-gray-800 rounded-2xl p-4 hover:bg-gray-900/50 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-gray-400 font-medium text-sm">{metric.label}</h4>
              <span className="text-sm text-green-400 font-medium">{metric.trend}</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">
                {metric.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
