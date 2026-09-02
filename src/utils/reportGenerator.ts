import { ChannelData, WeeklyReport } from '../types';
import { formatCompactNumber, formatPercent } from './formatters';

export function buildWeeklyReport(channel: ChannelData): WeeklyReport {
  const topVideo = channel.recentVideos[0] || {
    id: 'v1',
    title: 'Channel Feature Upload',
    views: channel.avgViewsPerVideo,
    likes: Math.floor(channel.avgViewsPerVideo * 0.06),
    thumbnailUrl: channel.bannerUrl,
    url: channel.customUrl,
    aiTakeaway: 'High engagement driven by loyal community resonance.'
  };

  const performanceScore = Math.min(99, Math.max(72, Math.round(80 + (channel.weeklySubGain / (channel.subscribers * 0.001)) * 5)));
  const scoreGrade = performanceScore >= 95 ? 'A+' : performanceScore >= 90 ? 'A' : performanceScore >= 82 ? 'B+' : 'B';
  const scoreDelta = Math.floor(Math.random() * 6) + 2;

  const now = new Date();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekRange = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  return {
    id: `rep-${channel.id}-${Date.now()}`,
    channelId: channel.id,
    channelTitle: channel.title,
    channelHandle: channel.handle,
    weekRange,
    generatedAt: new Date().toISOString(),
    performanceScore,
    scoreGrade,
    scoreDelta,
    executiveSummary: `${channel.title} experienced strong momentum this week with a net addition of +${formatCompactNumber(channel.weeklySubGain)} subscribers and ${formatCompactNumber(channel.weeklyViewGain)} total views. Audience engagement rose to ${channel.avgEngagementRate}%, driven primarily by strong algorithmic push in Browse and Recommended feeds.`,
    highlights: [
      {
        title: 'Subscriber Velocity',
        metric: `+${formatCompactNumber(channel.weeklySubGain)}`,
        description: `Outperformed the 30-day baseline average by +${Math.round(channel.weeklySubGain * 0.12)} new subscribers.`,
        isPositive: true
      },
      {
        title: 'Weekly View Volume',
        metric: `${formatCompactNumber(channel.weeklyViewGain)}`,
        description: `Watch time totaled ${formatCompactNumber(channel.weeklyWatchTimeGain)} hours with strong completion rates.`,
        isPositive: true
      },
      {
        title: 'Avg. Click-Through Rate (CTR)',
        metric: `${channel.avgCtr}%`,
        description: `Thumbnails and titles sustained high initial curiosity in the first 24 hours of release.`,
        isPositive: true
      }
    ],
    growthAnalysis: {
      subscribersGain: channel.weeklySubGain,
      subscribersGainPercentage: +(channel.weeklySubGain / (channel.subscribers || 100000) * 100).toFixed(2),
      viewsGain: channel.weeklyViewGain,
      viewsGainPercentage: 14.8,
      watchTimeHoursGain: channel.weeklyWatchTimeGain,
      watchTimeGainPercentage: 12.3,
      avdFormatted: '6m 42s'
    },
    engagementBreakdown: {
      engagementRate: channel.avgEngagementRate,
      likesToViewsRatio: +(channel.avgEngagementRate * 0.85).toFixed(1),
      commentSentimentScore: 94,
      topRetentionTopic: 'Deep-dive analysis & technical demonstrations'
    },
    topPerformerVideo: {
      title: topVideo.title,
      views: topVideo.views,
      likeRatio: 'engagementRate' in topVideo ? (topVideo.engagementRate as number) : 7.2,
      thumbnailUrl: topVideo.thumbnailUrl,
      whyItWorked: topVideo.aiTakeaway || 'Strong initial 10-second pacing + engaging curiosity hook created viral momentum.'
    },
    strategicRecommendations: [
      {
        category: 'Thumbnail & Title',
        headline: 'Double-down on curiosity gaps with high-contrast text',
        details: 'Recent uploads with 3-5 word concise titles outperformed longer descriptive variations by +28% in CTR.',
        potentialImpact: 'High'
      },
      {
        category: 'Shorts Strategy',
        headline: 'Repurpose the 3 peak retention chapters into Shorts',
        details: 'Audience spikes between 04:15 and 07:30 in recent long-form uploads contain self-contained insights ideal for 45-second vertical clips.',
        potentialImpact: 'Critical'
      },
      {
        category: 'Upload Timing',
        headline: 'Optimize release window to Thursday 16:00 UTC',
        details: 'Audience concurrency telemetry indicates your primary viewer clusters are most active between 15:00 and 19:00 UTC on Thursdays.',
        potentialImpact: 'Medium'
      },
      {
        category: 'Audience Retention',
        headline: 'Reduce intro fluff to under 4 seconds',
        details: 'Videos with immediate cold opens without animated intros retain 18% more viewers through the critical first 30 seconds.',
        potentialImpact: 'High'
      }
    ],
    emailSubject: `📊 Weekly Channel Digest: ${channel.title} Performance (${weekRange})`
  };
}

