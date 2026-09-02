import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Sparkles, 
  Mail, 
  Video, 
  Clock, 
  Plus, 
  Scale, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ChannelData, DashboardFilterState } from '../types';

interface SidebarProps {
  channels: ChannelData[];
  activeChannel?: ChannelData | null;
  onSelectChannel: (channel: ChannelData) => void;
  onOpenAddModal: () => void;
  onOpenCompareModal: () => void;
  activeTab: DashboardFilterState['activeTab'];
  onTabChange: (tab: DashboardFilterState['activeTab']) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  channels,
  activeChannel,
  onSelectChannel,
  onOpenAddModal,
  onOpenCompareModal,
  activeTab,
  onTabChange,
}) => {
  const navItems: { id: DashboardFilterState['activeTab']; label: string; icon: string; LucideIcon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: '📊', LucideIcon: BarChart3 },
    { id: 'growth', label: 'Growth Trends', icon: '📈', LucideIcon: TrendingUp },
    { id: 'engagement', label: 'Engagement & Retention', icon: '✨', LucideIcon: Sparkles },
    { id: 'reports', label: 'Weekly AI Reports', icon: '✉️', LucideIcon: Mail },
    { id: 'videos', label: 'Video Scorecards', icon: '🎬', LucideIcon: Video },
    { id: 'meet', label: 'Google Meet Telemetry', icon: '📹', LucideIcon: Video },
    { id: 'schedule', label: 'Email Digest Preferences', icon: '⏱️', LucideIcon: Clock },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#dadce0] p-4 flex flex-col justify-between shrink-0 select-none overflow-y-auto">
      <div className="space-y-6">
        
        {/* Navigation Section */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.LucideIcon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-[calc(100%+16px)] px-4 py-2.5 rounded-r-full -ml-4 flex items-center text-sm transition-colors text-left ${
                  isActive
                    ? 'bg-[#e8f0fe] text-[#1a73e8] font-medium'
                    : 'text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#202124]'
                }`}
              >
                <Icon className={`w-4 h-4 mr-3 shrink-0 ${isActive ? 'text-[#1a73e8]' : 'text-[#5f6368]'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Tracked Channels / Subscriptions list */}
        <div className="pt-2">
          <div className="flex items-center justify-between px-2 pb-2">
            <span className="text-[11px] font-bold text-[#70757a] uppercase tracking-wider">
              Tracked Channels
            </span>
            <button
              onClick={onOpenAddModal}
              className="text-[#1a73e8] hover:text-[#1557b0] p-1 rounded-md hover:bg-[#e8f0fe] transition-colors"
              title="Track new channel URL"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5">
            {channels.length === 0 ? (
              <div className="px-2 py-3 text-center bg-[#f8f9fa] rounded-lg border border-[#dadce0] my-1">
                <p className="text-[11px] text-[#5f6368]">No channels tracked</p>
                <button
                  onClick={onOpenAddModal}
                  className="mt-1 text-xs text-[#1a73e8] font-medium hover:underline"
                >
                  + Ingest URL
                </button>
              </div>
            ) : (
              channels.map((ch, idx) => {
                const isSelected = activeChannel && ch.id === activeChannel.id;
                const dotColors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500'];
                const dotColor = dotColors[idx % dotColors.length];

                return (
                  <button
                    key={ch.id}
                    onClick={() => onSelectChannel(ch)}
                    className={`w-[calc(100%+16px)] px-4 py-2 rounded-r-full -ml-4 flex items-center justify-between text-xs transition-colors text-left group ${
                      isSelected
                        ? 'bg-[#f1f3f4] text-[#202124] font-medium'
                        : 'text-[#5f6368] hover:bg-[#f8f9fa] hover:text-[#202124]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
                      <span className="truncate font-medium">{ch.title}</span>
                    </div>
                    <span className="text-[10px] text-[#70757a] font-mono shrink-0 ml-1">
                      {ch.subscribersFormatted}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          <button
            onClick={onOpenAddModal}
            className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-[#1a73e8] hover:bg-[#e8f0fe] rounded-lg font-medium border border-dashed border-[#1a73e8]/30 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Track New Channel</span>
          </button>
        </div>

      </div>

      {/* Sidebar Footer Controls */}
      <div className="pt-4 border-t border-[#dadce0] space-y-2">
        <button
          onClick={onOpenCompareModal}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-[#3c4043] hover:bg-[#f1f3f4] rounded-lg border border-[#dadce0] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Scale className="w-3.5 h-3.5 text-[#5f6368]" />
            <span>Compare Channels</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#5f6368]" />
        </button>

        <div className="px-1 py-1 text-[11px] text-[#70757a] flex items-center justify-between">
          <span>Telemetry Active</span>
          <span className="inline-flex items-center gap-1 text-[#1e8e3e] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1e8e3e] animate-pulse" />
            Live
          </span>
        </div>
      </div>
    </aside>
  );
};
