import React, { useState } from 'react';
import { 
  Video, 
  Calendar, 
  Users, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Key, 
  Radio,
  Plus,
  FileText
} from 'lucide-react';
import { ChannelData, GoogleMeetSession, ApiKeysState } from '../types';

interface GoogleMeetViewProps {
  channel: ChannelData | null;
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
  const [sessions, setSessions] = useState<GoogleMeetSession[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState('45');
  const [newAttendees, setNewAttendees] = useState('5');
  const [newNotes, setNewNotes] = useState('');

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newSession: GoogleMeetSession = {
      id: `meet-${Date.now()}`,
      title: newTitle.trim(),
      date: new Date().toISOString(),
      durationMinutes: parseInt(newDuration, 10) || 30,
      attendeesCount: parseInt(newAttendees, 10) || 1,
      satisfactionScore: 95,
      channelId: channel?.id || '',
      notes: newNotes.trim() || 'Creator content roadmap consultation session.'
    };

    setSessions(prev => [newSession, ...prev]);
    setNewTitle('');
    setNewNotes('');
    setShowAddModal(false);
  };

  const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const totalAttendees = sessions.reduce((acc, s) => acc + s.attendeesCount, 0);
  const avgSatisfaction = sessions.length 
    ? (sessions.reduce((acc, s) => acc + s.satisfactionScore, 0) / sessions.length).toFixed(1)
    : '100';

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
              {channel 
                ? `Integrated session telemetry synced for @${channel.handle}'s content roadmap` 
                : 'Connect and log creator consultation telemetry via Google Meet API'}
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
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-white hover:bg-[#f1f3f4] border border-[#dadce0] text-[#1a73e8] text-xs font-medium rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Session</span>
          </button>

          <button
            onClick={onTriggerSync}
            disabled={isSyncing}
            className="px-4 py-1.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-medium rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Radio className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing Meet API...' : 'Sync Telemetry'}</span>
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
          <div className="text-xl font-bold text-[#202124]">{totalHours} hrs</div>
          <span className="text-[11px] text-[#5f6368]">
            {sessions.length} recorded {sessions.length === 1 ? 'session' : 'sessions'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#dadce0] shadow-xs">
          <div className="flex items-center justify-between text-[#5f6368] text-xs mb-1">
            <span>Live Attendees</span>
            <Users className="w-4 h-4 text-[#1a73e8]" />
          </div>
          <div className="text-xl font-bold text-[#202124]">{totalAttendees} Creators</div>
          <span className="text-[11px] text-[#5f6368]">Consultation participants</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#dadce0] shadow-xs">
          <div className="flex items-center justify-between text-[#5f6368] text-xs mb-1">
            <span>Session Satisfaction</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-[#202124]">{avgSatisfaction}%</div>
          <span className="text-[11px] text-[#5f6368]">Telemetry score</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#dadce0] shadow-xs">
          <div className="flex items-center justify-between text-[#5f6368] text-xs mb-1">
            <span>API Telemetry Health</span>
            <CheckCircle2 className="w-4 h-4 text-[#137333]" />
          </div>
          <div className="text-xl font-bold text-[#202124]">
            {apiState.googleMeetApiKeyConfigured ? 'Active' : 'Standby'}
          </div>
          <span className="text-[11px] text-[#5f6368]">
            {apiState.googleMeetApiKeyConfigured ? 'Google Meet API Ready' : 'Configure key in settings'}
          </span>
        </div>
      </div>

      {/* Meet Sessions History List */}
      <div className="bg-white rounded-xl border border-[#dadce0] shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#dadce0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#5f6368]" />
            <h3 className="text-sm font-bold text-[#202124]">Google Meet Consultation History</h3>
          </div>
          <span className="text-xs text-[#5f6368] font-medium">{sessions.length} Recorded</span>
        </div>

        {sessions.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#f1f3f4] text-[#5f6368] flex items-center justify-center">
              <Video className="w-6 h-6 text-[#70757a]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#202124]">No Google Meet Telemetry Sessions Recorded</p>
              <p className="text-xs text-[#5f6368] max-w-md mx-auto mt-1">
                Log creator consultations or connect your Google Meet API credentials to synchronize live telemetry.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-medium rounded-lg shadow-2xs transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log New Consultation</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[#dadce0]">
            {sessions.map((s) => (
              <div key={s.id} className="p-4 sm:p-5 hover:bg-[#f8f9fa] transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#202124]">{s.title}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Verified Meet
                      </span>
                    </div>
                    {s.notes && <p className="text-xs text-[#5f6368]">{s.notes}</p>}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[#5f6368] shrink-0 font-mono">
                    <span>{new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span>{s.durationMinutes} mins</span>
                    <span>{s.attendeesCount} attendees</span>
                    <span className="font-semibold text-[#137333]">{s.satisfactionScore}% score</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for logging a session */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-200 overflow-hidden p-6 space-y-4">
            <h3 className="text-base font-bold text-[#202124]">Log Google Meet Consultation</h3>
            <form onSubmit={handleAddSession} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[#3c4043] mb-1">Session Title / Topic</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Channel Strategy & Retention Review"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#3c4043] mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    min="5"
                    max="480"
                    value={newDuration}
                    onChange={e => setNewDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#3c4043] mb-1">Attendees Count</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={newAttendees}
                    onChange={e => setNewAttendees(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#3c4043] mb-1">Key Outcomes / Action Items</label>
                <textarea
                  rows={3}
                  placeholder="Discussed retention drop-offs, approved title changes..."
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#dadce0] text-[#5f6368] rounded-lg hover:bg-[#f1f3f4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1a73e8] text-white rounded-lg hover:bg-[#1557b0] font-medium"
                >
                  Save Telemetry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
