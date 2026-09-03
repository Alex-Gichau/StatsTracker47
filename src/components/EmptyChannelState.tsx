import React, { useState } from 'react';
import { 
  Youtube, 
  Search, 
  ArrowRight, 
  Loader2, 
  Key, 
  Sparkles, 
  BarChart3, 
  Mail, 
  ShieldCheck,
  Video
} from 'lucide-react';
import { ChannelData, ApiKeysState } from '../types';

interface EmptyChannelStateProps {
  onAddChannel: (channel: ChannelData) => void;
  onOpenKeysModal: () => void;
  apiState: ApiKeysState;
  onLogEmit?: (message: string, category?: 'API' | 'BRANDING' | 'TELEMETRY' | 'MEET' | 'AI' | 'SYSTEM', level?: 'info' | 'warn' | 'success' | 'error', details?: any) => void;
}

export const EmptyChannelState: React.FC<EmptyChannelStateProps> = ({
  onAddChannel,
  onOpenKeysModal,
  apiState,
  onLogEmit
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAnalyze = async (overrideInput?: string) => {
    const rawInput = (overrideInput || urlInput).trim();
    if (!rawInput) return;

    setIsLoading(true);
    setErrorMessage(null);
    onLogEmit?.(`Initiating channel ingestion pipeline for: ${rawInput}`, 'API', 'info', { input: rawInput });

    try {
      const response = await fetch('/api/channel/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: rawInput })
      });

      const data = await response.json();

      if (!response.ok || !data.channel) {
        throw new Error(data.error || 'Failed to analyze channel');
      }

      onLogEmit?.(`Successfully ingested channel: ${data.channel.title} (@${data.channel.handle})`, 'BRANDING', 'success', {
        title: data.channel.title,
        subscribers: data.channel.subscribersFormatted,
        totalViews: data.channel.totalViewsFormatted
      });

      onAddChannel(data.channel);
    } catch (err: any) {
      console.error('Channel fetch error:', err);
      setErrorMessage(err.message || 'Unable to load channel. Please check the URL or configure your YouTube API Key.');
      onLogEmit?.(`Channel ingestion error: ${err.message}`, 'API', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const sampleSuggestions = [
    { label: '@mkbhd', desc: 'Tech & Hardware' },
    { label: '@veritasium', desc: 'Science & Physics' },
    { label: '@fireship', desc: 'Software & Code' },
    { label: '@aliabdaal', desc: 'Productivity' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-8">
      
      {/* Top Banner Card */}
      <div className="bg-white rounded-2xl border border-[#dadce0] p-6 sm:p-10 shadow-xs text-center space-y-6">
        
        {/* Brand Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-600 text-white mx-auto flex items-center justify-center shadow-md">
          <Youtube className="w-8 h-8" />
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-2 max-w-xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#202124] tracking-tight">
            Track YouTube Channel Statistics
          </h1>
          <p className="text-sm text-[#5f6368] leading-relaxed">
            Enter any YouTube Channel URL or handle to ingest live subscriber growth curves, video scorecards, retention telemetry, and automated weekly digests.
          </p>
        </div>

        {/* Big Search Input Form */}
        <div className="max-w-2xl mx-auto">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleAnalyze();
            }}
            className="space-y-3"
          >
            <div className="relative flex items-center shadow-xs rounded-xl overflow-hidden border-2 border-[#1a73e8]/30 focus-within:border-[#1a73e8] bg-[#f8f9fa] focus-within:bg-white transition-all">
              <div className="pl-4 text-[#5f6368]">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste YouTube channel URL or @handle (e.g. @mkbhd, https://youtube.com/@channel)..."
                className="w-full px-3 py-3.5 text-sm text-[#202124] bg-transparent outline-none placeholder-[#70757a]"
                autoFocus
              />
              <button
                type="submit"
                disabled={isLoading || !urlInput.trim()}
                className="mr-2 px-5 py-2 bg-[#1a73e8] hover:bg-[#1557b0] disabled:bg-[#dadce0] disabled:text-[#80868b] text-white font-medium text-xs sm:text-sm rounded-lg transition-all flex items-center gap-2 shrink-0 shadow-2xs cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Ingest Channel</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 text-left flex items-start gap-2">
                <span className="font-semibold shrink-0">Note:</span>
                <span>{errorMessage}</span>
              </div>
            )}
          </form>

          {/* Quick Click Suggestions */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-[#70757a] font-medium">Quick examples:</span>
            {sampleSuggestions.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setUrlInput(item.label);
                  handleAnalyze(item.label);
                }}
                className="px-2.5 py-1 bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#3c4043] rounded-full border border-[#dadce0] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="font-medium">{item.label}</span>
                <span className="text-[10px] text-[#70757a]">({item.desc})</span>
              </button>
            ))}
          </div>
        </div>

        {/* API Key Status Bar */}
        <div className="pt-4 border-t border-[#dadce0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5f6368]">
          <div className="flex items-center gap-2">
            <ShieldCheck className={`w-4 h-4 ${apiState.youtubeAnalyticsConnected ? 'text-[#137333]' : 'text-[#f29900]'}`} />
            <span>
              {apiState.youtubeAnalyticsConnected 
                ? 'YouTube Analytics API v2 Connected (OAuth Verified)' 
                : 'YouTube Analytics OAuth Standby'}
            </span>
          </div>

          <button
            onClick={onOpenKeysModal}
            className="px-3 py-1 bg-white hover:bg-[#f8f9fa] border border-[#dadce0] text-[#1a73e8] font-medium rounded-md shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Configure YouTube Analytics Settings</span>
          </button>
        </div>

      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#dadce0] shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#1a73e8] flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#202124]">Authentic Channel Telemetry</h3>
          <p className="text-xs text-[#5f6368]">
            30-day subscriber velocity curves, video engagement breakdowns, and high-resolution channel branding wallpaper assets.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#dadce0] shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#202124]">Automated Email Digests</h3>
          <p className="text-xs text-[#5f6368]">
            Configure weekly scheduled summaries dispatched directly to your inbox with delivery tracking and performance scores.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#dadce0] shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#202124]">Google Meet Consultation</h3>
          <p className="text-xs text-[#5f6368]">
            Track consultation hours, creator debriefs, and live stream telemetry synced directly to your content strategy.
          </p>
        </div>
      </div>

    </div>
  );
};
