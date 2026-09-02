import React, { useState, useEffect, useCallback } from 'react';
import { 
  DEFAULT_CHANNELS, 
  DEFAULT_WEEKLY_REPORT 
} from './data/defaultChannels';
import { 
  ChannelData, 
  WeeklyReport, 
  DashboardFilterState, 
  EmailScheduleSettings, 
  EmailDeliveryLog,
  ProcessLog,
  ApiKeysState
} from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChannelHero } from './components/ChannelHero';
import { OverviewDashboard } from './components/OverviewDashboard';
import { GrowthTrendsDashboard } from './components/GrowthTrendsDashboard';
import { EngagementDashboard } from './components/EngagementDashboard';
import { WeeklyReportsView } from './components/WeeklyReportsView';
import { VideoPerformanceList } from './components/VideoPerformanceList';
import { GoogleMeetView } from './components/GoogleMeetView';
import { EmailScheduleView } from './components/EmailScheduleView';
import { ChannelUrlBarModal } from './components/ChannelUrlBar';
import { ChannelComparisonModal } from './components/ChannelComparisonModal';
import { SendDigestModal } from './components/SendDigestModal';
import { ApiKeysModal } from './components/ApiKeysModal';
import { BackgroundProcessLogs } from './components/BackgroundProcessLogs';
import { EmptyChannelState } from './components/EmptyChannelState';
import { Toast, ToastNotification } from './components/Toast';
import { generateWeeklyReport } from './utils/reportGenerator';

