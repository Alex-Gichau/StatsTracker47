import React, { useState } from 'react';
import { 
  Users, 
  Eye, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  Percent, 
  MousePointerClick, 
  ArrowUpRight, 
  Layers,
  Send,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { ChannelData, DashboardFilterState, WeeklyReport } from '../types';
import { formatCompactNumber, formatPercent, formatDate } from '../utils/formatters';

interface OverviewDashboardProps {
  channel: ChannelData;
  filterState: DashboardFilterState;
  onTimeframeChange: (tf: DashboardFilterState['timeframe']) => void;
  onNavigateToReports: () => void;
  onSendDigest: () => void;
  latestReport: WeeklyReport | null;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  channel,
  filterState,
  onTimeframeChange,
  onNavigateToReports,
  onSendDigest,
  latestReport
}) => {
  const [activeChartMetric, setActiveChartMetric] = useState<'views' | 'subscribers' | 'watchTime'>('views');

  // Filter history based on timeframe
  const historyData = channel.history30d || [];
  const displayData = filterState.timeframe === '7d' 
    ? historyData.slice(-7)
    : historyData;

  const metricCards = [
    {
      id: 'subscribers',
      title: 'Total Subscribers',
      value: channel.subscribersFormatted,
      delta: `+${formatCompactNumber(channel.weeklySubGain)} this week`,
      isPositive: true,
      icon: Users,
    },
    {
      id: 'views',
      title: 'Weekly View Velocity',
      value: formatCompactNumber(channel.weeklyViewGain),
      delta: '+14.2% vs last 7d',
      isPositive: true,
      icon: Eye,
    },
    {
      id: 'watchTime',
      title: 'Watch Time (Hours)',
      value: formatCompactNumber(channel.weeklyWatchTimeGain),
      delta: '+9.8% vs last 7d',
      isPositive: true,
      icon: Clock,
    },
    {
      id: 'engagement',
      title: 'Avg. Engagement Rate',
      value: `${channel.avgEngagementRate}%`,
      delta: 'Top 10% in category',
      isPositive: true,
      icon: Percent,
    },
    {
      id: 'ctr',
      title: 'Avg. Click-Through Rate',
      value: `${channel.avgCtr}%`,
      delta: 'Strong curiosity hook',
      isPositive: true,
      icon: MousePointerClick,
    },
    {
      id: 'viewsPerVideo',
      title: 'Avg. Views per Upload',
      value: formatCompactNumber(channel.avgViewsPerVideo),
      delta: 'Evergreen catalog',
      isPositive: true,
      icon: Layers,
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Timeframe & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-[#dadce0] shadow-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#5f6368]" />
          <span className="text-xs font-semibold text-[#5f6368] uppercase tracking-wider">Analytics Range:</span>
          <div className="flex items-center bg-[#f1f3f4] p-0.5 rounded-md text-xs">
            {(['7d', '30d', '90d'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => onTimeframeChange(tf)}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  filterState.timeframe === tf
                    ? 'bg-white text-[#202124] shadow-xs font-medium'
                    : 'text-[#5f6368] hover:text-[#202124]'
                }`}
              >
                {tf === '7d' ? 'Last 7 Days' : tf === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#5f6368]">
          <span className="w-2 h-2 rounded-full bg-[#1e8e3e] inline-block" />
          <span>Sync Status: <strong className="text-[#202124]">Live Telemetry Connected</strong></span>
        </div>
      </div>

      {/* Top 6 KPI Metric Cards matching Sleek Interface */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {metricCards.map((card) => {
          return (
            <div
              key={card.id}
              className="bg-white p-4 sm:p-5 rounded-lg border border-[#dadce0] shadow-xs flex flex-col justify-between"
            >
              <div className="text-xs font-bold text-[#5f6368] uppercase tracking-wider mb-2 truncate">
                {card.title}
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#202124] tracking-tight">
                  {card.value}
                </div>
                <div className="flex items-center gap-1 text-xs text-[#1e8e3e] font-medium mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{card.delta}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Growth Chart Card */}
      <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#dadce0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#202124]">Channel Growth & Daily Trajectory</h2>
            <p className="text-xs text-[#5f6368]">Track daily view velocity, watch time hours, and subscriber acceleration</p>
          </div>

          {/* Metric selector pill */}
          <div className="flex items-center bg-[#f1f3f4] p-0.5 rounded-md text-xs">
            <button
              onClick={() => setActiveChartMetric('views')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                activeChartMetric === 'views'
                  ? 'bg-white text-[#1a73e8] shadow-xs font-semibold'
                  : 'text-[#5f6368] hover:text-[#202124]'
              }`}
            >
              Daily Views
            </button>
            <button
              onClick={() => setActiveChartMetric('subscribers')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                activeChartMetric === 'subscribers'
                  ? 'bg-white text-[#1a73e8] shadow-xs font-semibold'
                  : 'text-[#5f6368] hover:text-[#202124]'
              }`}
            >
              Net Subscribers
            </button>
            <button
              onClick={() => setActiveChartMetric('watchTime')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                activeChartMetric === 'watchTime'
                  ? 'bg-white text-[#1a73e8] shadow-xs font-semibold'
                  : 'text-[#5f6368] hover:text-[#202124]'
              }`}
            >
              Watch Time (Hrs)
            </button>
          </div>
        </div>

        {/* Recharts Area Container */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a73e8" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#1a73e8" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e8e3e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#1e8e3e" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9334ea" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#9334ea" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f4" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(val) => {
                  try {
                    const parts = val.split('-');
                    return `${parts[1]}/${parts[2]}`;
                  } catch {
                    return val;
                  }
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
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#202124] text-white p-3 rounded-lg shadow-xl border border-gray-700 text-xs font-sans">
                        <p className="font-semibold text-gray-300 mb-1">{formatDate(label)}</p>
                        {activeChartMetric === 'views' && (
                          <div className="space-y-1">
                            <p className="text-white font-bold text-sm">
                              {formatCompactNumber(data.views)} Total Views
                            </p>
                            <p className="text-gray-400 text-[11px]">
                              Long-form: {formatCompactNumber(data.longFormViews || data.views * 0.6)} • Shorts: {formatCompactNumber(data.shortsViews || data.views * 0.4)}
                            </p>
                          </div>
                        )}
                        {activeChartMetric === 'subscribers' && (
                          <p className="text-[#81c995] font-bold text-sm">
                            +{formatCompactNumber(data.netSubs)} Net Subscribers
                          </p>
                        )}
                        {activeChartMetric === 'watchTime' && (
                          <p className="text-[#c58af9] font-bold text-sm">
                            {formatCompactNumber(data.watchTimeHours)} Hours Watch Time
                          </p>
                        )}
                        <p className="text-[11px] text-gray-400 mt-1">
                          Engagement Rate: {data.engagementRate}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {activeChartMetric === 'views' && (
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#1a73e8"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#blueGradient)"
                />
              )}
              {activeChartMetric === 'subscribers' && (
                <Area
                  type="monotone"
                  dataKey="netSubs"
                  stroke="#1e8e3e"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#emeraldGradient)"
                />
              )}
              {activeChartMetric === 'watchTime' && (
                <Area
                  type="monotone"
                  dataKey="watchTimeHours"
                  stroke="#9334ea"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#purpleGradient)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Columns: Format Breakdown & Latest Weekly Report Digest Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Content Formats Split */}
        <div className="bg-white p-5 rounded-lg border border-[#dadce0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#202124]">Content Format Performance</h3>
            <span className="text-xs text-[#5f6368]">Last 30 Days</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-[#3c4043]">Long-form Videos (10+ min)</span>
                <span className="font-semibold text-[#202124]">58% of Views</span>
              </div>
              <div className="w-full bg-[#f1f3f4] rounded-full h-2 overflow-hidden">
                <div className="bg-[#1a73e8] h-full rounded-full" style={{ width: '58%' }} />
              </div>
              <p className="text-[11px] text-[#5f6368] mt-1">Drives 84% of total watch hours & ad revenue</p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-[#3c4043]">YouTube Shorts</span>
                <span className="font-semibold text-[#202124]">36% of Views</span>
              </div>
              <div className="w-full bg-[#f1f3f4] rounded-full h-2 overflow-hidden">
                <div className="bg-[#ea4335] h-full rounded-full" style={{ width: '36%' }} />
              </div>
              <p className="text-[11px] text-[#5f6368] mt-1">Top-of-funnel discovery & mobile subscriber growth</p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-[#3c4043]">Live Streams & Premieres</span>
                <span className="font-semibold text-[#202124]">6% of Views</span>
              </div>
              <div className="w-full bg-[#f1f3f4] rounded-full h-2 overflow-hidden">
                <div className="bg-[#e37400] h-full rounded-full" style={{ width: '6%' }} />
              </div>
              <p className="text-[11px] text-[#5f6368] mt-1">High chat engagement & membership retention</p>
            </div>
          </div>
        </div>

        {/* AI Weekly Performance Digest Snapshot */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-lg border border-[#dadce0] shadow-xs flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-[#e8f0fe] text-[#1a73e8]">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-[#1a73e8] uppercase tracking-wider">Weekly Performance Digest</span>
              </div>

              {latestReport && (
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] border border-[#ceead6]">
                  Grade {latestReport.scoreGrade} ({latestReport.performanceScore}/100)
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-[#202124] mb-2">
              {latestReport ? latestReport.emailSubject : `Weekly Performance Summary for ${channel.title}`}
            </h3>

            <p className="text-xs sm:text-sm text-[#5f6368] leading-relaxed">
              {latestReport?.executiveSummary || `${channel.title} saw an acceleration in algorithmic browse recommendations this week with +${formatCompactNumber(channel.weeklySubGain)} new subscribers and ${formatCompactNumber(channel.weeklyViewGain)} views.`}
            </p>
          </div>

          <div className="pt-3 border-t border-[#dadce0] flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-[#5f6368]">
              Automated weekly dispatch: <strong>Mondays at 09:00 UTC</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onNavigateToReports}
                className="px-3.5 py-1.5 text-xs font-medium text-[#3c4043] hover:bg-[#f1f3f4] bg-white border border-[#dadce0] rounded-md transition-colors shadow-xs"
              >
                Inspect Full Report
              </button>
              <button
                onClick={onSendDigest}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-md transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Digest</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

