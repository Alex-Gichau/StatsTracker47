import { ChannelData } from '../types';

export const DEFAULT_CHANNELS: ChannelData[] = [
  {
    id: 'mkbhd',
    handle: 'mkbhd',
    title: 'Marques Brownlee',
    customUrl: 'https://youtube.com/@mkbhd',
    description: 'Quality tech videos | YouTuber | Geek | Consumer Electronics reviews and deep dives.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    verified: true,
    country: 'United States',
    joinedDate: 'Mar 21, 2008',
    category: 'Science & Technology',
    subscribers: 19100000,
    subscribersFormatted: '19.1M',
    totalViews: 4280000000,
    totalViewsFormatted: '4.28B',
    totalVideos: 1680,
    
    weeklySubGain: 35000,
    weeklyViewGain: 14200000,
    weeklyWatchTimeGain: 1180000,
    avgViewsPerVideo: 2850000,
    avgEngagementRate: 6.8,
    avgCtr: 9.4,
    
    history30d: [
      { date: '2026-08-04', subscribers: 18950000, netSubs: 4200, views: 1820000, watchTimeHours: 154000, engagementRate: 6.7, shortsViews: 680000, longFormViews: 1140000 },
      { date: '2026-08-07', subscribers: 18965000, netSubs: 5100, views: 2150000, watchTimeHours: 182000, engagementRate: 7.1, shortsViews: 850000, longFormViews: 1300000 },
      { date: '2026-08-10', subscribers: 18980000, netSubs: 4800, views: 1980000, watchTimeHours: 168000, engagementRate: 6.9, shortsViews: 740000, longFormViews: 1240000 },
      { date: '2026-08-13', subscribers: 18998000, netSubs: 6200, views: 2480000, watchTimeHours: 210000, engagementRate: 7.4, shortsViews: 990000, longFormViews: 1490000 },
      { date: '2026-08-16', subscribers: 19015000, netSubs: 5600, views: 2260000, watchTimeHours: 191000, engagementRate: 7.0, shortsViews: 880000, longFormViews: 1380000 },
      { date: '2026-08-19', subscribers: 19032000, netSubs: 5400, views: 2190000, watchTimeHours: 185000, engagementRate: 6.8, shortsViews: 820000, longFormViews: 1370000 },
      { date: '2026-08-22', subscribers: 19052000, netSubs: 6800, views: 2790000, watchTimeHours: 236000, engagementRate: 7.6, shortsViews: 1120000, longFormViews: 1670000 },
      { date: '2026-08-25', subscribers: 19070000, netSubs: 5900, views: 2350000, watchTimeHours: 198000, engagementRate: 7.2, shortsViews: 910000, longFormViews: 1440000 },
      { date: '2026-08-28', subscribers: 19088000, netSubs: 5800, views: 2410000, watchTimeHours: 204000, engagementRate: 7.0, shortsViews: 960000, longFormViews: 1450000 },
      { date: '2026-08-31', subscribers: 19100000, netSubs: 6100, views: 2540000, watchTimeHours: 215000, engagementRate: 7.3, shortsViews: 1040000, longFormViews: 1500000 },
    ],
    
    recentVideos: [
      {
        id: 'v1',
        title: 'The Real Problem With New Smartphones in 2026',
        publishedAt: '2026-08-29T17:00:00Z',
        views: 3420000,
        likes: 184000,
        comments: 11200,
        duration: '14:22',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
        url: 'https://youtube.com/watch?v=mock1',
        type: 'long-form',
        engagementRate: 8.2,
        estimatedCtr: 11.4,
        avgPercentageViewed: 64.2,
        aiBadge: 'Viral Breakout',
        aiTakeaway: 'High click-through driven by polarizing hardware critique + 64% retention through mid-video chapter breakdown.'
      },
      {
        id: 'v2',
        title: 'Next-Gen Neural Glasses: 48 Hours Later!',
        publishedAt: '2026-08-23T16:30:00Z',
        views: 2890000,
        likes: 142000,
        comments: 8900,
        duration: '11:45',
        thumbnailUrl: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600&auto=format&fit=crop&q=80',
        url: 'https://youtube.com/watch?v=mock2',
        type: 'long-form',
        engagementRate: 7.4,
        estimatedCtr: 9.8,
        avgPercentageViewed: 58.6,
        aiBadge: 'High Retention',
        aiTakeaway: 'Real-world outdoor camera comparison held audience attention above baseline benchmark.'
      },
      {
        id: 'v3',
        title: 'This Hidden Setting Changes Everything #Shorts',
        publishedAt: '2026-08-27T19:00:00Z',
        views: 1850000,
        likes: 125000,
        comments: 3400,
        duration: '0:52',
        thumbnailUrl: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80',
        url: 'https://youtube.com/shorts/mock3',
        type: 'shorts',
        engagementRate: 9.1,
        estimatedCtr: 14.2,
        avgPercentageViewed: 92.4,
        aiBadge: 'Viral Breakout',
        aiTakeaway: 'Immediate 3-second hook resulted in 92% completion rate and strong subscriber conversion.'
      },
      {
        id: 'v4',
        title: 'Studio Desk Setup Tour: Minimalist 2026 Edition',
        publishedAt: '2026-08-15T18:00:00Z',
        views: 2100000,
        likes: 118000,
        comments: 6200,
        duration: '16:10',
        thumbnailUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
        url: 'https://youtube.com/watch?v=mock4',
        type: 'long-form',
        engagementRate: 6.9,
        estimatedCtr: 8.5,
        avgPercentageViewed: 52.1,
        aiBadge: 'Steady Evergreen',
        aiTakeaway: 'Consistent search traffic from desk setup & cable management keywords.'
      }
    ],
    
    demographics: {
      topCountries: [
        { country: 'United States', percentage: 41 },
        { country: 'United Kingdom', percentage: 12 },
        { country: 'India', percentage: 11 },
        { country: 'Canada', percentage: 9 },
        { country: 'Germany', percentage: 6 }
      ],
      ageGroups: [
        { range: '18-24', percentage: 28 },
        { range: '25-34', percentage: 46 },
        { range: '35-44', percentage: 18 },
        { range: '45+', percentage: 8 }
      ],
      gender: { male: 78, female: 19, other: 3 },
      trafficSources: [
        { source: 'Suggested Videos', percentage: 44 },
        { source: 'Browse Features / Home', percentage: 31 },
        { source: 'YouTube Search', percentage: 16 },
        { source: 'External & Direct', percentage: 9 }
      ],
      subscribedVsNot: { subscribed: 36, notSubscribed: 64 }
    },
    
    uploadHeatmap: [
      { day: 'Mon', hour: 17, score: 78 },
      { day: 'Tue', hour: 16, score: 82 },
      { day: 'Wed', hour: 18, score: 88 },
      { day: 'Thu', hour: 17, score: 96 },
      { day: 'Fri', hour: 15, score: 92 },
      { day: 'Sat', hour: 14, score: 85 },
      { day: 'Sun', hour: 16, score: 80 }
    ],
    
    nextMilestone: {
      targetSubs: 20000000,
      targetName: '20 Million Subscribers',
      estimatedDaysLeft: 182,
      currentProgressPercent: 91.0
    }
  },
  
  {
    id: 'veritasium',
    handle: 'veritasium',
    title: 'Veritasium',
    customUrl: 'https://youtube.com/@veritasium',
    description: 'An element of truth - videos about science, education, physics, and human curiosity.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    verified: true,
    country: 'Australia / US',
    joinedDate: 'Jul 21, 2010',
    category: 'Education & Science',
    subscribers: 16800000,
    subscribersFormatted: '16.8M',
    totalViews: 3120000000,
    totalViewsFormatted: '3.12B',
    totalVideos: 412,
    
    weeklySubGain: 48000,
    weeklyViewGain: 18900000,
    weeklyWatchTimeGain: 2450000,
    avgViewsPerVideo: 5400000,
    avgEngagementRate: 7.9,
    avgCtr: 12.2,
    
    history30d: [
      { date: '2026-08-04', subscribers: 16620000, netSubs: 6200, views: 2400000, watchTimeHours: 320000, engagementRate: 7.8, shortsViews: 400000, longFormViews: 2000000 },
      { date: '2026-08-10', subscribers: 16660000, netSubs: 7100, views: 2850000, watchTimeHours: 380000, engagementRate: 8.1, shortsViews: 450000, longFormViews: 2400000 },
      { date: '2026-08-16', subscribers: 16710000, netSubs: 7900, views: 3120000, watchTimeHours: 410000, engagementRate: 8.4, shortsViews: 520000, longFormViews: 2600000 },
      { date: '2026-08-22', subscribers: 16755000, netSubs: 6800, views: 2750000, watchTimeHours: 360000, engagementRate: 7.7, shortsViews: 480000, longFormViews: 2270000 },
      { date: '2026-08-31', subscribers: 16800000, netSubs: 7400, views: 2980000, watchTimeHours: 395000, engagementRate: 8.0, shortsViews: 510000, longFormViews: 2470000 },
    ],
    
    recentVideos: [
      {
        id: 'ver1',
        title: 'The Counter-Intuitive Physics Behind Quantum Levitation',
        publishedAt: '2026-08-26T15:00:00Z',
        views: 4890000,
        likes: 310000,
        comments: 18400,
        duration: '22:18',
        thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
        url: 'https://youtube.com/watch?v=mockVer1',
        type: 'long-form',
        engagementRate: 8.9,
        estimatedCtr: 13.8,
        avgPercentageViewed: 71.4,
        aiBadge: 'Viral Breakout',
        aiTakeaway: 'Exceptional 71% retention on a 22-min video driven by narrative pacing and live lab demonstrations.'
      },
      {
        id: 'ver2',
        title: 'Why The Simplest Math Problem Took 300 Years to Solve',
        publishedAt: '2026-08-12T16:00:00Z',
        views: 6120000,
        likes: 395000,
        comments: 24100,
        duration: '18:40',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
        url: 'https://youtube.com/watch?v=mockVer2',
        type: 'long-form',
        engagementRate: 9.3,
        estimatedCtr: 15.1,
        avgPercentageViewed: 68.0,
        aiBadge: 'Audience Favorite',
        aiTakeaway: 'High curiosity gap in thumbnail generated record-high initial CTR.'
      }
    ],
    
    demographics: {
      topCountries: [
        { country: 'United States', percentage: 38 },
        { country: 'India', percentage: 16 },
        { country: 'United Kingdom', percentage: 10 },
        { country: 'Australia', percentage: 8 },
        { country: 'Canada', percentage: 7 }
      ],
      ageGroups: [
        { range: '18-24', percentage: 32 },
        { range: '25-34', percentage: 41 },
        { range: '35-44', percentage: 17 },
        { range: '45+', percentage: 10 }
      ],
      gender: { male: 81, female: 16, other: 3 },
      trafficSources: [
        { source: 'Browse Features / Home', percentage: 48 },
        { source: 'Suggested Videos', percentage: 34 },
        { source: 'YouTube Search', percentage: 12 },
        { source: 'External', percentage: 6 }
      ],
      subscribedVsNot: { subscribed: 29, notSubscribed: 71 }
    },
    
    uploadHeatmap: [
      { day: 'Sun', hour: 15, score: 98 },
      { day: 'Mon', hour: 16, score: 75 },
      { day: 'Wed', hour: 17, score: 86 },
      { day: 'Fri', hour: 16, score: 91 },
      { day: 'Sat', hour: 15, score: 94 }
    ],
    
    nextMilestone: {
      targetSubs: 20000000,
      targetName: '20 Million Subscribers',
      estimatedDaysLeft: 460,
      currentProgressPercent: 84.0
    }
  },

  {
    id: 'fireship',
    handle: 'fireship',
    title: 'Fireship',
    customUrl: 'https://youtube.com/@fireship',
    description: 'High-intensity code tutorials and tech news to help you ship software faster.',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    verified: true,
    country: 'United States',
    joinedDate: 'Jun 28, 2017',
    category: 'Software & Coding',
    subscribers: 3450000,
    subscribersFormatted: '3.45M',
    totalViews: 680000000,
    totalViewsFormatted: '680M',
    totalVideos: 620,
    
    weeklySubGain: 18000,
    weeklyViewGain: 4900000,
    weeklyWatchTimeGain: 390000,
    avgViewsPerVideo: 820000,
    avgEngagementRate: 9.2,
    avgCtr: 11.8,
    
    history30d: [
      { date: '2026-08-04', subscribers: 3380000, netSubs: 2200, views: 640000, watchTimeHours: 48000, engagementRate: 9.1, shortsViews: 310000, longFormViews: 330000 },
      { date: '2026-08-12', subscribers: 3400000, netSubs: 2500, views: 710000, watchTimeHours: 54000, engagementRate: 9.4, shortsViews: 350000, longFormViews: 360000 },
      { date: '2026-08-20', subscribers: 3425000, netSubs: 2800, views: 820000, watchTimeHours: 62000, engagementRate: 9.5, shortsViews: 410000, longFormViews: 410000 },
      { date: '2026-08-31', subscribers: 3450000, netSubs: 3100, views: 890000, watchTimeHours: 68000, engagementRate: 9.2, shortsViews: 440000, longFormViews: 450000 },
    ],
    
    recentVideos: [
      {
        id: 'fire1',
        title: '10 Web Dev Trends You Need to Know for 2027',
        publishedAt: '2026-08-30T16:00:00Z',
        views: 940000,
        likes: 72000,
        comments: 4800,
        duration: '5:48',
        thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
        url: 'https://youtube.com/watch?v=mockFire1',
        type: 'long-form',
        engagementRate: 9.8,
        estimatedCtr: 13.2,
        avgPercentageViewed: 84.5,
        aiBadge: 'Viral Breakout',
        aiTakeaway: 'Fast cuts and punchy technical commentary deliver industry-leading 84.5% completion.'
      },
      {
        id: 'fire2',
        title: 'JavaScript in 100 Seconds',
        publishedAt: '2026-08-20T17:30:00Z',
        views: 1450000,
        likes: 112000,
        comments: 5900,
        duration: '2:14',
        thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&auto=format&fit=crop&q=80',
        url: 'https://youtube.com/watch?v=mockFire2',
        type: 'long-form',
        engagementRate: 10.4,
        estimatedCtr: 16.0,
        avgPercentageViewed: 89.2,
        aiBadge: 'Steady Evergreen',
        aiTakeaway: 'The iconic 100 Seconds format continues to dominate search indexing.'
      }
    ],
    
    demographics: {
      topCountries: [
        { country: 'United States', percentage: 34 },
        { country: 'India', percentage: 22 },
        { country: 'Germany', percentage: 9 },
        { country: 'United Kingdom', percentage: 8 },
        { country: 'Brazil', percentage: 6 }
      ],
      ageGroups: [
        { range: '18-24', percentage: 44 },
        { range: '25-34', percentage: 42 },
        { range: '35-44', percentage: 11 },
        { range: '45+', percentage: 3 }
      ],
      gender: { male: 89, female: 9, other: 2 },
      trafficSources: [
        { source: 'YouTube Search', percentage: 36 },
        { source: 'Suggested Videos', percentage: 34 },
        { source: 'Browse Features', percentage: 22 },
        { source: 'External', percentage: 8 }
      ],
      subscribedVsNot: { subscribed: 42, notSubscribed: 58 }
    },
    
    uploadHeatmap: [
      { day: 'Tue', hour: 16, score: 95 },
      { day: 'Wed', hour: 17, score: 92 },
      { day: 'Thu', hour: 16, score: 96 },
      { day: 'Sat', hour: 14, score: 81 }
    ],
    
    nextMilestone: {
      targetSubs: 4000000,
      targetName: '4 Million Subscribers',
      estimatedDaysLeft: 210,
      currentProgressPercent: 86.2
    }
  }
];

