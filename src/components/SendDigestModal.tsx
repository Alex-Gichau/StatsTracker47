import React, { useState } from 'react';
import { 
  Send, 
  X, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  Loader2,
  FileText,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChannelData, WeeklyReport } from '../types';

interface SendDigestModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel?: ChannelData | null;
  report: WeeklyReport | null;
  onSend: (email: string, format: string) => Promise<void>;
  defaultEmail?: string;
  isSending: boolean;
}

export const SendDigestModal: React.FC<SendDigestModalProps> = ({
  isOpen,
  onClose,
  channel,
  report,
  onSend,
  defaultEmail = 'gichaumburu@gmail.com',
  isSending
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [format, setFormat] = useState<'rich-html' | 'compact-summary'>('rich-html');
  const [isDone, setIsDone] = useState(false);

  if (!isOpen || !channel) return null;

  const handleSend = async () => {
    if (!email.trim()) return;
    await onSend(email, format);
    setIsDone(true);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      setIsDone(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1a73e8] flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Dispatch Weekly Performance Digest</h2>
              <p className="text-xs text-gray-500">Send instant analytics & strategic growth summary to email</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {isDone ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Weekly Digest Dispatched!</h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                Successfully sent the performance digest for <strong>{channel.title}</strong> to <strong>{email}</strong>.
              </p>
            </div>
          ) : (
            <>
              {/* Channel preview badge */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <img src={channel.avatarUrl} alt={channel.title} className="w-10 h-10 rounded-full object-cover" />
                <div className="min-w-0">
                  <div className="font-bold text-gray-900 text-xs truncate">{channel.title}</div>
                  <div className="text-[11px] text-gray-500">
                    @{channel.handle} • {channel.subscribersFormatted} subs • +{channel.weeklySubGain.toLocaleString()} this week
                  </div>
                </div>
              </div>

              {/* Recipient Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
                  Recipient Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 absolute left-3 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="creator@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#f8f9fa] border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                  />
                </div>
              </div>

              {/* Format selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
                  Report Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormat('rich-html')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      format === 'rich-html'
                        ? 'border-[#1a73e8] bg-blue-50/50 text-[#1a73e8] font-semibold'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-bold">Rich HTML Digest</div>
                    <div className="text-[11px] text-gray-500 font-normal mt-0.5">Google styled cards & charts</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormat('compact-summary')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      format === 'compact-summary'
                        ? 'border-[#1a73e8] bg-blue-50/50 text-[#1a73e8] font-semibold'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-bold">Executive Summary</div>
                    <div className="text-[11px] text-gray-500 font-normal mt-0.5">Quick bullet points & KPIs</div>
                  </button>
                </div>
              </div>

              {/* Bottom Send button */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={isSending || !email.trim()}
                  className="flex items-center gap-1.5 px-5 py-2 bg-[#1a73e8] hover:bg-[#1557b0] disabled:bg-gray-300 text-white text-xs font-semibold rounded-lg shadow-xs transition-all"
                >
                  {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Send Digest</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
