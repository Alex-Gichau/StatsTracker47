import React, { useState } from 'react';
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
  Sliders
} from 'lucide-react';
import { ApiKeysState } from '../types';

interface ApiKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiState: ApiKeysState;
  onSaveKeys: (youtubeKey: string, meetKey: string) => Promise<void>;
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
  const [youtubeKey, setYoutubeKey] = useState(apiState.customYoutubeKey || '');
  const [meetKey, setMeetKey] = useState(apiState.customGoogleMeetKey || '');
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveKeys(youtubeKey, meetKey);
      onShowToast('API configuration synchronized with StatsTracker47!', 'success');
      onClose();
    } catch (err) {
      onShowToast('Failed to save API key configuration', 'error');
    } finally {
      setIsSaving(false);
    }
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
              <span className="font-semibold text-[#1a73e8]">Strict API Precision Guarantee:</span>
              <p className="text-[#3c4043] leading-relaxed">
                StatsTracker47 is configured to strictly provide authentic statistics for YouTube channels authenticated through the <strong>YouTube Data API v3</strong> and <strong>Google Meet API</strong>. Keys can be set in your <code>.env</code> file or managed below.
              </p>
            </div>
          </div>

          {/* YouTube Data API Section */}
          <div className="border border-[#dadce0] rounded-xl p-4 sm:p-5 space-y-3 bg-white shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                  <Youtube className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#202124]">YouTube Data API v3</h3>
                  <p className="text-[11px] text-[#5f6368]">Subscribers, 30-day velocity, uploads, branding wallpaper & avatars</p>
                </div>
              </div>

              {apiState.youtubeApiKeyConfigured ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#e6f4ea] text-[#137333] border border-[#ceead6]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#137333]" />
                  <span>Connected ({apiState.youtubeKeySource === 'env' ? '.env' : 'Custom'})</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#fce8e6] text-[#c5221f] border border-[#fad2cf]">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Missing Key</span>
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#3c4043] mb-1.5">
                YouTube API Key (or set <code>YOUTUBE_API_KEY</code> in .env)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={youtubeKey}
                  onChange={(e) => setYoutubeKey(e.target.value)}
                  placeholder={apiState.youtubeKeySource === 'env' ? 'Configured in .env file (AI Studio Secrets)' : 'AIzaSy...'}
                  className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#dadce0] rounded-lg text-xs font-mono text-[#202124] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent transition-all"
                />
              </div>
              <p className="text-[11px] text-[#70757a] mt-1 flex items-center gap-1">
                <span>Requires read access to YouTube Data API v3 (Channels, Playlists, Videos, Branding)</span>
              </p>
            </div>
          </div>

          {/* Google Meet API Section */}
          <div className="border border-[#dadce0] rounded-xl p-4 sm:p-5 space-y-3 bg-white shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#202124]">Google Meet API Integration</h3>
                  <p className="text-[11px] text-[#5f6368]">Creator consultations, livestream Q&A, and meeting attendee telemetry</p>
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
                  <span>Optional / Standby</span>
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#3c4043] mb-1.5">
                Google Meet API Key (or set <code>GOOGLE_MEET_API_KEY</code> in .env)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={meetKey}
                  onChange={(e) => setMeetKey(e.target.value)}
                  placeholder={apiState.googleMeetKeySource === 'env' ? 'Configured in .env file (AI Studio Secrets)' : 'AIzaSy... or OAuth Client'}
                  className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#dadce0] rounded-lg text-xs font-mono text-[#202124] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent transition-all"
                />
              </div>
              <p className="text-[11px] text-[#70757a] mt-1">
                Enables synchronizing creator consultation logs, live viewer webinars, and Q&A retention curves.
              </p>
            </div>
          </div>

          {/* Integration Health & Telemetry Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-[#f8f9fa] border border-[#dadce0] rounded-lg">
              <span className="text-[#5f6368] text-[11px]">API Quota Units</span>
              <div className="text-sm font-bold text-[#202124] mt-0.5 font-mono">
                {apiState.youtubeQuotaUnitsUsed.toLocaleString()} / 10,000
              </div>
              <div className="w-full bg-[#e8eaed] h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-[#1a73e8] h-full rounded-full" 
                  style={{ width: `${Math.min(100, (apiState.youtubeQuotaUnitsUsed / 10000) * 100)}%` }} 
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
