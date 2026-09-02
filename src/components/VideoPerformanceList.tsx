import React, { useState } from 'react';
import { 
  ExternalLink, 
  Sparkles, 
  Filter
} from 'lucide-react';
import { VideoPerformance } from '../types';
import { formatCompactNumber, formatDate } from '../utils/formatters';

interface VideoPerformanceListProps {
  videos: VideoPerformance[];
}

export const VideoPerformanceList: React.FC<VideoPerformanceListProps> = ({ videos }) => {
  const [filterType, setFilterType] = useState<'all' | 'long-form' | 'shorts' | 'live'>('all');
  const [sortBy, setSortBy] = useState<'views' | 'engagement' | 'ctr' | 'date'>('views');

  const filteredVideos = videos.filter(v => {
    if (filterType === 'all') return true;
    return v.type === filterType;
  }).sort((a, b) => {
    if (sortBy === 'views') return b.views - a.views;
    if (sortBy === 'engagement') return b.engagementRate - a.engagementRate;
    if (sortBy === 'ctr') return b.estimatedCtr - a.estimatedCtr;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'Viral Breakout':
        return 'bg-[#fef7e0] text-[#b06000] border-[#fce8b2]';
      case 'High Retention':
        return 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]';
      case 'Audience Favorite':
        return 'bg-[#f3e8fd] text-[#7627bb] border-[#e9d2fd]';
      case 'Steady Evergreen':
        return 'bg-[#e8f0fe] text-[#1a73e8] border-[#d2e3fc]';
      default:
        return 'bg-[#f1f3f4] text-[#3c4043] border-[#dadce0]';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Filter & Sort Bar */}
      <div className="bg-white p-3.5 rounded-lg border border-[#dadce0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#5f6368]" />
          <span className="text-xs font-semibold text-[#5f6368] uppercase tracking-wider">Format:</span>
          <div className="flex items-center bg-[#f1f3f4] p-0.5 rounded-md text-xs">
            {(['all', 'long-form', 'shorts', 'live'] as const).map((ft) => (
              <button
                key={ft}
                onClick={() => setFilterType(ft)}
                className={`px-3 py-1 rounded-md font-medium capitalize transition-all ${
                  filterType === ft
                    ? 'bg-white text-[#202124] shadow-xs font-medium'
                    : 'text-[#5f6368] hover:text-[#202124]'
                }`}
              >
                {ft === 'all' ? 'All Uploads' : ft}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#5f6368] font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-[#f8f9fa] border border-[#dadce0] rounded-md px-2.5 py-1 text-xs text-[#202124] font-medium focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
          >
            <option value="views">Most Views</option>
            <option value="engagement">Highest Engagement</option>
            <option value="ctr">Highest CTR</option>
            <option value="date">Most Recent</option>
          </select>
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-lg border border-[#dadce0] hover:border-[#1a73e8] transition-colors shadow-xs overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Thumbnail header */}
              <div className="relative aspect-video w-full bg-[#f1f3f4] overflow-hidden">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Duration badge */}
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white font-mono text-[11px]">
                  {video.duration}
                </span>

                {/* AI Badge */}
                {video.aiBadge && (
                  <span className={`absolute top-2 left-2 px-2.5 py-0.5 rounded-md text-[11px] font-medium border shadow-xs ${getBadgeColor(video.aiBadge)}`}>
                    {video.aiBadge}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-[#202124] line-clamp-2 leading-snug">
                    {video.title}
                  </h3>
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5f6368] hover:text-[#1a73e8] p-1 shrink-0"
                    title="Open on YouTube"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Metrics row */}
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#dadce0] text-center">
                  <div className="bg-[#f8f9fa] p-2 rounded-md border border-[#dadce0]">
                    <div className="text-[10px] text-[#5f6368] font-medium">Views</div>
                    <div className="text-xs font-bold text-[#202124] mt-0.5">
                      {formatCompactNumber(video.views)}
                    </div>
                  </div>

                  <div className="bg-[#f8f9fa] p-2 rounded-md border border-[#dadce0]">
                    <div className="text-[10px] text-[#5f6368] font-medium">Likes</div>
                    <div className="text-xs font-bold text-[#202124] mt-0.5">
                      {formatCompactNumber(video.likes)}
                    </div>
                  </div>

                  <div className="bg-[#f8f9fa] p-2 rounded-md border border-[#dadce0]">
                    <div className="text-[10px] text-[#5f6368] font-medium">CTR</div>
                    <div className="text-xs font-bold text-[#1a73e8] mt-0.5">
                      {video.estimatedCtr}%
                    </div>
                  </div>

                  <div className="bg-[#f8f9fa] p-2 rounded-md border border-[#dadce0]">
                    <div className="text-[10px] text-[#5f6368] font-medium">Retention</div>
                    <div className="text-xs font-bold text-[#1e8e3e] mt-0.5">
                      {video.avgPercentageViewed}%
                    </div>
                  </div>
                </div>

                {/* AI Takeaway */}
                {video.aiTakeaway && (
                  <div className="bg-[#f8f9fa] border border-[#dadce0] rounded-md p-2.5 text-[11px] text-[#3c4043] leading-relaxed flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#1a73e8] shrink-0 mt-0.5" />
                    <div>
                      <strong>Key Insight: </strong>{video.aiTakeaway}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-4 py-2.5 bg-[#f8f9fa] border-t border-[#dadce0] text-[11px] text-[#5f6368] flex items-center justify-between">
              <span>Published: {formatDate(video.publishedAt)}</span>
              <span className="font-semibold text-[#3c4043] uppercase tracking-wider text-[10px]">
                {video.type}
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

