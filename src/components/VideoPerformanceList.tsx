import React, { useState } from 'react';
import { 
  ExternalLink, 
  Sparkles, 
  Filter,
  Search,
  Video,
  Smartphone,
  Radio,
  Table as TableIcon,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Eye,
  ThumbsUp,
  MessageSquare,
  BarChart2,
  Clock,
  Zap,
  TrendingUp,
  ArrowUpDown
} from 'lucide-react';
import { VideoPerformance } from '../types';
import { formatCompactNumber, formatFullNumber, formatDate, formatRelativeTime } from '../utils/formatters';

type SortField = 'views' | 'engagement' | 'ctr' | 'retention' | 'date' | 'title' | 'type';

interface VideoPerformanceListProps {
  videos: VideoPerformance[];
}

export const VideoPerformanceList: React.FC<VideoPerformanceListProps> = ({ videos }) => {
  const [filterType, setFilterType] = useState<'all' | 'long-form' | 'shorts' | 'live'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('views');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [expandedVideoId, setExpandedVideoId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter & Search videos
  const filteredVideos = videos.filter(v => {
    const matchesType = filterType === 'all' || v.type === filterType;
    const matchesSearch = searchQuery === '' || 
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.aiTakeaway && v.aiTakeaway.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.aiBadge && v.aiBadge.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // Sort videos
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    let compA: any;
    let compB: any;

    if (sortBy === 'views') {
      compA = a.views;
      compB = b.views;
    } else if (sortBy === 'engagement') {
      compA = a.engagementRate;
      compB = b.engagementRate;
    } else if (sortBy === 'ctr') {
      compA = a.estimatedCtr;
      compB = b.estimatedCtr;
    } else if (sortBy === 'retention') {
      compA = a.avgPercentageViewed;
      compB = b.avgPercentageViewed;
    } else if (sortBy === 'date') {
      compA = new Date(a.publishedAt).getTime();
      compB = new Date(b.publishedAt).getTime();
    } else if (sortBy === 'type') {
      compA = a.type;
      compB = b.type;
    } else {
      compA = a.title.toLowerCase();
      compB = b.title.toLowerCase();
    }

    if (compA < compB) return sortOrder === 'asc' ? -1 : 1;
    if (compA > compB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleHeaderSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      // Text fields default to asc on first click, numeric and date fields default to desc
      if (field === 'title' || field === 'type') {
        setSortOrder('asc');
      } else {
        setSortOrder('desc');
      }
    }
  };

  const renderSortHeader = (
    field: SortField,
    label: string,
    align: 'left' | 'center' | 'right' = 'left'
  ) => {
    const isActive = sortBy === field;
    return (
      <button
        type="button"
        onClick={() => handleHeaderSort(field)}
        className={`group inline-flex items-center gap-1.5 py-1 px-2 rounded-md transition-all select-none hover:bg-[#e8f0fe] cursor-pointer ${
          align === 'right' ? 'ml-auto justify-end' : align === 'center' ? 'mx-auto justify-center' : 'justify-start'
        } ${
          isActive 
            ? 'text-[#1a73e8] font-bold bg-[#e8f0fe] border border-[#d2e3fc]' 
            : 'text-[#5f6368] hover:text-[#202124]'
        }`}
        title={`Sort by ${label} (${isActive ? (sortOrder === 'desc' ? 'Descending - click to invert' : 'Ascending - click to invert') : 'click to sort'})`}
      >
        <span>{label}</span>
        {isActive ? (
          sortOrder === 'desc' ? (
            <ChevronDown className="w-3.5 h-3.5 text-[#1a73e8] stroke-[2.5] shrink-0" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-[#1a73e8] stroke-[2.5] shrink-0" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3 text-[#70757a] opacity-50 group-hover:opacity-100 transition-opacity shrink-0" />
        )}
      </button>
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedVideoId(prev => prev === id ? null : id);
  };

  const handleCopyUrl = (url: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Aggregate stats for filtered videos
  const totalViews = filteredVideos.reduce((sum, v) => sum + v.views, 0);
  const totalLikes = filteredVideos.reduce((sum, v) => sum + v.likes, 0);
  const totalComments = filteredVideos.reduce((sum, v) => sum + v.comments, 0);
  const avgEngagement = filteredVideos.length 
    ? (filteredVideos.reduce((sum, v) => sum + v.engagementRate, 0) / filteredVideos.length).toFixed(1)
    : '0';
  const avgCtr = filteredVideos.length
    ? (filteredVideos.reduce((sum, v) => sum + v.estimatedCtr, 0) / filteredVideos.length).toFixed(1)
    : '0';
  const avgRetention = filteredVideos.length
    ? (filteredVideos.reduce((sum, v) => sum + v.avgPercentageViewed, 0) / filteredVideos.length).toFixed(1)
    : '0';

  // Counts by type
  const counts = {
    all: videos.length,
    'long-form': videos.filter(v => v.type === 'long-form').length,
    shorts: videos.filter(v => v.type === 'shorts').length,
    live: videos.filter(v => v.type === 'live').length,
  };

  const getTypeBadge = (type: 'long-form' | 'shorts' | 'live') => {
    switch (type) {
      case 'long-form':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Video className="w-3 h-3 text-blue-600" />
            <span>Long-Form</span>
          </span>
        );
      case 'shorts':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Smartphone className="w-3 h-3 text-purple-600" />
            <span>Shorts</span>
          </span>
        );
      case 'live':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <Radio className="w-3 h-3 text-rose-600 animate-pulse" />
            <span>Live Stream</span>
          </span>
        );
    }
  };

  const getAiBadgeStyle = (badge?: string) => {
    switch (badge) {
      case 'Viral Breakout':
        return 'bg-[#fef7e0] text-[#b06000] border-[#fce8b2]';
      case 'High Retention':
        return 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]';
      case 'Audience Favorite':
        return 'bg-[#f3e8fd] text-[#7627bb] border-[#e9d2fd]';
      case 'Steady Evergreen':
        return 'bg-[#e8f0fe] text-[#1a73e8] border-[#d2e3fc]';
      case 'Underperforming':
        return 'bg-[#fce8e6] text-[#c5221f] border-[#fad2cf]';
      default:
        return 'bg-[#f1f3f4] text-[#3c4043] border-[#dadce0]';
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Header Banner & Filter Tabs */}
      <div className="bg-white rounded-xl border border-[#dadce0] p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#dadce0] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-[#202124]">
                Video & Upload Performance Matrix
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc]">
                {filteredVideos.length} {filteredVideos.length === 1 ? 'Video' : 'Videos'} Listed
              </span>
            </div>
            <p className="text-xs text-[#5f6368] mt-0.5">
              Comprehensive telemetry table for uploaded videos, YouTube Shorts, and past Live Streams
            </p>
          </div>

          {/* Aggregate Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#f8f9fa] px-3 py-2 rounded-lg border border-[#dadce0]">
              <span className="text-[10px] text-[#5f6368] font-medium block">Total Views</span>
              <span className="font-bold text-[#202124] text-sm">{formatCompactNumber(totalViews)}</span>
            </div>
            <div className="bg-[#f8f9fa] px-3 py-2 rounded-lg border border-[#dadce0]">
              <span className="text-[10px] text-[#5f6368] font-medium block">Avg Engagement</span>
              <span className="font-bold text-[#1a73e8] text-sm">{avgEngagement}%</span>
            </div>
            <div className="bg-[#f8f9fa] px-3 py-2 rounded-lg border border-[#dadce0]">
              <span className="text-[10px] text-[#5f6368] font-medium block">Avg CTR</span>
              <span className="font-bold text-[#137333] text-sm">{avgCtr}%</span>
            </div>
            <div className="bg-[#f8f9fa] px-3 py-2 rounded-lg border border-[#dadce0]">
              <span className="text-[10px] text-[#5f6368] font-medium block">Avg Retention</span>
              <span className="font-bold text-[#7627bb] text-sm">{avgRetention}%</span>
            </div>
          </div>
        </div>

        {/* Content Type Selector & Search Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Format Tabs */}
          <div className="flex items-center gap-1 bg-[#f1f3f4] p-1 rounded-lg text-xs overflow-x-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                filterType === 'all'
                  ? 'bg-white text-[#202124] shadow-xs font-semibold'
                  : 'text-[#5f6368] hover:text-[#202124]'
              }`}
            >
              <span>All Content</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filterType === 'all' ? 'bg-[#e8f0fe] text-[#1a73e8]' : 'bg-gray-200 text-gray-700'}`}>
                {counts.all}
              </span>
            </button>

            <button
              onClick={() => setFilterType('long-form')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                filterType === 'long-form'
                  ? 'bg-white text-[#202124] shadow-xs font-semibold'
                  : 'text-[#5f6368] hover:text-[#202124]'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-blue-600" />
              <span>Uploaded Long-Form</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filterType === 'long-form' ? 'bg-[#e8f0fe] text-[#1a73e8]' : 'bg-gray-200 text-gray-700'}`}>
                {counts['long-form']}
              </span>
            </button>

            <button
              onClick={() => setFilterType('shorts')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                filterType === 'shorts'
                  ? 'bg-white text-[#202124] shadow-xs font-semibold'
                  : 'text-[#5f6368] hover:text-[#202124]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-purple-600" />
              <span>YouTube Shorts</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filterType === 'shorts' ? 'bg-[#e8f0fe] text-[#1a73e8]' : 'bg-gray-200 text-gray-700'}`}>
                {counts.shorts}
              </span>
            </button>

            <button
              onClick={() => setFilterType('live')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                filterType === 'live'
                  ? 'bg-white text-[#202124] shadow-xs font-semibold'
                  : 'text-[#5f6368] hover:text-[#202124]'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-rose-600" />
              <span>Live Streams</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filterType === 'live' ? 'bg-[#e8f0fe] text-[#1a73e8]' : 'bg-gray-200 text-gray-700'}`}>
                {counts.live}
              </span>
            </button>
          </div>

          {/* Search, Sort & View Mode Controls */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Search Box */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5f6368]" />
              <input
                type="text"
                placeholder="Search video title or insight..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#f8f9fa] border border-[#dadce0] rounded-lg text-xs text-[#202124] focus:outline-none focus:ring-1 focus:ring-[#1a73e8] focus:bg-white"
              />
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-1 text-xs">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-[#f8f9fa] border border-[#dadce0] rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#202124] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
              >
                <option value="views">Most Views</option>
                <option value="engagement">Highest Engagement</option>
                <option value="ctr">Highest CTR</option>
                <option value="retention">Highest Retention</option>
                <option value="date">Upload Date</option>
                <option value="title">Title A-Z</option>
                <option value="type">Format Type</option>
              </select>

              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-1.5 bg-[#f8f9fa] border border-[#dadce0] rounded-lg hover:bg-[#f1f3f4] text-[#5f6368] transition-colors"
                title={`Sort Direction: ${sortOrder === 'desc' ? 'Descending (High to Low)' : 'Ascending (Low to High)'}`}
              >
                {sortOrder === 'desc' ? <ChevronDown className="w-3.5 h-3.5 text-[#1a73e8]" /> : <ChevronUp className="w-3.5 h-3.5 text-[#1a73e8]" />}
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-[#f1f3f4] p-0.5 rounded-lg border border-[#dadce0]">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-white shadow-2xs text-[#1a73e8]' : 'text-[#5f6368] hover:text-[#202124]'}`}
                title="Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-2xs text-[#1a73e8]' : 'text-[#5f6368] hover:text-[#202124]'}`}
                title="Grid Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-[#dadce0] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9fa] border-b border-[#dadce0] text-[11px] font-bold text-[#5f6368] uppercase tracking-wider select-none">
                  <th className="py-2.5 px-3 w-12 text-center">#</th>
                  <th className="py-2.5 px-3 w-72">
                    {renderSortHeader('title', 'Video & Title', 'left')}
                  </th>
                  <th className="py-2.5 px-3 text-center">
                    {renderSortHeader('type', 'Format', 'center')}
                  </th>
                  <th className="py-2.5 px-3">
                    {renderSortHeader('date', 'Published', 'left')}
                  </th>
                  <th className="py-2.5 px-3 text-right">
                    {renderSortHeader('views', 'Views', 'right')}
                  </th>
                  <th className="py-2.5 px-3 text-center text-[#5f6368]">
                    Likes & Comments
                  </th>
                  <th className="py-2.5 px-3 text-right">
                    {renderSortHeader('engagement', 'Engagement', 'right')}
                  </th>
                  <th className="py-2.5 px-3 text-right">
                    {renderSortHeader('ctr', 'CTR', 'right')}
                  </th>
                  <th className="py-2.5 px-3 text-right">
                    {renderSortHeader('retention', 'Avg Retention', 'right')}
                  </th>
                  <th className="py-2.5 px-3 text-center text-[#5f6368]">
                    Performance AI
                  </th>
                  <th className="py-2.5 px-3 w-10 text-center text-[#5f6368]">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dadce0] text-xs">
                {sortedVideos.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-[#5f6368]">
                      No videos found matching current search query or format filter.
                    </td>
                  </tr>
                ) : (
                  sortedVideos.map((v, idx) => {
                    const isExpanded = expandedVideoId === v.id;
                    const estWatchHours = Math.round((v.views * (parseInt(v.duration) || 10)) / 60);

                    return (
                      <React.Fragment key={v.id}>
                        <tr 
                          onClick={() => toggleExpand(v.id)}
                          className={`hover:bg-[#f8f9fa] transition-colors cursor-pointer ${isExpanded ? 'bg-[#f1f3f4]/70 font-medium' : ''}`}
                        >
                          {/* Row Index */}
                          <td className="py-3 px-3 text-center font-mono text-[#5f6368] font-medium text-[11px]">
                            {idx + 1}
                          </td>

                          {/* Thumbnail & Title */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-3">
                              <div className="relative w-20 aspect-video rounded-md overflow-hidden bg-gray-100 shrink-0 border border-[#dadce0] shadow-2xs">
                                <img
                                  src={v.thumbnailUrl}
                                  alt={v.title}
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-white font-mono text-[9px]">
                                  {v.duration}
                                </span>
                              </div>
                              <div className="min-w-0 pr-2">
                                <a
                                  href={v.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="font-bold text-[#202124] hover:text-[#1a73e8] line-clamp-2 leading-snug flex items-center gap-1 group"
                                >
                                  <span>{v.title}</span>
                                  <ExternalLink className="w-3 h-3 text-[#5f6368] group-hover:text-[#1a73e8] shrink-0" />
                                </a>
                                <span className="text-[10px] text-[#5f6368] font-mono block mt-0.5">
                                  ID: {v.id}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Format Tag */}
                          <td className="py-3 px-3 text-center">
                            {getTypeBadge(v.type)}
                          </td>

                          {/* Published Date */}
                          <td className="py-3 px-3 font-mono text-[#3c4043] whitespace-nowrap">
                            <div className="font-semibold text-[11px]">{formatDate(v.publishedAt)}</div>
                            <div className="text-[10px] text-[#5f6368]">{formatRelativeTime(v.publishedAt)}</div>
                          </td>

                          {/* Views */}
                          <td className="py-3 px-3 text-right font-mono font-bold text-[#202124] text-xs">
                            {formatFullNumber(v.views)}
                          </td>

                          {/* Likes & Comments */}
                          <td className="py-3 px-3 text-center font-mono text-[11px]">
                            <div className="flex items-center justify-center gap-2 text-[#3c4043]">
                              <span className="flex items-center gap-1" title={`${formatFullNumber(v.likes)} Likes`}>
                                <ThumbsUp className="w-3 h-3 text-[#5f6368]" />
                                <span>{formatCompactNumber(v.likes)}</span>
                              </span>
                              <span className="text-gray-300">|</span>
                              <span className="flex items-center gap-1" title={`${formatFullNumber(v.comments)} Comments`}>
                                <MessageSquare className="w-3 h-3 text-[#5f6368]" />
                                <span>{formatCompactNumber(v.comments)}</span>
                              </span>
                            </div>
                          </td>

                          {/* Engagement Rate */}
                          <td className="py-3 px-3 text-right font-mono font-bold text-[#1a73e8]">
                            {v.engagementRate}%
                          </td>

                          {/* Estimated CTR */}
                          <td className="py-3 px-3 text-right font-mono">
                            <span className="px-1.5 py-0.5 rounded font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {v.estimatedCtr}%
                            </span>
                          </td>

                          {/* Avg Retention */}
                          <td className="py-3 px-3 text-right font-mono">
                            <div className="flex flex-col items-end gap-1">
                              <span className="font-bold text-[#202124]">{v.avgPercentageViewed}%</span>
                              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-emerald-600 rounded-full" 
                                  style={{ width: `${Math.min(100, v.avgPercentageViewed)}%` }} 
                                />
                              </div>
                            </div>
                          </td>

                          {/* Performance AI Badge */}
                          <td className="py-3 px-3 text-center">
                            {v.aiBadge ? (
                              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${getAiBadgeStyle(v.aiBadge)}`}>
                                {v.aiBadge}
                              </span>
                            ) : (
                              <span className="text-[10px] text-gray-400 font-mono">Standard</span>
                            )}
                          </td>

                          {/* Toggle Expand Icon */}
                          <td className="py-3 px-3 text-center text-[#5f6368]">
                            <button className="p-1 hover:bg-gray-200 rounded">
                              {isExpanded ? <ChevronUp className="w-4 h-4 text-[#1a73e8]" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>

                        {/* Expanded Drawer Details Row */}
                        {isExpanded && (
                          <tr className="bg-[#f8f9fa] border-b-2 border-[#1a73e8]/30">
                            <td colSpan={11} className="p-4">
                              <div className="bg-white rounded-lg border border-[#dadce0] p-4 shadow-xs space-y-3">
                                
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#dadce0] pb-3">
                                  <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-[#1a73e8]" />
                                    <h4 className="text-xs font-bold text-[#202124]">
                                      Detailed Telemetry & Algorithmic Diagnosis
                                    </h4>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={(e) => handleCopyUrl(v.url, v.id, e)}
                                      className="px-2.5 py-1 bg-[#f8f9fa] hover:bg-[#e8f0fe] border border-[#dadce0] text-[#3c4043] hover:text-[#1a73e8] text-[11px] font-medium rounded-md transition-colors flex items-center gap-1"
                                    >
                                      {copiedId === v.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                      <span>{copiedId === v.id ? 'Copied URL!' : 'Copy Video Link'}</span>
                                    </button>

                                    <a
                                      href={v.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2.5 py-1 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[11px] font-medium rounded-md transition-colors flex items-center gap-1"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      <span>Watch on YouTube</span>
                                    </a>
                                  </div>
                                </div>

                                {/* Key Insight Box */}
                                {v.aiTakeaway && (
                                  <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-3 text-xs text-blue-900 leading-relaxed flex items-start gap-2.5">
                                    <Zap className="w-4 h-4 text-[#1a73e8] shrink-0 mt-0.5" />
                                    <div>
                                      <strong className="font-bold text-[#1a73e8]">AI Growth Insight: </strong>
                                      {v.aiTakeaway}
                                    </div>
                                  </div>
                                )}

                                {/* Metrics Breakdown Cards */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                                  <div className="bg-[#f8f9fa] p-2.5 rounded-lg border border-[#dadce0]">
                                    <span className="text-[10px] text-[#5f6368] font-medium block">Est. Watch Time</span>
                                    <span className="font-bold text-[#202124] text-xs font-mono">{formatFullNumber(estWatchHours)} Hours</span>
                                  </div>

                                  <div className="bg-[#f8f9fa] p-2.5 rounded-lg border border-[#dadce0]">
                                    <span className="text-[10px] text-[#5f6368] font-medium block">Likes-to-Views Ratio</span>
                                    <span className="font-bold text-[#202124] text-xs font-mono">{((v.likes / Math.max(1, v.views)) * 100).toFixed(2)}%</span>
                                  </div>

                                  <div className="bg-[#f8f9fa] p-2.5 rounded-lg border border-[#dadce0]">
                                    <span className="text-[10px] text-[#5f6368] font-medium block">Comment Rate</span>
                                    <span className="font-bold text-[#202124] text-xs font-mono">{((v.comments / Math.max(1, v.views)) * 100).toFixed(2)}%</span>
                                  </div>

                                  <div className="bg-[#f8f9fa] p-2.5 rounded-lg border border-[#dadce0]">
                                    <span className="text-[10px] text-[#5f6368] font-medium block">Format Categorization</span>
                                    <span className="font-bold text-[#202124] text-xs uppercase font-mono">{v.type}</span>
                                  </div>
                                </div>

                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Alternative Grid Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedVideos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-xl border border-[#dadce0] hover:border-[#1a73e8] transition-colors shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full bg-[#f1f3f4] overflow-hidden">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white font-mono text-[11px]">
                    {video.duration}
                  </span>

                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    {getTypeBadge(video.type)}
                  </div>

                  {video.aiBadge && (
                    <span className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-md text-[11px] font-bold border shadow-xs ${getAiBadgeStyle(video.aiBadge)}`}>
                      {video.aiBadge}
                    </span>
                  )}
                </div>

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

                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#dadce0] text-center font-mono">
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
                      <div className="text-xs font-bold text-[#137333] mt-0.5">
                        {video.avgPercentageViewed}%
                      </div>
                    </div>
                  </div>

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
      )}

    </div>
  );
};
