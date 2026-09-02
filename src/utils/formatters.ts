export function formatCompactNumber(num: number): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  if (Math.abs(num) >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (Math.abs(num) >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (Math.abs(num) >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toLocaleString();
}

export function formatFullNumber(num: number): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return num.toLocaleString();
}

export function formatPercent(num: number, includeSign: boolean = true): string {
  if (num === undefined || num === null || isNaN(num)) return '0%';
  const sign = includeSign && num > 0 ? '+' : '';
  return `${sign}${num.toFixed(1)}%`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
    
    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 2592000) return `${Math.floor(diffSec / 86400)}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
}

export function extractYoutubeHandleOrId(input: string): { type: 'handle' | 'channelId' | 'custom' | 'unknown'; value: string } {
  const trimmed = input.trim();
  
  if (trimmed.startsWith('@')) {
    return { type: 'handle', value: trimmed.replace('@', '') };
  }
  
  // Handle youtube.com/@handle
  const handleMatch = trimmed.match(/youtube\.com\/@([a-zA-Z0-9_\-.]+)/i);
  if (handleMatch) {
    return { type: 'handle', value: handleMatch[1] };
  }
  
  // Handle youtube.com/channel/UCxxxxxx
  const channelMatch = trimmed.match(/youtube\.com\/channel\/(UC[a-zA-Z0-9_\-]+)/i);
  if (channelMatch) {
    return { type: 'channelId', value: channelMatch[1] };
  }
  
  // Handle youtube.com/c/custom or youtube.com/user/username
  const customMatch = trimmed.match(/youtube\.com\/(?:c|user)\/([a-zA-Z0-9_\-]+)/i);
  if (customMatch) {
    return { type: 'custom', value: customMatch[1] };
  }
  
  // Handle youtu.be or youtube.com/watch?v=...
  const videoMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_\-]+)/i);
  if (videoMatch) {
    return { type: 'custom', value: `video:${videoMatch[1]}` };
  }
  
  // Clean alphanumeric handle candidate
  if (/^[a-zA-Z0-9_\-.]+$/.test(trimmed)) {
    return { type: 'handle', value: trimmed };
  }
  
  return { type: 'unknown', value: trimmed };
}

export function generateMockDailyHistory(
  baseSubscribers: number,
  baseViews: number,
  days: number = 30
) {
  const points = [];
  const now = new Date();
  
  let currentSubs = baseSubscribers - (days * 1200);
  let cumulativeViews = baseViews - (days * 180000);
  
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    
    // Slight variance with realistic weekend bumps
    const dayOfWeek = d.getDay();
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.35 : 1.0;
    
    const dailySubs = Math.floor((1000 + Math.random() * 800) * weekendMultiplier);
    const dailyViews = Math.floor((120000 + Math.random() * 95000) * weekendMultiplier);
    const shortsViews = Math.floor(dailyViews * 0.42);
    const longFormViews = dailyViews - shortsViews;
    const watchTime = Math.floor(dailyViews * 0.09); // Approx ~5.4 min avg
    const engagementRate = +(4.8 + Math.random() * 2.2).toFixed(2);
    
    currentSubs += dailySubs;
    cumulativeViews += dailyViews;
    
    points.push({
      date: d.toISOString().split('T')[0],
      subscribers: currentSubs,
      netSubs: dailySubs,
      views: dailyViews,
      watchTimeHours: watchTime,
      engagementRate,
      shortsViews,
      longFormViews,
    });
  }
  
  return points;
}
