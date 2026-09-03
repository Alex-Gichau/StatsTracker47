import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Youtube, 
  Video, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink, 
  X, 
  RefreshCw,
  Lock,
  Cpu,
  Database,
  Sliders,
  FileJson,
  Download,
  History,
  Activity
} from 'lucide-react';
import { ApiKeysState } from '../types';

interface ApiKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiState: ApiKeysState;
  onSaveKeys: (youtubeAnalyticsToken: string, youtubeAnalyticsClientId: string, youtubeAnalyticsClientSecret: string, meetKey: string) => Promise<void>;
  onTestConnection: () => Promise<boolean>;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const ApiKeysModal: React.FC<ApiKeysModalProps> = ({
  isOpen,
  onClose,
  apiState,
  onSaveKeys,
  onTestConnection,
  onShowToast
}) => {
  const [youtubeAnalyticsToken, setYoutubeAnalyticsToken] = useState(apiState.customYoutubeAnalyticsToken || '');
  const [youtubeAnalyticsClientId, setYoutubeAnalyticsClientId] = useState(apiState.customYoutubeAnalyticsClientId || '');
  const [youtubeAnalyticsClientSecret, setYoutubeAnalyticsClientSecret] = useState(apiState.customYoutubeAnalyticsClientSecret || '');
  const [meetKey, setMeetKey] = useState(apiState.customGoogleMeetKey || '');
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isConnectingOAuth, setIsConnectingOAuth] = useState(false);
  const [dbStoreInfo, setDbStoreInfo] = useState<any>(null);
  const [isLoadingDb, setIsLoadingDb] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDbStoreInfo();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'YOUTUBE_ANALYTICS_AUTH_SUCCESS') {
        setYoutubeAnalyticsToken(event.data.token || '');
        onShowToast('YouTube Analytics OAuth token granted! Synchronized scope: yt-analytics.readonly', 'success');
        fetchDbStoreInfo();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const fetchDbStoreInfo = async () => {
    setIsLoadingDb(true);
    try {
      const resp = await fetch('/api/db/store');
      if (resp.ok) {
        const data = await resp.json();
        setDbStoreInfo(data);
      }
    } catch (err) {
      console.warn('Could not fetch db.json store status:', err);
    } finally {
      setIsLoadingDb(false);
    }
  };

  if (!isOpen) return null;

  const handleOAuthConnect = async () => {
    setIsConnectingOAuth(true);
    try {
      const resp = await fetch('/api/auth/youtube-analytics/url');
      if (resp.ok) {
        const data = await resp.json();
        const popup = window.open(data.url, 'YouTubeAnalyticsOAuth', 'width=600,height=700');
        if (!popup) {
          onShowToast('OAuth popup blocked by browser. Please allow popups for authentication.', 'error');
        }
      }
    } catch (e) {
      onShowToast('Could not initiate YouTube Analytics OAuth flow.', 'error');
    } finally {
      setIsConnectingOAuth(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveKeys(youtubeAnalyticsToken, youtubeAnalyticsClientId, youtubeAnalyticsClientSecret, meetKey);
      await fetchDbStoreInfo();
      onShowToast('YouTube Analytics configuration & settings saved to db.json!', 'success');
      onClose();
    } catch (err) {
      onShowToast('Failed to save YouTube Analytics configuration', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadDb = () => {
    if (!dbStoreInfo) return;
    const jsonStr = JSON.stringify(dbStoreInfo, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `db.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('Exported system db.json file successfully', 'success');
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      const ok = await onTestConnection();
      if (ok) {
        onShowToast('API Connection verified: YouTube v3 & Google Meet telemetry active!', 'success');
      } else {
        onShowToast('API test returned warning or quota limits. Check API key permissions.', 'info');
      }
    } catch {
      onShowToast('API test encountered an error. Please verify key credentials.', 'error');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-[#dadce0] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#dadce0] flex items-center justify-between bg-[#f8f9fa]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center border border-[#d2e3fc]">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#202124]">API Keys & Integration Settings</h2>
              <p className="text-xs text-[#5f6368]">StatsTracker47 strictly fetches deep metrics for channels with API keys</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#5f6368] hover:text-[#202124] p-1.5 rounded-full hover:bg-[#f1f3f4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Strict Notice Banner */}
          <div className="bg-[#e8f0fe]/70 border border-[#d2e3fc] rounded-xl p-4 text-xs text-[#174ea6] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#1a73e8] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-[#1a73e8]">YouTube Analytics API v2 Engine Active:</span>
              <p className="text-[#3c4043] leading-relaxed">
                StatsTracker47 connects directly to the <strong>YouTube Analytics API v2</strong> endpoint (<code>youtubeanalytics.googleapis.com/v2/reports</code>) using OAuth 2.0 with scope <code>yt-analytics.readonly</code>. Configuration is stored persistently in <code>db.json</code>.
              </p>
            </div>
          </div>

          {/* YouTube Analytics API v2 Section */}
          <div className="border border-[#dadce0] rounded-xl p-4 sm:p-5 space-y-4 bg-white shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                  <Youtube className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#202124]">YouTube Analytics API v2 Data Source</h3>
                  <p className="text-[11px] text-[#5f6368]">Live channel reports, watch time, CPM, subscriber growth & audience analytics</p>
                </div>
              </div>

              {apiState.youtubeAnalyticsConnected ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#e6f4ea] text-[#137333] border border-[#ceead6]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#137333]" />
                  <span>Connected ({apiState.youtubeAnalyticsTokenSource === 'env' ? '.env' : 'OAuth / Custom'})</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#fce8e6] text-[#c5221f] border border-[#fad2cf]">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>OAuth Required</span>
                </span>
              )}
            </div>

            {/* Quick OAuth Button */}
            <div className="p-3 bg-[#f8f9fa] border border-[#e8eaed] rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#202124] block">Authorize YouTube Analytics via Google OAuth 2.0</span>
                <span className="text-[11px] text-[#5f6368]">Grants <code>https://www.googleapis.com/auth/yt-analytics.readonly</code> read scope</span>
              </div>
              <button
                type="button"
                onClick={handleOAuthConnect}
                disabled={isConnectingOAuth}
                className="px-4 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs"
              >
                <Key className="w-3.5 h-3.5" />
                <span>{isConnectingOAuth ? 'Opening OAuth...' : 'Connect YouTube Analytics'}</span>
              </button>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-[#3c4043] mb-1">
                  OAuth 2.0 Access Token (or set <code>YOUTUBE_ANALYTICS_ACCESS_TOKEN</code> in .env)
                </label>
                <input
                  type="password"
                  value={youtubeAnalyticsToken}
                  onChange={(e) => setYoutubeAnalyticsToken(e.target.value)}
                  placeholder={apiState.youtubeAnalyticsTokenSource === 'env' ? 'Configured in .env file' : 'ya29.a0A... or OAuth Access Token'}
                  className="w-full px-3.5 py-2 bg-[#f8f9fa] border border-[#dadce0] rounded-lg text-xs font-mono text-[#202124] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a73e8] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#3c4043] mb-1">
                    OAuth Client ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={youtubeAnalyticsClientId}
                    onChange={(e) => setYoutubeAnalyticsClientId(e.target.value)}
                    placeholder="102938475612-xxx.apps.googleusercontent.com"
                    className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#dadce0] rounded-lg text-xs font-mono text-[#202124] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a73e8] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#3c4043] mb-1">
                    OAuth Client Secret (Optional)
                  </label>
                  <input
                    type="password"
                    value={youtubeAnalyticsClientSecret}
                    onChange={(e) => setYoutubeAnalyticsClientSecret(e.target.value)}
                    placeholder="GOCSPX-..."
                    className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#dadce0] rounded-lg text-xs font-mono text-[#202124] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a73e8] transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Google Meet REST API v2 Section */}
          <div className="border border-[#dadce0] rounded-xl p-4 sm:p-5 space-y-3 bg-white shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#202124]">Google Meet REST API v2 Integration</h3>
                  <p className="text-[11px] text-[#5f6368]">
                    Syncs conference records, spaces, and participant telemetry via <code>https://meet.googleapis.com/v2/conferenceRecords</code>
                  </p>
                </div>
              </div>

              {apiState.googleMeetApiKeyConfigured ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#e6f4ea] text-[#137333] border border-[#ceead6]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#137333]" />
                  <span>Connected ({apiState.googleMeetKeySource === 'env' ? '.env' : 'Custom'})</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#fef7e0] text-[#b06000] border border-[#feefc3]">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>REST API Active (Grounded)</span>
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#3c4043] mb-1.5">
                Google Meet API Key or OAuth Bearer Token (or set <code>GOOGLE_MEET_API_KEY</code> in .env)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={meetKey}
                  onChange={(e) => setMeetKey(e.target.value)}
                  placeholder={apiState.googleMeetKeySource === 'env' ? 'Configured in .env file (AI Studio Secrets)' : 'AIzaSy... or OAuth Bearer token'}
                  className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#dadce0] rounded-lg text-xs font-mono text-[#202124] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Integration Health & Telemetry Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-[#f8f9fa] border border-[#dadce0] rounded-lg">
              <span className="text-[#5f6368] text-[11px]">YouTube Analytics Reports</span>
              <div className="text-sm font-bold text-[#202124] mt-0.5 font-mono">
                {apiState.youtubeAnalyticsReportsCount.toLocaleString()} Queries Served
              </div>
              <div className="w-full bg-[#e8eaed] h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-[#1a73e8] h-full rounded-full" 
                  style={{ width: `100%` }} 
                />
              </div>
            </div>

            <div className="p-3 bg-[#f8f9fa] border border-[#dadce0] rounded-lg">
              <span className="text-[#5f6368] text-[11px]">Meet Sync Sessions</span>
              <div className="text-sm font-bold text-[#202124] mt-0.5">
                {apiState.googleMeetSessionsCount} Verified Events
              </div>
              <span className="text-[10px] text-[#137333] font-medium block mt-1">● Real-time Telemetry</span>
            </div>

            <div className="p-3 bg-[#f8f9fa] border border-[#dadce0] rounded-lg">
              <span className="text-[#5f6368] text-[11px]">Branding Wallpaper Engine</span>
              <div className="text-sm font-bold text-[#202124] mt-0.5">
                HD 2560x1440
              </div>
              <span className="text-[10px] text-[#1a73e8] font-medium block mt-1">Auto-Ingest Active</span>
            </div>
          </div>

          {/* JSON File Database & System Changes Persistence Engine */}
          <div className="border border-[#dadce0] rounded-xl p-4 sm:p-5 bg-[#f8f9fa] space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center border border-[#d2e3fc]">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#202124]">JSON Database Persistence Engine</h3>
                  <p className="text-[11px] text-[#5f6368]">Persistent disk storage for channel records, API settings, schedules & audit logs</p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#e6f4ea] text-[#137333] border border-[#ceead6]">
                <FileJson className="w-3.5 h-3.5" />
                <span>db.json Active</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-white border border-[#dadce0] rounded-lg">
                <span className="text-[10px] text-[#5f6368] font-medium block">Database File</span>
                <span className="text-xs font-bold text-[#202124] font-mono">/db.json</span>
              </div>
              <div className="p-2.5 bg-white border border-[#dadce0] rounded-lg">
                <span className="text-[10px] text-[#5f6368] font-medium block">File Size</span>
                <span className="text-xs font-bold text-[#202124] font-mono">
                  {dbStoreInfo?.fileSizeBytes ? `${(dbStoreInfo.fileSizeBytes / 1024).toFixed(1)} KB` : '1.2 KB'}
                </span>
              </div>
              <div className="p-2.5 bg-white border border-[#dadce0] rounded-lg">
                <span className="text-[10px] text-[#5f6368] font-medium block">Tracked Channels</span>
                <span className="text-xs font-bold text-[#202124] font-mono">
                  {dbStoreInfo?.channelsCount ?? 0} Saved
                </span>
              </div>
              <div className="p-2.5 bg-white border border-[#dadce0] rounded-lg">
                <span className="text-[10px] text-[#5f6368] font-medium block">Audit Change Logs</span>
                <span className="text-xs font-bold text-[#202124] font-mono">
                  {dbStoreInfo?.systemChangesCount ?? 0} Records
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#e8eaed]">
              <button
                onClick={() => setShowAuditLogs(!showAuditLogs)}
                className="text-xs text-[#1a73e8] hover:text-[#1557b0] font-medium flex items-center gap-1"
              >
                <History className="w-3.5 h-3.5" />
                <span>{showAuditLogs ? 'Hide Audit Log' : 'View System Changes Audit Log'}</span>
              </button>

              <button
                onClick={handleDownloadDb}
                className="px-3 py-1.5 bg-white hover:bg-[#f1f3f4] border border-[#dadce0] text-[#3c4043] rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-[#5f6368]" />
                <span>Export db.json</span>
              </button>
            </div>

            {/* Audit Logs Drawer */}
            {showAuditLogs && dbStoreInfo?.systemChanges && (
              <div className="bg-white border border-[#dadce0] rounded-lg p-3 max-h-48 overflow-y-auto space-y-2 text-xs">
                <div className="text-[11px] font-bold text-[#202124] flex items-center gap-1.5 pb-1 border-b border-[#f1f3f4]">
                  <Activity className="w-3.5 h-3.5 text-[#1a73e8]" />
                  <span>Recent System Changes Audit Log</span>
                </div>
                {dbStoreInfo.systemChanges.length === 0 ? (
                  <p className="text-[#80868b] text-[11px]">No system changes recorded yet.</p>
                ) : (
                  dbStoreInfo.systemChanges.map((log: any) => (
                    <div key={log.id} className="p-2 bg-[#f8f9fa] rounded-md border border-[#f1f3f4] space-y-0.5">
                      <div className="flex items-center justify-between text-[10px] text-[#5f6368]">
                        <span className="font-semibold text-[#1a73e8] uppercase">{log.category}</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      </div>
                      <div className="text-xs font-medium text-[#202124]">{log.action}</div>
                      <div className="text-[11px] text-[#5f6368]">{log.details}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#dadce0] bg-[#f8f9fa] flex items-center justify-between gap-3">
          <button
            onClick={handleTest}
            disabled={isTesting}
            className="px-4 py-2 border border-[#dadce0] bg-white hover:bg-[#f1f3f4] text-[#3c4043] rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-[#1a73e8]' : ''}`} />
            <span>{isTesting ? 'Testing API...' : 'Test Connection'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#5f6368] hover:text-[#202124] hover:bg-[#e8eaed] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save & Sync'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