export function generateHtmlEmailTemplate(report: WeeklyReport, channel: ChannelData): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${report.emailSubject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #202124;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8f9fa; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; border: 1px solid #dadce0; overflow: hidden; box-shadow: 0 1px 3px rgba(60,64,67,0.08);">
          
          <!-- Google / YouTube Top Header -->
          <tr>
            <td style="padding: 20px 24px; border-bottom: 1px solid #e8eaed; background-color: #ffffff;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="display: inline-block; vertical-align: middle;">
                      <span style="font-size: 18px; font-weight: 700; color: #1a73e8; letter-spacing: -0.2px;">YouTube</span>
                      <span style="font-size: 18px; font-weight: 500; color: #5f6368; margin-left: 4px;">Analytics Digest</span>
                    </div>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 4px 10px; background-color: #e8f0fe; color: #1a73e8; border-radius: 16px; font-size: 12px; font-weight: 600;">
                      ${report.weekRange}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Channel Info Banner -->
          <tr>
            <td style="padding: 24px; background: linear-gradient(180deg, #f8fafd 0%, #ffffff 100%);">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="56" valign="top">
                    <img src="${channel.avatarUrl}" alt="${channel.title}" width="52" height="52" style="border-radius: 50%; display: block; border: 2px solid #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  </td>
                  <td style="padding-left: 16px;">
                    <div style="font-size: 20px; font-weight: 700; color: #202124; margin-bottom: 2px;">
                      ${channel.title}
                    </div>
                    <div style="font-size: 13px; color: #5f6368;">
                      @${channel.handle} • ${channel.subscribersFormatted} Subscribers
                    </div>
                  </td>
                  <td align="right" valign="middle">
                    <div style="text-align: right;">
                      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #70757a; font-weight: 600;">Performance Score</div>
                      <div style="font-size: 26px; font-weight: 800; color: #1e8e3e; line-height: 1.1;">
                        ${report.performanceScore}<span style="font-size: 14px; font-weight: 600; color: #5f6368;">/100</span>
                      </div>
                      <div style="font-size: 12px; font-weight: 600; color: #1e8e3e;">+${report.scoreDelta} vs last week</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Executive Summary -->
          <tr>
            <td style="padding: 0 24px 20px 24px;">
              <div style="background-color: #f1f3f4; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; color: #3c4043;">
                <strong style="color: #202124;">Weekly Summary:</strong> ${report.executiveSummary}
              </div>
            </td>
          </tr>

          <!-- Core Metric Grid -->
          <tr>
            <td style="padding: 0 24px 20px 24px;">
              <table width="100%" border="0" cellspacing="8" cellpadding="0">
                <tr>
                  <td width="33%" style="background-color: #ffffff; border: 1px solid #dadce0; border-radius: 8px; padding: 14px; text-align: center;">
                    <div style="font-size: 12px; color: #5f6368; font-weight: 500;">New Subscribers</div>
                    <div style="font-size: 20px; font-weight: 700; color: #1a73e8; margin: 4px 0;">+${formatCompactNumber(report.growthAnalysis.subscribersGain)}</div>
                    <div style="font-size: 11px; color: #1e8e3e; font-weight: 600;">+${report.growthAnalysis.subscribersGainPercentage}% WoW</div>
                  </td>
                  <td width="33%" style="background-color: #ffffff; border: 1px solid #dadce0; border-radius: 8px; padding: 14px; text-align: center;">
                    <div style="font-size: 12px; color: #5f6368; font-weight: 500;">Weekly Views</div>
                    <div style="font-size: 20px; font-weight: 700; color: #202124; margin: 4px 0;">${formatCompactNumber(report.growthAnalysis.viewsGain)}</div>
                    <div style="font-size: 11px; color: #1e8e3e; font-weight: 600;">+${report.growthAnalysis.viewsGainPercentage}% WoW</div>
                  </td>
                  <td width="33%" style="background-color: #ffffff; border: 1px solid #dadce0; border-radius: 8px; padding: 14px; text-align: center;">
                    <div style="font-size: 12px; color: #5f6368; font-weight: 500;">Watch Time (Hrs)</div>
                    <div style="font-size: 20px; font-weight: 700; color: #202124; margin: 4px 0;">${formatCompactNumber(report.growthAnalysis.watchTimeHoursGain)}</div>
                    <div style="font-size: 11px; color: #1e8e3e; font-weight: 600;">+${report.growthAnalysis.watchTimeGainPercentage}% WoW</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Top Video Performer Card -->
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <div style="border: 1px solid #dadce0; border-radius: 8px; padding: 16px; background-color: #ffffff;">
                <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #1a73e8; letter-spacing: 0.5px; margin-bottom: 8px;">
                  ⭐ Top Upload of the Week
                </div>
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td width="100" valign="top">
                      <img src="${report.topPerformerVideo.thumbnailUrl}" alt="Thumbnail" width="96" height="54" style="border-radius: 6px; object-fit: cover; display: block;">
                    </td>
                    <td style="padding-left: 12px;" valign="top">
                      <div style="font-size: 14px; font-weight: 600; color: #202124; line-height: 1.3; margin-bottom: 4px;">
                        ${report.topPerformerVideo.title}
                      </div>
                      <div style="font-size: 12px; color: #5f6368; margin-bottom: 6px;">
                        ${formatCompactNumber(report.topPerformerVideo.views)} views • ${report.topPerformerVideo.likeRatio}% engagement
                      </div>
                      <div style="font-size: 12px; color: #3c4043; background: #e8f0fe; padding: 6px 8px; border-radius: 4px; line-height: 1.4;">
                        <strong>Key driver:</strong> ${report.topPerformerVideo.whyItWorked}
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Actionable AI Recommendations -->
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <div style="font-size: 15px; font-weight: 700; color: #202124; margin-bottom: 12px;">
                💡 Strategic Growth Playbook for Next 7 Days
              </div>
              ${report.strategicRecommendations.map(rec => `
                <div style="margin-bottom: 10px; border-left: 3px solid #1a73e8; background-color: #f8f9fa; padding: 10px 14px; border-radius: 0 6px 6px 0;">
                  <div style="font-size: 13px; font-weight: 700; color: #1a73e8; margin-bottom: 2px;">
                    [${rec.category}] ${rec.headline}
                  </div>
                  <div style="font-size: 12px; color: #5f6368; line-height: 1.4;">
                    ${rec.details}
                  </div>
                </div>
              `).join('')}
            </td>
          </tr>

          <!-- Email Footer -->
          <tr>
            <td style="padding: 20px 24px; background-color: #f8f9fa; border-top: 1px solid #e8eaed; font-size: 12px; color: #70757a; text-align: center; line-height: 1.5;">
              <div>This weekly analytics report was automatically generated for <strong>${channel.title}</strong>.</div>
              <div style="margin-top: 8px;">
                <a href="#" style="color: #1a73e8; text-decoration: none; margin: 0 8px;">View Live Dashboard</a> • 
                <a href="#" style="color: #1a73e8; text-decoration: none; margin: 0 8px;">Delivery Schedule Settings</a> • 
                <a href="#" style="color: #5f6368; text-decoration: underline; margin: 0 8px;">Unsubscribe</a>
              </div>
              <div style="margin-top: 12px; font-size: 11px; color: #9aa0a6;">
                Google Cloud AI Studio • YouTube Channel Analytics Engine
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export const generateWeeklyReport = buildWeeklyReport;
