
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';

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
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Cumulative Engagement</h3>
      
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-3 h-3 bg-blue-600 rounded"></div>
        <span className="text-sm text-gray-600">Version A</span>
      </div>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Line 
              type="monotone" 
              dataKey="engagement" 
              stroke="#2563EB"
              strokeWidth={3}
              dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#2563EB', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
