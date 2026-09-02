import React from 'react';
import { 
  CheckCircle, 
  ExternalLink, 
  Users, 
  Eye, 
  Film, 
  Sparkles, 
  TrendingUp, 
  Send,
  Clock,
  Award
} from 'lucide-react';
import { ChannelData } from '../types';
import { formatFullNumber } from '../utils/formatters';

interface ChannelHeroProps {
  channel: ChannelData;
  onGenerateReport: () => void;
  onOpenSchedule: () => void;
  onSendDigest: () => void;
}

export const ChannelHero: React.FC<ChannelHeroProps> = ({
  channel,
  onGenerateReport,
  onOpenSchedule,
  onSendDigest
}) => {
  return (
    <div className="bg-white rounded-lg border border-[#dadce0] shadow-xs overflow-hidden">
      {/* Banner Image */}
      <div className="h-28 sm:h-36 w-full relative bg-[#f1f3f4] overflow-hidden">
        <img
          src={channel.bannerUrl}
          alt={`${channel.title} banner`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        
        {/* Category Badge overlay */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-md border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {channel.category}
          </span>
        </div>
      </div>

      {/* Channel Meta Details */}
      <div className="px-5 sm:px-6 -mt-8 sm:-mt-10 pb-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          
          {/* Left Avatar & Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3.5">
            <div className="relative shrink-0">
              <img
                src={channel.avatarUrl}
                alt={channel.title}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border-3 border-white shadow-xs bg-white"
              />
              {channel.verified && (
                <div 
                  className="absolute -bottom-1 -right-1 bg-[#1a73e8] text-white p-0.5 rounded-full border-2 border-white shadow-xs"
                  title="Verified YouTube Creator"
                >
                  <CheckCircle className="w-3.5 h-3.5 fill-[#1a73e8] text-white" />
                </div>
              )}
            </div>

            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-[#202124] tracking-tight">
                  {channel.title}
                </h1>
                <a
                  href={channel.customUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-[#5f6368] hover:text-[#1a73e8] flex items-center gap-1 bg-[#f1f3f4] hover:bg-[#e8f0fe] px-2 py-0.5 rounded-md transition-colors"
                >
                  <span>@{channel.handle}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <p className="text-xs text-[#5f6368] max-w-2xl line-clamp-1">
                {channel.description}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5f6368] pt-1">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#70757a]" />
                  <strong className="text-[#202124] font-semibold">{channel.subscribersFormatted}</strong> subscribers
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-[#70757a]" />
                  <strong className="text-[#202124] font-semibold">{channel.totalViewsFormatted}</strong> lifetime views
                </span>
                <span className="flex items-center gap-1">
                  <Film className="w-3.5 h-3.5 text-[#70757a]" />
                  <strong className="text-[#202124] font-semibold">{channel.totalVideos}</strong> uploads
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center flex-wrap gap-2 pt-2 md:pt-0">
            <button
              onClick={onGenerateReport}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-[#f1f3f4] border border-[#dadce0] text-[#3c4043] text-xs font-medium rounded-md shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1a73e8]" />
              <span>AI Weekly Report</span>
            </button>

            <button
              onClick={onOpenSchedule}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-[#f1f3f4] border border-[#dadce0] text-[#3c4043] text-xs font-medium rounded-md shadow-xs transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-[#5f6368]" />
              <span>Email Schedule</span>
            </button>

            <button
              onClick={onSendDigest}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-medium rounded-md shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Digest</span>
            </button>
          </div>

        </div>

        {/* Milestone Progress Bar */}
        {channel.nextMilestone && (
          <div className="mt-4 bg-[#f8f9fa] border border-[#dadce0] rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-md bg-[#1a73e8] text-white flex items-center justify-center shrink-0">
                <Award className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <div className="font-semibold text-[#202124] truncate">
                  Goal: {channel.nextMilestone.targetName}
                </div>
                <div className="text-[11px] text-[#5f6368]">
                  {formatFullNumber(channel.subscribers)} / {formatFullNumber(channel.nextMilestone.targetSubs)} • In ~{channel.nextMilestone.estimatedDaysLeft} days
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:w-60">
              <div className="flex-1 bg-[#e8eaed] h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#1a73e8] h-full rounded-full transition-all duration-500"
                  style={{ width: `${channel.nextMilestone.currentProgressPercent}%` }}
                />
              </div>
              <span className="font-medium text-[#1a73e8] font-mono text-[11px] shrink-0">
                {channel.nextMilestone.currentProgressPercent}%
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

