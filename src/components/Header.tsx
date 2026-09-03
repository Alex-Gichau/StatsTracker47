import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Mail, 
  Video, 
  Clock, 
  Scale, 
  Send, 
  Sparkles,
  ChevronDown,
  Search,
  Check,
  Plus,
  Menu,
  X,
  Key,
  Radio,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { ChannelData, DashboardFilterState, ApiKeysState } from '../types';

interface HeaderProps {
  channels: ChannelData[];
  activeChannel?: ChannelData | null;
  onSelectChannel: (channel: ChannelData) => void;
  onOpenAddModal: () => void;
  onOpenSendDigestModal: () => void;
  onOpenCompareModal: () => void;
  onOpenKeysModal: () => void;
  onSyncAllChannels?: () => void;
  isSyncingChannels?: boolean;
  apiState: ApiKeysState;
  filterState: DashboardFilterState;
  onTabChange: (tab: DashboardFilterState['activeTab']) => void;
  userEmail?: string;
  isMobileSidebarOpen?: boolean;
  onToggleMobileSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  channels,
  activeChannel,
  onSelectChannel,
  onOpenAddModal,
  onOpenSendDigestModal,
  onOpenCompareModal,
  onOpenKeysModal,
  onSyncAllChannels,
  isSyncingChannels = false,
  apiState,
  filterState,
  onTabChange,
  userEmail = 'creator@gmail.com',
  isMobileSidebarOpen,
  onToggleMobileSidebar,
  isSidebarCollapsed = false,
  onToggleCollapse,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const tabs: { id: DashboardFilterState['activeTab']; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3 },
    { id: 'growth', label: 'Growth Trends', icon: TrendingUp },
    { id: 'engagement', label: 'Engagement & Retention', icon: Sparkles },
    { id: 'reports', label: 'Weekly Reports', icon: Mail },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'meet', label: 'Meet Telemetry', icon: Video },
    { id: 'schedule', label: 'Email Digest', icon: Clock },
  ];

  // User initials
  const initials = userEmail ? userEmail.slice(0, 2).toUpperCase() : 'ST';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#dadce0] px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: Brand Logo & Sidenav Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          
          {/* Sidenav Hamburger Toggle: Mobile opens drawer, Desktop toggles collapse */}
          <button
            onClick={() => {
              if (window.innerWidth < 768) {
                onToggleMobileSidebar?.();
              } else {
                onToggleCollapse?.();
              }
            }}
            className="p-1.5 text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] rounded-lg transition-colors cursor-pointer"
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center text-[#1a73e8] font-bold text-lg sm:text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center mr-2 shadow-2xs">
              <span className="font-mono text-xs font-black">47</span>
            </div>
            <span className="text-[#202124]">StatsTracker</span>
            <span className="text-[#1a73e8]">47</span>
          </div>

          {/* Active channel indicator chip on medium screens */}
          {activeChannel && (
            <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-[#dadce0] text-xs text-[#5f6368]">
              <img src={activeChannel.avatarUrl} alt={activeChannel.title} className="w-5 h-5 rounded-full object-cover border border-[#dadce0]" />
              <span className="font-medium text-[#202124] max-w-[120px] truncate">{activeChannel.title}</span>
            </div>
          )}
        </div>

        {/* Center: Sleek Google Search Bar */}
        <div className="relative flex-1 max-w-[440px] hidden md:block">
          <button
            onClick={onOpenAddModal}
            className="w-full flex items-center justify-between px-4 py-2 bg-[#f1f3f4] hover:bg-[#e8eaed] rounded-full border-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-sm outline-none text-[#5f6368] text-left group"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <Search className="w-4 h-4 text-[#5f6368] shrink-0" />
              <span className="truncate text-xs sm:text-sm text-[#5f6368] group-hover:text-[#202124]">
                Paste YouTube Channel URL... (e.g. @mkbhd)
              </span>
            </div>
            <span className="text-xs bg-white text-[#1a73e8] font-medium px-2.5 py-0.5 rounded-full border border-[#dadce0] shadow-xs shrink-0">
              + Ingest
            </span>
          </button>
        </div>

        {/* Right: Actions, API Key Config, Channel Switcher, Avatar */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Mobile search trigger */}
          <button
            onClick={onOpenAddModal}
            className="md:hidden p-2 text-[#5f6368] hover:bg-[#f1f3f4] rounded-full"
            title="Track channel URL"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* API Keys Configuration Trigger */}
          <button
            onClick={onOpenKeysModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all shadow-2xs ${
              apiState.youtubeAnalyticsConnected 
                ? 'bg-[#e6f4ea] text-[#137333] border-[#ceead6] hover:bg-[#ceead6]' 
                : 'bg-white text-[#3c4043] border-[#dadce0] hover:bg-[#f8f9fa]'
            }`}
            title="Configure YouTube Analytics & Google Meet API Keys"
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {apiState.youtubeAnalyticsConnected ? 'Analytics Connected' : 'Analytics API'}
            </span>
            {apiState.youtubeAnalyticsConnected && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#137333] animate-pulse" />
            )}
          </button>

          {/* Compare Button */}
          <button
            onClick={onOpenCompareModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#202124] rounded-lg transition-colors border border-[#dadce0]"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Compare</span>
          </button>

          {/* Sync All Channels Button */}
          {onSyncAllChannels && (
            <button
              onClick={onSyncAllChannels}
              disabled={isSyncingChannels}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border border-[#dadce0] ${
                isSyncingChannels
                  ? 'bg-[#f1f3f4] text-[#80868b] cursor-wait'
                  : 'bg-white text-[#3c4043] hover:bg-[#f8f9fa] hover:text-[#202124]'
              }`}
              title="Fetch and reload latest telemetry for all added channels"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingChannels ? 'animate-spin text-[#1a73e8]' : 'text-[#5f6368]'}`} />
              <span>{isSyncingChannels ? 'Syncing...' : 'Sync All'}</span>
            </button>
          )}

          {/* Channel Switcher Dropdown */}
          <div className="relative">
            {activeChannel ? (
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#3c4043] bg-white hover:bg-[#f8f9fa] border border-[#dadce0] rounded-lg transition-all shadow-2xs"
              >
                <img
                  src={activeChannel.avatarUrl}
                  alt={activeChannel.title}
                  className="w-4 h-4 rounded-full object-cover border border-[#dadce0]"
                />
                <span className="max-w-[90px] sm:max-w-[130px] truncate">{activeChannel.title}</span>
                <ChevronDown className="w-3 h-3 text-[#5f6368]" />
              </button>
            ) : (
              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1a73e8] bg-[#e8f0fe] hover:bg-[#d2e3fc] border border-[#d2e3fc] rounded-lg transition-all shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Track Channel</span>
              </button>
            )}

            {dropdownOpen && activeChannel && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#dadce0] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-[#dadce0] text-xs font-bold text-[#70757a] uppercase tracking-wider flex items-center justify-between">
                  <span>Tracked Channels</span>
                  <span className="text-[10px] text-[#1a73e8] font-normal">StatsTracker47 Engine</span>
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {channels.map((ch) => {
                    const isSelected = ch.id === activeChannel.id;
                    return (
                      <button
                        key={ch.id}
                        onClick={() => {
                          onSelectChannel(ch);
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#f1f3f4] text-xs transition-colors ${
                          isSelected ? 'bg-[#e8f0fe] text-[#1a73e8] font-medium' : 'text-[#3c4043]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={ch.avatarUrl} alt={ch.title} className="w-6 h-6 rounded-full object-cover shrink-0 border border-[#dadce0]" />
                          <div className="truncate">
                            <p className="truncate font-medium">{ch.title}</p>
                            <p className="text-[11px] text-[#5f6368] truncate">@{ch.handle} • {ch.subscribersFormatted}</p>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#1a73e8] shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>

                <div className="p-2 border-t border-[#dadce0] space-y-1">
                  {onSyncAllChannels && (
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onSyncAllChannels();
                      }}
                      disabled={isSyncingChannels}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-[#3c4043] hover:bg-[#f1f3f4] rounded-lg transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingChannels ? 'animate-spin text-[#1a73e8]' : 'text-[#5f6368]'}`} />
                      <span>{isSyncingChannels ? 'Syncing all data...' : 'Sync All Channels Data'}</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenAddModal();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-[#1a73e8] hover:bg-[#e8f0fe] rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Track another channel URL</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Primary Action: Send Weekly Digest */}
          <button
            onClick={onOpenSendDigestModal}
            className="bg-[#1a73e8] hover:bg-[#1557b0] text-white px-3.5 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium shadow-2xs transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send Digest</span>
            <span className="sm:hidden">Send</span>
          </button>

          {/* Circular Initials Avatar */}
          <div 
            className="w-8 h-8 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0 cursor-pointer"
            title={`Account: ${userEmail}`}
          >
            {initials}
          </div>

        </div>
      </div>

      {/* Mobile Top Navigation Tabs (when on small screens) */}
      <div className="md:hidden pt-2 mt-2 border-t border-[#dadce0] overflow-x-auto no-scrollbar">
        <nav className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = filterState.activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#e8f0fe] text-[#1a73e8] font-medium'
                    : 'text-[#5f6368] hover:bg-[#f1f3f4]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};


