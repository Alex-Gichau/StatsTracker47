export interface ChannelMetricPoint {
  date: string;
  subscribers: number;
  netSubs: number;
  views: number;
  watchTimeHours: number;
  engagementRate: number;
  shortsViews?: number;
  longFormViews?: number;
}

export interface VideoPerformance {
  id: string;
  title: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
  duration: string;
  thumbnailUrl: string;
  url: string;
  type: 'long-form' | 'shorts' | 'live';
  engagementRate: number;
  estimatedCtr: number;
  avgPercentageViewed: number;
  aiBadge?: 'Viral Breakout' | 'High Retention' | 'Steady Evergreen' | 'Underperforming' | 'Audience Favorite';
  aiTakeaway?: string;
}

export interface AudienceDemographics {
  topCountries: { country: string; percentage: number }[];
  ageGroups: { range: string; percentage: number }[];
  gender: { male: number; female: number; other: number };
  trafficSources: { source: string; percentage: number }[];
  subscribedVsNot: { subscribed: number; notSubscribed: number };
}

export interface ChannelData {
  id: string;
  handle: string;
  title: string;
  customUrl: string;
  description: string;
  avatarUrl: string;
  bannerUrl: string;
  verified: boolean;
  country: string;
  joinedDate: string;
  category: string;
  subscribers: number;
  subscribersFormatted: string;
  totalViews: number;
  totalViewsFormatted: string;
  totalVideos: number;
  
  // Growth & velocity
  weeklySubGain: number;
  weeklyViewGain: number;
  weeklyWatchTimeGain: number;
  avgViewsPerVideo: number;
  avgEngagementRate: number;
  avgCtr: number;
  
  // Historical data
  history30d: ChannelMetricPoint[];
  history90d?: ChannelMetricPoint[];
  
  // Videos
  recentVideos: VideoPerformance[];
  
  // Demographics & Heatmap
  demographics: AudienceDemographics;
  uploadHeatmap: { day: string; hour: number; score: number }[];
  
  // Next Milestones
  nextMilestone: {
    targetSubs: number;
    targetName: string;
    estimatedDaysLeft: number;
    currentProgressPercent: number;
  };
}

export interface WeeklyReport {
  id: string;
  channelId: string;
  channelTitle: string;
  channelHandle: string;
  weekRange: string;
  generatedAt: string;
  performanceScore: number; // 0 - 100
  scoreGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
  scoreDelta: number; // e.g. +4 from last week
  
  executiveSummary: string;
  
  highlights: {
    title: string;
    metric: string;
    description: string;
    isPositive: boolean;
  }[];
  
  growthAnalysis: {
    subscribersGain: number;
    subscribersGainPercentage: number;
    viewsGain: number;
    viewsGainPercentage: number;
    watchTimeHoursGain: number;
    watchTimeGainPercentage: number;
    avdFormatted: string;
  };
  
  engagementBreakdown: {
    engagementRate: number;
    likesToViewsRatio: number;
    commentSentimentScore: number; // 0 - 100
    topRetentionTopic: string;
  };
  
  topPerformerVideo: {
    title: string;
    views: number;
    likeRatio: number;
    thumbnailUrl: string;
    whyItWorked: string;
  };
  
  strategicRecommendations: {
    category: 'Content Topic' | 'Thumbnail & Title' | 'Audience Retention' | 'Upload Timing' | 'Shorts Strategy';
    headline: string;
    details: string;
    potentialImpact: 'High' | 'Medium' | 'Critical';
  }[];
  
  emailHtmlPreview?: string;
  emailSubject: string;
}

export interface EmailScheduleSettings {
  id: string;
  channelId: string;
  recipientEmail: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  timeUtc: string; // e.g. "09:00"
  format: 'rich-html' | 'compact-summary' | 'executive-digest';
  includeRecommendations: boolean;
  includeVideoScorecard: boolean;
  alertOnSpikes: boolean;
  spikeThresholdPercent: number;
  isActive: boolean;
  lastSentAt?: string;
  nextScheduledAt: string;
}

export interface EmailDeliveryLog {
  id: string;
  trackingId: string;
  channelId?: string;
  channelTitle: string;
  recipientEmail: string;
  subject: string;
  sentAt: string;
  status: 'DELIVERED' | 'SCHEDULED' | 'FAILED' | 'OPENED';
  reportWeek?: string;
  performanceScore: number;
  openCount?: number;
}

export interface ProcessLog {
  id: string;
  timestamp: string;
  category: 'API' | 'BRANDING' | 'TELEMETRY' | 'MEET' | 'AI' | 'SYSTEM';
  level: 'info' | 'success' | 'warn' | 'error';
  message: string;
  details?: any;
}

export interface ApiKeysState {
  youtubeApiKeyConfigured: boolean;
  youtubeKeySource: 'env' | 'custom' | 'none';
  googleMeetApiKeyConfigured: boolean;
  googleMeetKeySource: 'env' | 'custom' | 'none';
  youtubeQuotaUnitsUsed: number;
  googleMeetSessionsCount: number;
  isLiveApiMode: boolean;
  customYoutubeKey?: string;
  customGoogleMeetKey?: string;
}

export interface GoogleMeetSession {
  id: string;
  title: string;
  date: string;
  durationMinutes: number;
  attendeesCount: number;
  satisfactionScore: number;
  channelId?: string;
  channelTitle?: string;
  notes?: string;
}

export interface DashboardFilterState {
  timeframe: '7d' | '14d' | '30d' | '90d' | '1y';
  contentType?: 'all' | 'long-form' | 'shorts' | 'live';
  videoType?: 'all' | 'long-form' | 'shorts' | 'live';
  activeTab: 'overview' | 'growth' | 'engagement' | 'reports' | 'videos' | 'meet' | 'schedule' | 'integrations' | 'compare';
}
