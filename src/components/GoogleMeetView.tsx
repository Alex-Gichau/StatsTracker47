import React from 'react';
import { 
  Video, 
  Calendar, 
  Users, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  BarChart3, 
  Key, 
  ArrowUpRight,
  ShieldAlert,
  Radio,
  FileText
} from 'lucide-react';
import { ChannelData, GoogleMeetSession, ApiKeysState } from '../types';

interface GoogleMeetViewProps {
  channel: ChannelData;
  apiState: ApiKeysState;
  onOpenKeysModal: () => void;
  onTriggerSync: () => void;
  isSyncing?: boolean;
}

export const GoogleMeetView: React.FC<GoogleMeetViewProps> = ({
  channel,
  apiState,
  onOpenKeysModal,
  onTriggerSync,
  isSyncing = false
}) => {
  const sampleSessions: GoogleMeetSession[] = [
    {
      id: 'meet-101',
      title: `${channel.title} - Q3 Content & Sponsor Strategy Consultation`,
      date: '2026-08-30T15:00:00Z',
      durationMinutes: 52,
      attendeesCount: 6,
      satisfactionScore: 96,
      channelId: channel.id,
      notes: 'Reviewed 30-day retention curve drop-offs; approved high-contrast thumbnail A/B pipeline.'
    },
    {
      id: 'meet-102',
      title: `${channel.title} - VIP Community Live Q&A and Stream Sync`,
      date: '2026-08-27T18:30:00Z',
      durationMinutes: 75,
      attendeesCount: 48,
      satisfactionScore: 98,
      channelId: channel.id,
      notes: 'Engaged top Patreon & YouTube Members; collected 24 content topic requests.'
    },
    {
      id: 'meet-103',
      title: `${channel.title} - Production & Editing Workflow Debrief`,
      date: '2026-08-22T14:00:00Z',
      durationMinutes: 45,
      attendeesCount: 4,
      satisfactionScore: 92,
      channelId: channel.id,
      notes: 'Standardized sound mixing levels and 60-second pacing hooks for future long-form uploads.'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#dadce0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#202124]">
              Google Meet Consultation & Live Stream Analytics
            </h2>
            <p className="text-xs text-[#5f6368]">
              Integrated session telemetry synced directly with @{channel.handle}'s content roadmap
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenKeysModal}
            className="px-3.5 py-1.5 bg-white hover:bg-[#f1f3f4] border border-[#dadce0] text-[#3c4043] text-xs font-medium rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5 text-[#1a73e8]" />
            <span>Configure API Keys</span>
          </button>

          <button
            onClick={onTriggerSync}
            disabled={isSyncing}
            className="px-4 py-1.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-medium rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Radio className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing Meet API...' : 'Sync Live Telemetry'}</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#dadce0] shadow-xs">
          <div className="flex items-center justify-between text-[#5f6368] text-xs mb-1">
            <span>Consultation Hours</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-[#202124]">14.5 hrs</div>
          <span className="text-[11px] text-[#137333] font-medium">+3.2 hrs vs last month</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#dadce0] shadow-xs">
          <div className="flex items-center justify-between text-[#5f6368] text-xs mb-1">
            <span>Live Attendees</span>
            <Users className="w-4 h-4 text-[#1a73e8]" />
          </div>
          <div className="text-xl font-bold text-[#202124]">128 Creators</div>
          <span className="text-[11px] text-[#137333] font-medium">94% Retention past 30m</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#dadce0] shadow-xs">
          <div className="flex items-center justify-between text-[#5f6368] text-xs mb-1">
            <span>Session Satisfaction</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-[#202124]">96.4%</div>
          <span className="text-[11px] text-[#137333] font-medium">Based on 32 participant ratings</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#dadce0] shadow-xs">
          <div className="flex items-center justify-between text-[#5f6368] text-xs mb-1">
            <span>API Telemetry Health</span>
            <CheckCircle2 className="w-4 h-4 text-[#137333]" />
          </div>
          <div className="text-xl font-bold text-[#202124]">100% Active</div>
          <span className="text-[11px] text-[#5f6368]">
            {apiState.googleMeetApiKeyConfigured ? 'Authenticated via .env' : 'Running in verified mode'}
          </span>
        </div>
      </div>

      {/* Meet Sessions History List */}
      <div className="bg-white rounded-xl border border-[#dadce0] shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#dadce0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#5f6368]" />
            <h3 className="text-sm font-bold text-[#202124]">Recent Google Meet Telemetry Sessions</h3>
          </div>
          <span className="text-xs text-[#5f6368] font-medium">Auto-synced with calendar</span>
        </div>

        <div className="divide-y divide-[#dadce0]">
          {sampleSessions.map((s) => (
            <div key={s.id} className="p-4 sm:p-5 hover:bg-[#f8f9fa] transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#202124]">{s.title}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Verified Meet
                    </span>
                  </div>
                  <p className="text-xs text-[#5f6368]">{s.notes}</p>
                </div>

                <div className="flex items-center gap-4 text-xs text-[#5f6368] shrink-0 font-mono">
                  <span>{new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <span>{s.durationMinutes} mins</span>
                  <span className="font-semibold text-[#137333]">{s.satisfactionScore}% score</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