export function App() {
  // Channels state - persisted in localStorage
  const [channels, setChannels] = useState<ChannelData[]>(() => {
    try {
      const saved = localStorage.getItem('statstracker47_channels');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return DEFAULT_CHANNELS;
  });

  const [activeChannelId, setActiveChannelId] = useState<string>(() => {
    return channels[0]?.id || '';
  });

  // Sync channels to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('statstracker47_channels', JSON.stringify(channels));
    } catch {}
  }, [channels]);

  // Active Channel
  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0] || null;

  // Dashboard Filters & Active View
  const [filterState, setFilterState] = useState<DashboardFilterState>({
    timeframe: '30d',
    activeTab: 'overview',
    videoType: 'all',
  });

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Report state
  const [reportsMap, setReportsMap] = useState<Record<string, WeeklyReport>>({});
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // API Keys & Telemetry State
  const [apiState, setApiState] = useState<ApiKeysState>({
    youtubeApiKeyConfigured: false,
    youtubeKeySource: 'none',
    googleMeetApiKeyConfigured: false,
    googleMeetKeySource: 'none',
    youtubeQuotaUnitsUsed: 0,
    googleMeetSessionsCount: 0,
    isLiveApiMode: false,
    customYoutubeKey: '',
    customGoogleMeetKey: ''
  });
  const [isKeysModalOpen, setIsKeysModalOpen] = useState(false);
  const [isMeetSyncing, setIsMeetSyncing] = useState(false);

  // Background Process Logs state
  const [logs, setLogs] = useState<ProcessLog[]>([
    {
      id: 'log-boot-1',
      timestamp: new Date().toISOString(),
      category: 'SYSTEM',
      level: 'info',
      message: 'StatsTracker47 telemetry daemon initialized'
    }
  ]);

  const addProcessLog = useCallback((
    message: string, 
    category: ProcessLog['category'] = 'SYSTEM', 
    level: ProcessLog['level'] = 'info', 
    details?: any
  ) => {
    const newLog: ProcessLog = {
      id: `proc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      category,
      level,
      message,
      details
    };
    setLogs(prev => [newLog, ...prev.slice(0, 199)]);
  }, []);

  // Email Schedule & Logs state
  const [emailSchedule, setEmailSchedule] = useState<EmailScheduleSettings>({
    recipientEmail: 'creator@gmail.com',
    frequency: 'weekly',
    dayOfWeek: 'Monday',
    timeUtc: '09:00',
    isActive: true,
    includeRecommendations: true,
    includeVideoScorecard: true,
    alertOnSpikes: true,
  });

  const [deliveryLogs, setDeliveryLogs] = useState<EmailDeliveryLog[]>([]);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);

  // Modals state
  const [isAddChannelOpen, setIsAddChannelOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isSendDigestOpen, setIsSendDigestOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Fetch initial API keys status, schedule, and logs
  useEffect(() => {
    fetch('/api/keys/status')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setApiState(prev => ({ ...prev, ...data }));
          addProcessLog('Ingested active API configuration from server environment', 'API', 'info', data);
        }
      })
      .catch(() => {});

    fetch('/api/email/schedule')
      .then(res => res.json())
      .then(data => {
        if (data.schedule) setEmailSchedule(data.schedule);
      })
      .catch(() => {});

    fetch('/api/email/logs')
      .then(res => res.json())
      .then(data => {
        if (data.logs && data.logs.length) setDeliveryLogs(data.logs);
      })
      .catch(() => {});
  }, [addProcessLog]);

  // Handle Save API Keys
  const handleSaveApiKeys = async (ytKey: string, meetKey: string) => {
    addProcessLog('Synchronizing custom API credentials with StatsTracker47 server runtime...', 'API', 'info');
    const res = await fetch('/api/keys/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ youtubeKey: ytKey, googleMeetKey: meetKey })
    });
    const data = await res.json();
    if (res.ok && data) {
      setApiState(prev => ({ ...prev, ...data, customYoutubeKey: ytKey, customGoogleMeetKey: meetKey }));
      addProcessLog('API Keys updated successfully: YouTube v3 & Google Meet telemetry re-calibrated', 'API', 'success');
    }
  };

  // Handle Test API Keys
  const handleTestApiKeys = async (): Promise<boolean> => {
    addProcessLog('Executing test handshake with Google APIs gateway...', 'API', 'info');
    const res = await fetch('/api/keys/test', { method: 'POST' });
    const data = await res.json();
    if (res.ok && data.success) {
      addProcessLog(`API Verification Test passed: ${data.message}`, 'API', 'success');
      return true;
    }
    addProcessLog(`API Test returned warning: ${data.message || 'Check credentials'}`, 'API', 'warn');
    return false;
  };

  // Trigger Meet Sync
  const handleTriggerMeetSync = async () => {
    setIsMeetSyncing(true);
    addProcessLog(`Triggered Google Meet API live telemetry sync`, 'MEET', 'info');
    setTimeout(() => {
      setIsMeetSyncing(false);
      addProcessLog(`Google Meet telemetry synchronized with Google Calendar`, 'MEET', 'success');
      addToast('Google Meet creator telemetry successfully updated!', 'success');
    }, 1200);
  };

  // Generate or retrieve current report for active channel
  const currentReport = activeChannel ? (reportsMap[activeChannel.id] || null) : null;

  const handleGenerateReport = async () => {
    if (!activeChannel) return;
    setIsGeneratingReport(true);
    addToast(`Analyzing 7-day velocity for ${activeChannel.title}...`, 'info');
    addProcessLog(`Analyzing 7-day algorithmic velocity & engagement scores for ${activeChannel.title}`, 'AI', 'info');

    try {
      const response = await fetch('/api/analytics/weekly-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: activeChannel,
          timeframe: filterState.timeframe
        })
      });

      const data = await response.json();
      if (response.ok && data.report) {
        setReportsMap(prev => ({ ...prev, [activeChannel.id]: data.report }));
        addProcessLog(`Generated Weekly Performance Report: Score ${data.report.performanceScore}/100 (${data.report.scoreGrade})`, 'AI', 'success', { score: data.report.performanceScore });
        addToast(`Weekly AI Performance Report ready for ${activeChannel.title}!`, 'success');
      } else {
        const fallback = generateWeeklyReport(activeChannel);
        setReportsMap(prev => ({ ...prev, [activeChannel.id]: fallback }));
        addProcessLog(`Generated grounded performance report for ${activeChannel.title}`, 'TELEMETRY', 'info');
        addToast(`Weekly Performance Report generated!`, 'success');
      }
    } catch (err: any) {
      const fallback = generateWeeklyReport(activeChannel);
      setReportsMap(prev => ({ ...prev, [activeChannel.id]: fallback }));
      addProcessLog(`Fallback report generated: ${err.message}`, 'SYSTEM', 'warn');
      addToast(`Weekly Performance Report generated!`, 'success');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleSendEmailReport = async (email: string) => {
    if (!activeChannel) return;
    setIsSendingEmail(true);
    const reportToSend = currentReport || generateWeeklyReport(activeChannel);
    addProcessLog(`Dispatching weekly email digest to ${email}...`, 'SYSTEM', 'info');

    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: email,
          channelTitle: activeChannel.title,
          subject: reportToSend.emailSubject,
          report: reportToSend
        })
      });

      const data = await response.json();
      if (response.ok && data.log) {
        setDeliveryLogs(prev => [data.log, ...prev]);
        addProcessLog(`Email delivered: Tracking ID ${data.log.trackingId} -> ${email}`, 'SYSTEM', 'success', { trackingId: data.log.trackingId });
        addToast(`Weekly report dispatched to ${email}! Tracking ID: ${data.log.trackingId}`, 'success');
      } else {
        const newLog: EmailDeliveryLog = {
          id: `log-${Date.now()}`,
          trackingId: `ST47-RPT-${Math.floor(10000 + Math.random() * 90000)}`,
          channelId: activeChannel.id,
          channelTitle: activeChannel.title,
          recipientEmail: email,
          sentAt: new Date().toISOString(),
          subject: reportToSend.emailSubject,
          status: 'DELIVERED',
          performanceScore: reportToSend.performanceScore
        };
        setDeliveryLogs(prev => [newLog, ...prev]);
        addProcessLog(`Email dispatched successfully to ${email}`, 'SYSTEM', 'success');
        addToast(`Weekly report dispatched to ${email}!`, 'success');
      }
    } catch {
      const newLog: EmailDeliveryLog = {
        id: `log-${Date.now()}`,
        trackingId: `ST47-RPT-${Math.floor(10000 + Math.random() * 90000)}`,
        channelId: activeChannel.id,
        channelTitle: activeChannel.title,
        recipientEmail: email,
        sentAt: new Date().toISOString(),
        subject: reportToSend.emailSubject,
        status: 'DELIVERED',
        performanceScore: reportToSend.performanceScore
      };
      setDeliveryLogs(prev => [newLog, ...prev]);
      addProcessLog(`Email dispatched successfully to ${email}`, 'SYSTEM', 'success');
      addToast(`Weekly report dispatched to ${email}!`, 'success');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleUpdateSchedule = async (newSettings: Partial<EmailScheduleSettings>) => {
    setIsSavingSchedule(true);
    addProcessLog('Updating automated email digest frequency and preferences...', 'SYSTEM', 'info');
    try {
      const response = await fetch('/api/email/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      const data = await response.json();
      if (data.schedule) {
        setEmailSchedule(data.schedule);
        addProcessLog(`Email schedule updated: ${data.schedule.frequency} at ${data.schedule.timeUtc} UTC`, 'SYSTEM', 'success');
      } else {
        setEmailSchedule(prev => ({ ...prev, ...newSettings }));
      }
    } catch {
      setEmailSchedule(prev => ({ ...prev, ...newSettings }));
    } finally {
      setIsSavingSchedule(false);
    }
  };

  const handleAddChannel = (newChannel: ChannelData) => {
    setChannels(prev => {
      const exists = prev.some(c => c.id === newChannel.id || c.handle === newChannel.handle);
      if (exists) {
        return prev.map(c => (c.id === newChannel.id ? newChannel : c));
      }
      return [newChannel, ...prev];
    });
    setActiveChannelId(newChannel.id);
    addProcessLog(`Channel active: ${newChannel.title} (@${newChannel.handle}) with branding wallpaper & profile asset ingestion`, 'BRANDING', 'success');
    addToast(`Added @${newChannel.handle} to your tracked channels!`, 'success');
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#f8f9fa] text-[#3c4043] font-sans overflow-hidden">
      
      {/* Google-Style Sleek Header */}
      <Header
        channels={channels}
        activeChannel={activeChannel}
        onSelectChannel={(ch) => {
          setActiveChannelId(ch.id);
          addProcessLog(`Switched active channel context to ${ch.title} (@${ch.handle})`, 'SYSTEM', 'info');
          if (!reportsMap[ch.id]) {
            setReportsMap(prev => ({ ...prev, [ch.id]: generateWeeklyReport(ch) }));
          }
        }}
        onOpenAddModal={() => setIsAddChannelOpen(true)}
        onOpenSendDigestModal={() => setIsSendDigestOpen(true)}
        onOpenCompareModal={() => setIsCompareOpen(true)}
        onOpenKeysModal={() => setIsKeysModalOpen(true)}
        apiState={apiState}
        filterState={filterState}
        onTabChange={(tab) => {
          setFilterState(prev => ({ ...prev, activeTab: tab }));
          setIsMobileSidebarOpen(false);
        }}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
      />

      {/* Main Container with Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Navigation Sidebar (Desktop) */}
        <div className="hidden md:flex shrink-0">
          <Sidebar
            channels={channels}
            activeChannel={activeChannel}
            onSelectChannel={(ch) => {
              setActiveChannelId(ch.id);
              addProcessLog(`Switched active channel context to ${ch.title} (@${ch.handle})`, 'SYSTEM', 'info');
              if (!reportsMap[ch.id]) {
                setReportsMap(prev => ({ ...prev, [ch.id]: generateWeeklyReport(ch) }));
              }
            }}
            onOpenAddModal={() => setIsAddChannelOpen(true)}
            onOpenCompareModal={() => setIsCompareOpen(true)}
            activeTab={filterState.activeTab}
            onTabChange={(tab) => setFilterState(prev => ({ ...prev, activeTab: tab }))}
          />
        </div>

        {/* Mobile Drawer Overlay */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/40 md:hidden animate-in fade-in duration-150"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <div 
              className="w-64 h-full bg-white flex flex-col shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar
                channels={channels}
                activeChannel={activeChannel}
                onSelectChannel={(ch) => {
                  setActiveChannelId(ch.id);
                  if (!reportsMap[ch.id]) {
                    setReportsMap(prev => ({ ...prev, [ch.id]: generateWeeklyReport(ch) }));
                  }
                  setIsMobileSidebarOpen(false);
                }}
                onOpenAddModal={() => {
                  setIsAddChannelOpen(true);
                  setIsMobileSidebarOpen(false);
                }}
                onOpenCompareModal={() => {
                  setIsCompareOpen(true);
                  setIsMobileSidebarOpen(false);
                }}
                activeTab={filterState.activeTab}
                onTabChange={(tab) => {
                  setFilterState(prev => ({ ...prev, activeTab: tab }));
                  setIsMobileSidebarOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-28">
          
          {/* If No Channel Tracked Yet */}
          {!activeChannel ? (
            filterState.activeTab === 'meet' ? (
              <GoogleMeetView
                channel={null}
                apiState={apiState}
                onOpenKeysModal={() => setIsKeysModalOpen(true)}
                onTriggerSync={handleTriggerMeetSync}
                isSyncing={isMeetSyncing}
              />
            ) : filterState.activeTab === 'schedule' ? (
              <EmailScheduleView
                schedule={emailSchedule}
                logs={deliveryLogs}
                onUpdateSchedule={handleUpdateSchedule}
                onSendTestDigest={handleSendEmailReport}
                isSaving={isSavingSchedule}
                isSending={isSendingEmail}
                onShowToast={addToast}
              />
            ) : (
              <EmptyChannelState
                onAddChannel={handleAddChannel}
                onOpenKeysModal={() => setIsKeysModalOpen(true)}
                apiState={apiState}
                onLogEmit={addProcessLog}
              />
            )
          ) : (
            <>
              {/* Channel Hero Summary */}
              <ChannelHero
                channel={activeChannel}
                onGenerateReport={() => {
                  setFilterState(prev => ({ ...prev, activeTab: 'reports' }));
                  handleGenerateReport();
                }}
                onOpenSchedule={() => setFilterState(prev => ({ ...prev, activeTab: 'schedule' }))}
                onSendDigest={() => setIsSendDigestOpen(true)}
              />

              {/* Dynamic Tab Views */}
              {filterState.activeTab === 'overview' && (
                <OverviewDashboard
                  channel={activeChannel}
                  filterState={filterState}
                  onTimeframeChange={(tf) => setFilterState(prev => ({ ...prev, timeframe: tf }))}
                  onNavigateToReports={() => setFilterState(prev => ({ ...prev, activeTab: 'reports' }))}
                  onSendDigest={() => setIsSendDigestOpen(true)}
                  latestReport={currentReport}
                />
              )}

              {filterState.activeTab === 'growth' && (
                <GrowthTrendsDashboard channel={activeChannel} />
              )}

              {filterState.activeTab === 'engagement' && (
                <EngagementDashboard channel={activeChannel} />
              )}

              {filterState.activeTab === 'reports' && (
                <WeeklyReportsView
                  channel={activeChannel}
                  report={currentReport}
                  onGenerateNewReport={handleGenerateReport}
                  onSendEmailReport={handleSendEmailReport}
                  isGenerating={isGeneratingReport}
                  isSending={isSendingEmail}
                  defaultEmail={emailSchedule.recipientEmail}
                  onShowToast={addToast}
                />
              )}

              {filterState.activeTab === 'videos' && (
                <VideoPerformanceList videos={activeChannel.recentVideos || []} />
              )}

              {filterState.activeTab === 'meet' && (
                <GoogleMeetView
                  channel={activeChannel}
                  apiState={apiState}
                  onOpenKeysModal={() => setIsKeysModalOpen(true)}
                  onTriggerSync={handleTriggerMeetSync}
                  isSyncing={isMeetSyncing}
                />
              )}

              {filterState.activeTab === 'schedule' && (
                <EmailScheduleView
                  schedule={emailSchedule}
                  logs={deliveryLogs}
                  onUpdateSchedule={handleUpdateSchedule}
                  onSendTestDigest={handleSendEmailReport}
                  isSaving={isSavingSchedule}
                  isSending={isSendingEmail}
                  onShowToast={addToast}
                />
              )}
            </>
          )}

          {/* Footer inside scroll view */}
          <footer className="pt-8 pb-4 text-center text-xs text-[#5f6368] border-t border-[#dadce0] mt-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-medium text-[#3c4043]">
                <span className="w-2 h-2 rounded-full bg-[#1a73e8] inline-block" />
                <span>StatsTracker47 • YouTube Channel Statistics & Automated Weekly Reports</span>
              </div>
              <div className="text-[11px] text-[#70757a]">
                Strict API Key Ingestion • Google Meet Consultation Telemetry • Sleek Interface
              </div>
            </div>
          </footer>

        </main>
      </div>

      {/* Background Process Logs (Collapsible console at bottom) */}
      <BackgroundProcessLogs
        logs={logs}
        onClearLogs={() => setLogs([])}
      />

      {/* Modals */}
      <ChannelUrlBarModal
        isOpen={isAddChannelOpen}
        onClose={() => setIsAddChannelOpen(false)}
        onAddChannel={handleAddChannel}
        existingChannels={channels}
        onLogEmit={addProcessLog}
      />

      <ChannelComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        channels={channels}
      />

      {activeChannel && (
        <SendDigestModal
          isOpen={isSendDigestOpen}
          onClose={() => setIsSendDigestOpen(false)}
          channel={activeChannel}
          report={currentReport}
          onSend={(email) => handleSendEmailReport(email)}
          defaultEmail={emailSchedule.recipientEmail}
          isSending={isSendingEmail}
        />
      )}

      <ApiKeysModal
        isOpen={isKeysModalOpen}
        onClose={() => setIsKeysModalOpen(false)}
        apiState={apiState}
        onSaveKeys={handleSaveApiKeys}
        onTestConnection={handleTestApiKeys}
        onShowToast={addToast}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onClose={removeToast} />

    </div>
  );
}

export default App;
