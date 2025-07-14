
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { time: 0, versionA: 50, versionB: 30 },
  { time: 100, versionA: 80, versionB: 60 },
  { time: 200, versionA: 120, versionB: 100 },
  { time: 300, versionA: 180, versionB: 150 },
  { time: 400, versionA: 250, versionB: 220 },
  { time: 500, versionA: 320, versionB: 300 },
  { time: 600, versionA: 380, versionB: 360 },
  { time: 700, versionA: 420, versionB: 410 },
  { time: 800, versionA: 450, versionB: 440 },
  { time: 900, versionA: 470, versionB: 465 },
  { time: 1000, versionA: 480, versionB: 480 },
];

export const EngagementChart = () => {
  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-white mb-6">Cumulative Engagement</h3>
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
        <div className="flex items-center space-x-6 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded"></div>
            <span className="text-sm text-gray-300">Version A</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <span className="text-sm text-gray-300">Version B</span>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                label={{ value: 'Hours Elapsed', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                label={{ value: 'Cumulative Engagement', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
              />
              <Line 
                type="monotone" 
                dataKey="versionA" 
                stroke="#60A5FA" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#60A5FA' }}
              />
              <Line 
                type="monotone" 
                dataKey="versionB" 
                stroke="#4ADE80" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#4ADE80' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