export const DEFAULT_WEEKLY_REPORT = {
  id: 'rep-mkbhd-initial',
  channelId: 'mkbhd',
  channelTitle: 'Marques Brownlee',
  channelHandle: 'mkbhd',
  weekRange: 'Aug 25 – Aug 31, 2026',
  generatedAt: new Date().toISOString(),
  performanceScore: 94,
  scoreGrade: 'A',
  scoreDelta: 4,
  emailSubject: '📊 Weekly Performance Report: Marques Brownlee (+35K Subs, 14.2M Views)',
  executiveSummary: 'Marques Brownlee sustained high momentum this week with a net addition of +35,000 subscribers and 14.2M views. Browse features drove 45% of total watch time, bolstered by high audience retention on smartphone hardware analysis videos.',
  highlights: [
    {
      title: 'Subscriber Velocity',
      metric: '+35,000',
      description: 'Pacing +12% above the 30-day baseline average, driven by search traffic and recent flagship teardowns.',
      isPositive: true
    },
    {
      title: 'Weekly View Volume',
      metric: '14.2M Views',
      description: 'Watch time reached 1.18M hours with strong completion rates across 10-15 minute long-form uploads.',
      isPositive: true
    },
    {
      title: 'Avg. Click-Through Rate',
      metric: '9.4% CTR',
      description: 'Top-tier thumbnail contrast and curiosity hooks kept CTR consistently in the 90th percentile.',
      isPositive: true
    }
  ],
  growthAnalysis: {
    subscribersGain: 35000,
    subscribersGainPercentage: 0.18,
    viewsGain: 14200000,
    viewsGainPercentage: 14.8,
    watchTimeHoursGain: 1180000,
    watchTimeGainPercentage: 12.3,
    avdFormatted: '6m 42s'
  },
  engagementBreakdown: {
    engagementRate: 6.8,
    likesToViewsRatio: 5.4,
    commentSentimentScore: 94,
    topRetentionTopic: 'Smartphone Hardware & Camera Blind Tests'
  },
  topPerformerVideo: {
    title: 'The Real Problem With New Smartphones in 2026',
    views: 3420000,
    likeRatio: 8.2,
    thumbnailUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    whyItWorked: 'Strong polarizing title format paired with deep technical teardowns created high discussion in comments.'
  },
  strategicRecommendations: [
    {
      category: 'Thumbnail & Title',
      headline: 'Maintain high contrast text + product closeup pairing',
      details: 'Recent uploads with 3-5 word concise titles outperformed longer descriptive variations by +28% in CTR.',
      potentialImpact: 'High'
    },
    {
      category: 'Shorts Strategy',
      headline: 'Repurpose the 3 peak retention chapters into vertical Shorts',
      details: 'Audience spikes between 04:15 and 07:30 in recent uploads contain self-contained insights ideal for 45-second vertical clips.',
      potentialImpact: 'Critical'
    },
    {
      category: 'Upload Timing',
      headline: 'Target Thursday 16:00 UTC for maximum initial 2-hour velocity',
      details: 'Viewer concurrency logs show peak tech audience availability starting Thursdays at 4:00 PM UTC.',
      potentialImpact: 'Moderate'
    }
  ]
};
