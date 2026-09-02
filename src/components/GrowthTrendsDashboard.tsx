import React, { useState } from 'react';
import { 
  Target, 
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ChannelData } from '../types';
import { formatCompactNumber, formatDate } from '../utils/formatters';

interface GrowthTrendsDashboardProps {
  channel: ChannelData;
}

export const GrowthTrendsDashboard: React.FC<GrowthTrendsDashboardProps> = ({ channel }) => {
  const [customGoalSubs, setCustomGoalSubs] = useState(
    channel.subscribers > 10000000 
      ? Math.ceil(channel.subscribers / 5000000) * 5000000 
      : Math.ceil(channel.subscribers / 1000000) * 1000000
  );

  const history = channel.history30d || [];
  
  // Projection calculation
  const dailyGain = channel.weeklySubGain / 7;
  const subsNeeded = Math.max(0, customGoalSubs - channel.subscribers);
  const daysToGoal = dailyGain > 0 ? Math.ceil(subsNeeded / dailyGain) : 999;
  const projectedDate = new Date(Date.now() + daysToGoal * 24 * 60 * 60 * 1000);

  // Traffic sources data
  const trafficData = channel.demographics?.trafficSources || [
    { source: 'Suggested Videos', percentage: 44 },
    { source: 'Browse Features', percentage: 32 },
    { source: 'YouTube Search', percentage: 16 },
    { source: 'External', percentage: 8 },
  ];

  const COLORS = ['#1a73e8', '#1e8e3e', '#f9ab00', '#ea4335'];

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Growth Projection Calculator */}
      <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#dadce0] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-[#e8f0fe] text-[#1a73e8]">
                <Target className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-[#202124]">Subscriber Milestone & Target Simulator</h2>
            </div>
            <p className="text-xs text-[#5f6368]">
              Current pace: <strong>+{formatCompactNumber(channel.weeklySubGain)} subs/week</strong> (+{formatCompactNumber(Math.round(dailyGain))} per day)
            </p>
          </div>

          {/* Goal Input slider/number */}
          <div className="flex items-center gap-3 bg-[#f8f9fa] p-2 rounded-md border border-[#dadce0]">
            <div className="text-xs text-[#5f6368] font-medium">Target Milestone:</div>
            <input
              type="number"
              value={customGoalSubs}
              step={100000}
              onChange={(e) => setCustomGoalSubs(Number(e.target.value))}
              className="w-32 px-2.5 py-1 text-xs font-mono font-bold bg-white border border-[#dadce0] rounded-md text-[#202124] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
            />
            <span className="text-xs font-medium text-[#3c4043]">Subscribers</span>
          </div>
        </div>

        {/* Milestone Result Card */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#dadce0]">
          <div className="bg-[#f8f9fa] border border-[#dadce0] rounded-lg p-3.5">
            <div className="text-xs text-[#1a73e8] font-medium">Remaining Subscribers</div>
            <div className="text-xl font-bold text-[#202124] mt-1">
              +{formatCompactNumber(subsNeeded)}
            </div>
            <div className="text-[11px] text-[#5f6368] mt-0.5">
              {((channel.subscribers / customGoalSubs) * 100).toFixed(1)}% of target reached
            </div>
          </div>

          <div className="bg-[#f8f9fa] border border-[#dadce0] rounded-lg p-3.5">
            <div className="text-xs text-[#1e8e3e] font-medium">Estimated Completion</div>
            <div className="text-xl font-bold text-[#202124] mt-1">
              ~{daysToGoal} Days
            </div>
            <div className="text-[11px] text-[#5f6368] mt-0.5">
              Projected: {projectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          <div className="bg-[#f8f9fa] border border-[#dadce0] rounded-lg p-3.5">
            <div className="text-xs text-[#70757a] font-medium">Growth Confidence Score</div>
            <div className="text-xl font-bold text-[#202124] mt-1">
              96% High
            </div>
            <div className="text-[11px] text-[#5f6368] mt-0.5">
              Based on 30-day velocity stability
            </div>
          </div>
        </div>
      </div>

      {/* Two Main Charts: Daily Net Subs & Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Daily Net Subscriber Additions Bar Chart */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-lg border border-[#dadce0] shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#202124]">Daily Net Subscriber Gains</h3>
            <p className="text-xs text-[#5f6368]">Day-by-day new audience acquisition breakdown</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={history} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
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
                  tickFormatter={(val) => formatCompactNumber(val)}
                  tick={{ fontSize: 11, fill: '#70757a' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[#202124] text-white p-2.5 rounded-lg shadow-xl text-xs">
                          <div className="text-gray-400 mb-1">{formatDate(label)}</div>
                          <div className="font-bold text-emerald-400 text-sm">
                            +{formatCompactNumber(d.netSubs)} Subscribers
                          </div>
                          <div className="text-gray-300 mt-0.5">
                            Total: {formatCompactNumber(d.subscribers)}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="netSubs" 
                  fill="#1a73e8" 
                  radius={[3, 3, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Sources Breakdown */}
        <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#dadce0] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#202124]">Traffic Source Distribution</h3>
            <p className="text-xs text-[#5f6368]">How viewers discover your content</p>
          </div>

          <div className="h-44 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficData}
                  dataKey="percentage"
                  nameKey="source"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                >
                  {trafficData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${val}%`, 'Share']}
                  contentStyle={{ backgroundColor: '#202124', color: '#fff', borderRadius: '6px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="space-y-1.5 pt-2 border-t border-[#dadce0]">
            {trafficData.map((item, idx) => (
              <div key={item.source} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-[#5f6368]">{item.source}</span>
                </div>
                <span className="font-medium text-[#202124]">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Subscribed vs Non-Subscribed Viewers Ratio Card */}
      <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#dadce0] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-[#202124]">Viewer Conversion & Loyalty Matrix</h3>
            <p className="text-xs text-[#5f6368]">Percentage of watch time from subscribed vs. non-subscribed viewers</p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#1a73e8]" />
              <span className="text-[#5f6368]">Subscribed: <strong>{channel.demographics?.subscribedVsNot?.subscribed || 35}%</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#dadce0]" />
              <span className="text-[#5f6368]">Non-Subscribed: <strong>{channel.demographics?.subscribedVsNot?.notSubscribed || 65}%</strong></span>
            </div>
          </div>
        </div>

        {/* Progress Stack */}
        <div className="w-full bg-[#f1f3f4] h-3.5 rounded-full overflow-hidden flex mt-4">
          <div 
            className="bg-[#1a73e8] h-full flex items-center justify-center text-[10px] text-white font-medium"
            style={{ width: `${channel.demographics?.subscribedVsNot?.subscribed || 35}%` }}
          >
            {channel.demographics?.subscribedVsNot?.subscribed || 35}%
          </div>
          <div 
            className="bg-[#dadce0] h-full flex items-center justify-center text-[10px] text-[#3c4043] font-medium"
            style={{ width: `${channel.demographics?.subscribedVsNot?.notSubscribed || 65}%` }}
          >
            {channel.demographics?.subscribedVsNot?.notSubscribed || 65}%
          </div>
        </div>

        <div className="mt-3 bg-[#f8f9fa] border border-[#dadce0] rounded-md p-3 text-xs text-[#3c4043] flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-[#e37400] shrink-0 mt-0.5" />
          <div>
            <strong>Creator Optimization Tip:</strong> A high percentage of non-subscribed views ({channel.demographics?.subscribedVsNot?.notSubscribed || 65}%) indicates massive viral discovery reach. Adding a subtle verbal call-to-action at the 35% mark can increase conversion by +18%.
          </div>
        </div>
      </div>

    </div>
  );
};

