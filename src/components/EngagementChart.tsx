
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const data = [
  { time: 0, engagement: 50 },
  { time: 100, engagement: 80 },
  { time: 200, engagement: 120 },
  { time: 300, engagement: 180 },
  { time: 400, engagement: 250 },
  { time: 500, engagement: 320 },
  { time: 600, engagement: 380 },
  { time: 700, engagement: 420 },
  { time: 800, engagement: 450 },
  { time: 900, engagement: 470 },
  { time: 1000, engagement: 480 },
];

export const EngagementChart = () => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4">Cumulative Engagement</h3>
      
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-400 rounded"></div>
        <span className="text-sm text-gray-300">Version A</span>
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
            />
            <Line 
              type="monotone" 
              dataKey="engagement" 
              stroke="url(#gradient)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 4, fill: '#22D3EE' }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22D3EE" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
