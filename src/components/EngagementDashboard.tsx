import React from 'react';
import { 
  Sparkles, 
  Clock, 
  Heart, 
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid
} from 'recharts';
import { ChannelData } from '../types';
import { formatDate, formatCompactNumber } from '../utils/formatters';

interface EngagementDashboardProps {
  channel: ChannelData;
}

export const EngagementDashboard: React.FC<EngagementDashboardProps> = ({ channel }) => {
  const history = channel.history30d || [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = [12, 14, 16, 17, 18, 20];

  const getHeatmapColor = (day: string, hour: number) => {
    const found = channel.uploadHeatmap?.find(h => h.day === day && Math.abs(h.hour - hour) <= 1);
    const score = found ? found.score : 50 + Math.floor(Math.random() * 30);
    
    if (score >= 90) return 'bg-[#1a73e8] text-white font-medium'; // Peak
    if (score >= 80) return 'bg-[#8ab4f8] text-[#202124] font-medium';
    if (score >= 70) return 'bg-[#d2e3fc] text-[#174ea6]';
    return 'bg-[#f1f3f4] text-[#5f6368]';
  };

  const demographics = channel.demographics || {
    topCountries: [
      { country: 'United States', percentage: 40 },
      { country: 'United Kingdom', percentage: 14 },
      { country: 'Canada', percentage: 10 },
      { country: 'India', percentage: 12 },
      { country: 'Germany', percentage: 8 }
    ],
    ageGroups: [
      { range: '18-24', percentage: 32 },
      { range: '25-34', percentage: 44 },
      { range: '35-44', percentage: 16 },
      { range: '45+', percentage: 8 }
    ],
    gender: { male: 74, female: 23, other: 3 }
  };

  return (
    <div className="space-y-6">
      
      {/* Top 3 Engagement Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-lg border border-[#dadce0] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5f6368] uppercase tracking-wider">Average Engagement</span>
            <div className="p-1.5 rounded-md bg-[#fce8e6] text-[#ea4335]">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#202124] mt-2">
            {channel.avgEngagementRate}%
          </div>
          <div className="text-xs text-[#1e8e3e] font-medium mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+1.4% above niche benchmark</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-lg border border-[#dadce0] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5f6368] uppercase tracking-wider">Estimated CTR</span>
            <div className="p-1.5 rounded-md bg-[#e8f0fe] text-[#1a73e8]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#202124] mt-2">
            {channel.avgCtr}%
          </div>
          <div className="text-xs text-[#1a73e8] font-medium mt-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Top tier packaging efficiency</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-lg border border-[#dadce0] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5f6368] uppercase tracking-wider">Optimal Upload Window</span>
            <div className="p-1.5 rounded-md bg-[#fef7e0] text-[#f29900]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#202124] mt-2">
            Thu & Fri 16:00
          </div>
          <div className="text-xs text-[#5f6368] mt-1">
            UTC Concurrency peak (96/100 score)
          </div>
        </div>
      </div>

      {/* Upload Timing Heatmap */}
      <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#dadce0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#202124]">Viewer Activity & Optimal Upload Schedule</h3>
            <p className="text-xs text-[#5f6368]">Peak viewer concurrency heatmap (when your audience is on YouTube)</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#5f6368]">
            <span>Low Activity</span>
            <div className="flex gap-1">
              <span className="w-3 h-3 rounded-xs bg-[#f1f3f4] border border-[#dadce0]" />
              <span className="w-3 h-3 rounded-xs bg-[#d2e3fc]" />
              <span className="w-3 h-3 rounded-xs bg-[#8ab4f8]" />
              <span className="w-3 h-3 rounded-xs bg-[#1a73e8]" />
            </div>
            <span>Peak Activity</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-center border-collapse min-w-[500px]">
            <thead>
              <tr>
                <th className="p-2 text-left text-[#5f6368] font-medium w-16">Day</th>
                {hours.map(h => (
                  <th key={h} className="p-2 text-[#5f6368] font-medium">
                    {h}:00 UTC
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map(day => (
                <tr key={day} className="border-t border-[#dadce0]">
                  <td className="p-2 text-left font-medium text-[#202124]">{day}</td>
                  {hours.map(hour => {
                    const cellClass = getHeatmapColor(day, hour);
                    return (
                      <td key={hour} className="p-1.5">
                        <div className={`h-8 rounded-md flex items-center justify-center text-[11px] transition-colors cursor-pointer shadow-xs ${cellClass}`}>
                          {cellClass.includes('font-medium') && cellClass.includes('text-white') ? '96' : cellClass.includes('font-medium') ? '84' : '72'}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Engagement Rate Timeline */}
      <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#dadce0] shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#202124]">30-Day Engagement Rate Dynamics</h3>
          <p className="text-xs text-[#5f6368]">Interaction percentage (Likes + Comments / Views)</p>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f4" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(val) => {
                  const p = val.split('-');
                  return `${p[1]}/${p[2]}`;
                }}
                tick={{ fontSize: 11, fill: '#70757a' }}
                axisLine={{ stroke: '#dadce0' }}
                tickLine={false}
              />
              <YAxis 
                domain={['dataMin - 1', 'dataMax + 1']}
                tickFormatter={(val) => `${val}%`}
                tick={{ fontSize: 11, fill: '#70757a' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-[#202124] text-white p-2.5 rounded-lg text-xs shadow-lg">
                        <div className="text-gray-400 mb-1">{formatDate(label)}</div>
                        <div className="font-bold text-blue-400 text-sm">{d.engagementRate}% Engagement Rate</div>
                        <div className="text-gray-300 mt-0.5">{formatCompactNumber(d.views)} Views</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="engagementRate" 
                stroke="#1a73e8" 
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#1a73e8' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Audience Demographics: Age & Geography */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Age distribution */}
        <div className="bg-white p-5 rounded-lg border border-[#dadce0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#202124]">Audience Age Distribution</h3>
            <span className="text-xs text-[#5f6368]">Core: 18-34 (76%)</span>
          </div>

          <div className="space-y-3">
            {demographics.ageGroups.map(ag => (
              <div key={ag.range} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-[#3c4043]">{ag.range} years</span>
                  <span className="font-bold text-[#202124]">{ag.percentage}%</span>
                </div>
                <div className="w-full bg-[#f1f3f4] rounded-full h-2 overflow-hidden">
                  <div className="bg-[#1a73e8] h-full rounded-full" style={{ width: `${ag.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Geography */}
        <div className="bg-white p-5 rounded-lg border border-[#dadce0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#202124]">Top Geographic Viewers</h3>
            <span className="text-xs text-[#5f6368]">Global reach</span>
          </div>

          <div className="space-y-2.5">
            {demographics.topCountries.map((c, idx) => (
              <div key={c.country} className="flex items-center justify-between p-2 rounded-md bg-[#f8f9fa] border border-[#dadce0] text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#e8f0fe] text-[#1a73e8] font-bold flex items-center justify-center text-[10px]">
                    #{idx + 1}
                  </span>
                  <span className="font-medium text-[#202124]">{c.country}</span>
                </div>
                <span className="font-mono font-bold text-[#3c4043]">{c.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

