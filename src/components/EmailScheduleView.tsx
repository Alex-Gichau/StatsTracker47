import React, { useState } from 'react';
import { 
  Clock, 
  Mail, 
  Send, 
  CheckCircle2, 
  Save,
  Loader2
} from 'lucide-react';
import { EmailScheduleSettings, EmailDeliveryLog } from '../types';
import { formatDate } from '../utils/formatters';

interface EmailScheduleViewProps {
  schedule: EmailScheduleSettings;
  logs: EmailDeliveryLog[];
  onUpdateSchedule: (newSettings: Partial<EmailScheduleSettings>) => Promise<void>;
  onSendTestDigest: (email: string) => Promise<void>;
  isSaving: boolean;
  isSending: boolean;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const EmailScheduleView: React.FC<EmailScheduleViewProps> = ({
  schedule,
  logs,
  onUpdateSchedule,
  onSendTestDigest,
  isSaving,
  isSending,
  onShowToast
}) => {
  const [formData, setFormData] = useState<EmailScheduleSettings>(schedule);

  const handleSave = async () => {
    await onUpdateSchedule(formData);
    onShowToast('Delivery schedule saved successfully!', 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Configuration Box */}
      <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#dadce0] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#dadce0]">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-[#e8f0fe] text-[#1a73e8]">
                <Clock className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-[#202124]">Automated Weekly Email Delivery Schedule</h2>
            </div>
            <p className="text-xs text-[#5f6368]">Configure recurring weekly performance digests sent to your inbox</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#5f6368]">Active Status:</span>
            <button
              onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.isActive ? 'bg-[#1a73e8]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Recipient Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#5f6368] uppercase tracking-wider">
              Recipient Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 absolute left-3 text-[#5f6368]" />
              <input
                type="email"
                value={formData.recipientEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, recipientEmail: e.target.value }))}
                placeholder="creator@gmail.com"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#dadce0] rounded-md text-[#202124] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
              />
            </div>
          </div>

          {/* Delivery Frequency */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#5f6368] uppercase tracking-wider">
              Delivery Frequency
            </label>
            <select
              value={formData.frequency}
              onChange={(e: any) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
              className="w-full px-3 py-2 text-xs bg-white border border-[#dadce0] rounded-md text-[#202124] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
            >
              <option value="weekly">Weekly (Recommended for creators)</option>
              <option value="biweekly">Bi-weekly (Every 2 weeks)</option>
              <option value="monthly">Monthly Overview</option>
            </select>
          </div>

          {/* Day of Week */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#5f6368] uppercase tracking-wider">
              Preferred Day of Week
            </label>
            <select
              value={formData.dayOfWeek}
              onChange={(e: any) => setFormData(prev => ({ ...prev, dayOfWeek: e.target.value }))}
              className="w-full px-3 py-2 text-xs bg-white border border-[#dadce0] rounded-md text-[#202124] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <option key={day} value={day}>{day} Morning</option>
              ))}
            </select>
          </div>

          {/* Time (UTC) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#5f6368] uppercase tracking-wider">
              Time (UTC)
            </label>
            <input
              type="time"
              value={formData.timeUtc}
              onChange={(e) => setFormData(prev => ({ ...prev, timeUtc: e.target.value }))}
              className="w-full px-3 py-2 text-xs bg-white border border-[#dadce0] rounded-md text-[#202124] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
            />
          </div>

        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-4 border-t border-[#dadce0]">
          <label className="flex items-center gap-3 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={formData.includeRecommendations}
              onChange={(e) => setFormData(prev => ({ ...prev, includeRecommendations: e.target.checked }))}
              className="w-4 h-4 text-[#1a73e8] rounded-xs border-[#dadce0] focus:ring-[#1a73e8]"
            />
            <span className="text-[#3c4043] font-medium">
              Include AI-powered 7-day strategic growth recommendations in the email digest
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={formData.includeVideoScorecard}
              onChange={(e) => setFormData(prev => ({ ...prev, includeVideoScorecard: e.target.checked }))}
              className="w-4 h-4 text-[#1a73e8] rounded-xs border-[#dadce0] focus:ring-[#1a73e8]"
            />
            <span className="text-[#3c4043] font-medium">
              Include top upload scorecard with CTR & retention breakdowns
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={formData.alertOnSpikes}
              onChange={(e) => setFormData(prev => ({ ...prev, alertOnSpikes: e.target.checked }))}
              className="w-4 h-4 text-[#1a73e8] rounded-xs border-[#dadce0] focus:ring-[#1a73e8]"
            />
            <span className="text-[#3c4043] font-medium">
              Send immediate alert if subscriber or view velocity surges by &gt; 20%
            </span>
          </label>
        </div>

        {/* Action button bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#dadce0]">
          <div className="text-xs text-[#5f6368]">
            Next automated dispatch: <strong>Every {formData.dayOfWeek} at {formData.timeUtc} UTC</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSendTestDigest(formData.recipientEmail)}
              disabled={isSending || !formData.recipientEmail}
              className="px-3.5 py-1.5 bg-white hover:bg-[#f1f3f4] text-[#3c4043] text-xs font-medium rounded-md border border-[#dadce0] transition-colors shadow-xs flex items-center gap-1.5"
            >
              {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-[#5f6368]" />}
              <span>Send Test Digest</span>
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-3.5 py-1.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-medium rounded-md shadow-xs transition-colors flex items-center gap-1.5"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Schedule</span>
            </button>
          </div>
        </div>

      </div>

      {/* Delivery Logs History Table */}
      <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#dadce0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#e6f4ea] text-[#137333]">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-[#202124]">Email Delivery Logs & Verification Receipts</h3>
          </div>
          <span className="text-xs text-[#5f6368]">{logs.length} dispatches recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-[#dadce0] text-[#5f6368] font-medium bg-[#f8f9fa]">
                <th className="py-2.5 px-3">Tracking ID</th>
                <th className="py-2.5 px-3">Recipient</th>
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3">Sent Timestamp</th>
                <th className="py-2.5 px-3">Score</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dadce0]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#f8f9fa] transition-colors">
                  <td className="py-3 px-3 font-mono font-medium text-[#1a73e8]">
                    {log.trackingId}
                  </td>
                  <td className="py-3 px-3 text-[#202124] font-medium">
                    {log.recipientEmail}
                  </td>
                  <td className="py-3 px-3 text-[#3c4043] truncate max-w-xs">
                    {log.subject}
                  </td>
                  <td className="py-3 px-3 text-[#5f6368] whitespace-nowrap">
                    {formatDate(log.sentAt)}
                  </td>
                  <td className="py-3 px-3 font-bold text-[#1e8e3e]">
                    {log.performanceScore}/100
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#e6f4ea] text-[#137333] border border-[#ceead6]">
                      <CheckCircle2 className="w-3 h-3" />
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

