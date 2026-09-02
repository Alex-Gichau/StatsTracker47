import React, { useState } from 'react';
import { 
  Scale, 
  X, 
  Users, 
  Eye, 
  TrendingUp, 
  Percent, 
  Film,
  Sparkles,
  Check,
  Plus
} from 'lucide-react';
import { ChannelData } from '../types';
import { formatCompactNumber } from '../utils/formatters';

interface ChannelComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  channels: ChannelData[];
}

export const ChannelComparisonModal: React.FC<ChannelComparisonModalProps> = ({
  isOpen,
  onClose,
  channels
}) => {
  const [selectedChannelA, setSelectedChannelA] = useState<string>(channels[0]?.id || '');
  const [selectedChannelB, setSelectedChannelB] = useState<string>(channels[1]?.id || channels[0]?.id || '');

  if (!isOpen) return null;

  if (channels.length < 2) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
        <div 
          className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden p-6 space-y-4 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1a73e8] mx-auto flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Compare YouTube Channels</h3>
          <p className="text-xs text-gray-500">
            You currently have {channels.length} {channels.length === 1 ? 'channel' : 'channels'} tracked. Add at least two channels to benchmark growth velocity, subscriber momentum, and engagement side-by-side.
          </p>
          <div className="pt-2 flex justify-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const chA = channels.find(c => c.id === selectedChannelA) || channels[0];
  const chB = channels.find(c => c.id === selectedChannelB) || channels[1] || channels[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1a73e8] flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Side-by-Side Channel Comparison</h2>
              <p className="text-xs text-gray-500">Benchmark growth velocity, engagement, and upload volume</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase">Channel A</label>
              <select
                value={selectedChannelA}
                onChange={(e) => setSelectedChannelA(e.target.value)}
                className="w-full p-2.5 bg-[#f8f9fa] border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-[#1a73e8]"
              >
                {channels.map(c => (
                  <option key={c.id} value={c.id}>{c.title} (@{c.handle})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase">Channel B</label>
              <select
                value={selectedChannelB}
                onChange={(e) => setSelectedChannelB(e.target.value)}
                className="w-full p-2.5 bg-[#f8f9fa] border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-[#1a73e8]"
              >
                {channels.map(c => (
                  <option key={c.id} value={c.id}>{c.title} (@{c.handle})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Channel A Summary */}
            <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <img src={chA.avatarUrl} alt={chA.title} className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-xs" />
                <div className="truncate">
                  <h3 className="font-bold text-gray-900 text-sm truncate">{chA.title}</h3>
                  <p className="text-xs text-gray-500">@{chA.handle}</p>
                </div>
              </div>
            </div>

            {/* Channel B Summary */}
            <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <img src={chB.avatarUrl} alt={chB.title} className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-xs" />
                <div className="truncate">
                  <h3 className="font-bold text-gray-900 text-sm truncate">{chB.title}</h3>
                  <p className="text-xs text-gray-500">@{chB.handle}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Detailed Metric Table */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden text-xs">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                  <th className="p-3 text-left">Metric</th>
                  <th className="p-3 text-center">{chA.title}</th>
                  <th className="p-3 text-center">{chB.title}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="p-3 font-medium text-gray-700">Subscribers</td>
                  <td className="p-3 text-center font-bold text-gray-900">{chA.subscribersFormatted}</td>
                  <td className="p-3 text-center font-bold text-gray-900">{chB.subscribersFormatted}</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-gray-700">Weekly Subscriber Growth</td>
                  <td className={`p-3 text-center font-bold ${chA.weeklySubGain >= chB.weeklySubGain ? 'text-[#1e8e3e]' : 'text-gray-900'}`}>
                    +{formatCompactNumber(chA.weeklySubGain)}
                  </td>
                  <td className={`p-3 text-center font-bold ${chB.weeklySubGain >= chA.weeklySubGain ? 'text-[#1e8e3e]' : 'text-gray-900'}`}>
                    +{formatCompactNumber(chB.weeklySubGain)}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-gray-700">Weekly Views</td>
                  <td className="p-3 text-center font-bold text-gray-900">{formatCompactNumber(chA.weeklyViewGain)}</td>
                  <td className="p-3 text-center font-bold text-gray-900">{formatCompactNumber(chB.weeklyViewGain)}</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-gray-700">Avg. Engagement Rate</td>
                  <td className={`p-3 text-center font-bold ${chA.avgEngagementRate >= chB.avgEngagementRate ? 'text-[#1a73e8]' : 'text-gray-900'}`}>
                    {chA.avgEngagementRate}%
                  </td>
                  <td className={`p-3 text-center font-bold ${chB.avgEngagementRate >= chA.avgEngagementRate ? 'text-[#1a73e8]' : 'text-gray-900'}`}>
                    {chB.avgEngagementRate}%
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-gray-700">Avg. Click-Through Rate (CTR)</td>
                  <td className="p-3 text-center font-bold text-gray-900">{chA.avgCtr}%</td>
                  <td className="p-3 text-center font-bold text-gray-900">{chB.avgCtr}%</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-gray-700">Total Uploads</td>
                  <td className="p-3 text-center font-semibold text-gray-700">{chA.totalVideos} videos</td>
                  <td className="p-3 text-center font-semibold text-gray-700">{chB.totalVideos} videos</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};
