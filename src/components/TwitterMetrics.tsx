
export const TwitterMetrics = () => {
  const metrics = [
    { label: 'Impressions', value: '89.1K', trend: '+11.2%', description: 'Times your post was seen' },
    { label: 'Engagements', value: '3.2K', trend: '+8.9%', description: 'Total interactions with your post' },
    { label: 'Likes', value: '2.3K', trend: '+15.7%', description: 'Times your post was liked' },
    { label: 'Retweets', value: '847', trend: '+12.3%', description: 'Times your post was retweeted' },
  ];

  return (
    <div className="bg-black text-white border-b border-gray-800">
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-6">Performance Metrics</h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="border border-gray-800 rounded-2xl p-4 hover:bg-gray-900/30 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-gray-400 font-medium text-sm">{metric.label}</h4>
                <span className="text-xs text-green-400 font-medium bg-green-400/10 px-2 py-1 rounded-full">
                  {metric.trend}
                </span>
              </div>
              <div className="mb-2">
                <span className="text-2xl font-bold text-white">
                  {metric.value}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                {metric.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
