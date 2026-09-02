import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Mail, 
  CheckCircle2, 
  FileText, 
  Copy, 
  Award, 
  RefreshCw,
  Loader2
} from 'lucide-react';
import { ChannelData, WeeklyReport } from '../types';
import { formatCompactNumber } from '../utils/formatters';
import { generateHtmlEmailTemplate } from '../utils/reportGenerator';

interface WeeklyReportsViewProps {
  channel: ChannelData;
  report: WeeklyReport | null;
  onGenerateNewReport: () => Promise<void>;
  onSendEmailReport: (email: string) => Promise<void>;
  isGenerating: boolean;
  isSending: boolean;
  defaultEmail?: string;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const WeeklyReportsView: React.FC<WeeklyReportsViewProps> = ({
  channel,
  report,
  onGenerateNewReport,
  onSendEmailReport,
  isGenerating,
  isSending,
  defaultEmail = 'gichaumburu@gmail.com',
  onShowToast
}) => {
  const [recipientEmail, setRecipientEmail] = useState(defaultEmail);
  const [activeSubTab, setActiveSubTab] = useState<'report' | 'email-preview' | 'html-source'>('report');
  const [copied, setCopied] = useState(false);

  if (!report) {
    return (
      <div className="bg-white p-12 rounded-lg border border-[#dadce0] text-center space-y-4 shadow-xs">
        <div className="w-12 h-12 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-[#202124]">No Weekly Report Generated Yet</h3>
        <p className="text-sm text-[#5f6368] max-w-md mx-auto">
          Generate an AI-powered weekly performance analytics report with executive summaries, retention bottlenecks, and strategic growth recommendations.
        </p>
        <button
          onClick={onGenerateNewReport}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-medium rounded-md shadow-xs transition-colors"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>Generate Weekly Report</span>
        </button>
      </div>
    );
  }

  const htmlEmailCode = generateHtmlEmailTemplate(report, channel);

  const handleCopyMarkdown = () => {
    const md = `# Weekly Performance Report: ${report.channelTitle} (${report.weekRange})
**Score:** ${report.performanceScore}/100 (Grade ${report.scoreGrade})

## Executive Summary
${report.executiveSummary}

## Highlights
${report.highlights.map(h => `- **${h.title}:** ${h.metric} — ${h.description}`).join('\n')}

## Growth Analysis
- **Subscribers:** +${formatCompactNumber(report.growthAnalysis.subscribersGain)} (+${report.growthAnalysis.subscribersGainPercentage}%)
- **Weekly Views:** ${formatCompactNumber(report.growthAnalysis.viewsGain)} (+${report.growthAnalysis.viewsGainPercentage}%)
- **Watch Time:** ${formatCompactNumber(report.growthAnalysis.watchTimeHoursGain)} hours

## 7-Day Strategic Playbook
${report.strategicRecommendations.map(r => `### [${r.category}] ${r.headline}\n${r.details}`).join('\n\n')}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    onShowToast('Report copied to clipboard as Markdown!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action & Sub-Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-3.5 rounded-lg border border-[#dadce0] shadow-xs">
        
        {/* Sub tabs */}
        <div className="flex items-center bg-[#f1f3f4] p-0.5 rounded-md text-xs">
          <button
            onClick={() => setActiveSubTab('report')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeSubTab === 'report'
                ? 'bg-white text-[#202124] shadow-xs font-medium'
                : 'text-[#5f6368] hover:text-[#202124]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Interactive Report</span>
          </button>

          <button
            onClick={() => setActiveSubTab('email-preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeSubTab === 'email-preview'
                ? 'bg-white text-[#202124] shadow-xs font-medium'
                : 'text-[#5f6368] hover:text-[#202124]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Newsletter Preview</span>
          </button>

          <button
            onClick={() => setActiveSubTab('html-source')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeSubTab === 'html-source'
                ? 'bg-white text-[#202124] shadow-xs font-medium'
                : 'text-[#5f6368] hover:text-[#202124]'
            }`}
          >
            <span>HTML Source</span>
          </button>
        </div>

        {/* Quick actions (Regenerate / Copy / Send) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onGenerateNewReport}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#f1f3f4] text-[#3c4043] text-xs font-medium rounded-md border border-[#dadce0] transition-colors shadow-xs"
            title="Regenerate report with latest stats"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#5f6368] ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#f1f3f4] text-[#3c4043] text-xs font-medium rounded-md border border-[#dadce0] transition-colors shadow-xs"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-[#1e8e3e]" /> : <Copy className="w-3.5 h-3.5 text-[#5f6368]" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: Interactive Report View */}
      {activeSubTab === 'report' && (
        <div className="space-y-6">
          
          {/* Executive Header Banner */}
          <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#dadce0] shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-5 border-b border-[#dadce0]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc]">
                    Weekly Report
                  </span>
                  <span className="text-xs text-[#5f6368] font-medium">
                    {report.weekRange}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-[#202124]">
                  {report.channelTitle} Performance Analysis
                </h2>
                <p className="text-xs text-[#5f6368]">
                  Automated intelligence report
                </p>
              </div>

              {/* Score Meter */}
              <div className="flex items-center gap-4 bg-[#f8f9fa] p-3.5 rounded-lg border border-[#dadce0]">
                <div className="text-right">
                  <div className="text-xs font-bold text-[#5f6368] uppercase tracking-wider">Performance Score</div>
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-3xl font-bold text-[#1e8e3e] leading-none">{report.performanceScore}</span>
                    <span className="text-sm font-medium text-[#5f6368]">/100</span>
                  </div>
                  <div className="text-xs font-medium text-[#1e8e3e]">+{report.scoreDelta} vs previous week</div>
                </div>
                <div className="w-11 h-11 rounded-lg bg-[#e6f4ea] text-[#137333] font-bold text-lg flex items-center justify-center border border-[#ceead6]">
                  {report.scoreGrade}
                </div>
              </div>
            </div>

            {/* Executive summary paragraph */}
            <div className="mt-4 p-4 rounded-lg bg-[#f8f9fa] border border-[#dadce0] text-xs sm:text-sm text-[#3c4043] leading-relaxed">
              <strong className="text-[#202124]">Executive Summary: </strong>
              {report.executiveSummary}
            </div>

            {/* Highlights row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              {report.highlights.map((h, i) => (
                <div key={i} className="p-3.5 rounded-lg border border-[#dadce0] bg-white">
                  <div className="text-xs text-[#5f6368] font-medium">{h.title}</div>
                  <div className="text-base font-bold text-[#202124] my-1">{h.metric}</div>
                  <div className="text-xs text-[#5f6368] leading-snug">{h.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-lg border border-[#dadce0] shadow-xs text-center">
              <div className="text-xs font-bold text-[#5f6368] uppercase tracking-wider">Subscribers Velocity</div>
              <div className="text-2xl font-bold text-[#1a73e8] mt-2">
                +{formatCompactNumber(report.growthAnalysis.subscribersGain)}
              </div>
              <div className="text-xs text-[#1e8e3e] font-medium mt-1">
                +{report.growthAnalysis.subscribersGainPercentage}% Week-over-Week
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-[#dadce0] shadow-xs text-center">
              <div className="text-xs font-bold text-[#5f6368] uppercase tracking-wider">Weekly View Volume</div>
              <div className="text-2xl font-bold text-[#202124] mt-2">
                {formatCompactNumber(report.growthAnalysis.viewsGain)}
              </div>
              <div className="text-xs text-[#1e8e3e] font-medium mt-1">
                +{report.growthAnalysis.viewsGainPercentage}% Week-over-Week
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-[#dadce0] shadow-xs text-center">
              <div className="text-xs font-bold text-[#5f6368] uppercase tracking-wider">Watch Time (Hours)</div>
              <div className="text-2xl font-bold text-[#202124] mt-2">
                {formatCompactNumber(report.growthAnalysis.watchTimeHoursGain)}
              </div>
              <div className="text-xs text-[#1e8e3e] font-medium mt-1">
                Avg Duration: {report.growthAnalysis.avdFormatted}
              </div>
            </div>
          </div>

          {/* Top Video of the Week Feature */}
          {report.topPerformerVideo && (
            <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#dadce0] shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-[#fef7e0] text-[#f29900]">
                  <Award className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-[#202124]">Top Upload of the Week</h3>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start bg-[#f8f9fa] p-4 rounded-lg border border-[#dadce0]">
                <img
                  src={report.topPerformerVideo.thumbnailUrl}
                  alt={report.topPerformerVideo.title}
                  className="w-full sm:w-48 h-28 rounded-md object-cover border border-[#dadce0] shrink-0"
                />
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-[#202124]">
                    {report.topPerformerVideo.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-[#5f6368]">
                    <span>{formatCompactNumber(report.topPerformerVideo.views)} views</span>
                    <span>•</span>
                    <span className="text-[#1e8e3e] font-medium">{report.topPerformerVideo.likeRatio}% engagement</span>
                  </div>
                  <div className="text-xs text-[#3c4043] bg-white p-2.5 rounded-md border border-[#dadce0]">
                    <strong>Algorithmic Driver: </strong> {report.topPerformerVideo.whyItWorked}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7-Day Strategic Growth Playbook */}
          <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#dadce0] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-[#e8f0fe] text-[#1a73e8]">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-[#202124]">Strategic Growth Recommendations</h3>
              </div>
              <span className="text-xs text-[#5f6368] font-medium">Actionable Insights</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {report.strategicRecommendations.map((rec, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-lg border-l-4 border-l-[#1a73e8] border border-[#dadce0] bg-white hover:bg-[#f8f9fa] transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#1a73e8] uppercase tracking-wider">
                      [{rec.category}]
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                      rec.potentialImpact === 'Critical' 
                        ? 'bg-[#fce8e6] text-[#c5221f]' 
                        : 'bg-[#e8f0fe] text-[#1a73e8]'
                    }`}>
                      {rec.potentialImpact} Impact
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#202124]">{rec.headline}</h4>
                  <p className="text-xs text-[#5f6368] leading-relaxed">{rec.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dispatch Email Trigger Card */}
          <div className="bg-white p-5 rounded-lg border border-[#dadce0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-[#202124]">Send Weekly Digest to Email</h4>
              <p className="text-xs text-[#5f6368]">Dispatches the complete HTML newsletter report to the specified inbox</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="you@gmail.com"
                className="px-3 py-1.5 text-xs bg-white border border-[#dadce0] rounded-md text-[#202124] w-48 sm:w-60 focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
              />
              <button
                onClick={() => onSendEmailReport(recipientEmail)}
                disabled={isSending || !recipientEmail}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1a73e8] hover:bg-[#1557b0] disabled:bg-gray-300 text-white text-xs font-medium rounded-md shadow-xs transition-colors shrink-0"
              >
                {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Send Digest</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* SUB-VIEW 2: Realistic Gmail / Email Newsletter Preview */}
      {activeSubTab === 'email-preview' && (
        <div className="bg-white rounded-lg border border-[#dadce0] shadow-xs overflow-hidden">
          {/* Gmail-styled Top Chrome */}
          <div className="bg-[#f8f9fa] border-b border-[#dadce0] px-5 py-3 flex items-center justify-between text-xs text-[#3c4043]">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#1a73e8]" />
              <span className="font-semibold text-[#202124]">Subject:</span>
              <span className="text-[#3c4043]">{report.emailSubject}</span>
            </div>
            <div className="text-[#5f6368]">
              To: <strong>{recipientEmail}</strong>
            </div>
          </div>

          {/* Rendered HTML body */}
          <div className="p-4 sm:p-8 bg-[#f8f9fa] flex justify-center">
            <div 
              className="w-full max-w-2xl bg-white rounded-lg shadow-xs border border-[#dadce0] overflow-hidden"
              dangerouslySetInnerHTML={{ __html: htmlEmailCode }}
            />
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: Raw HTML Source */}
      {activeSubTab === 'html-source' && (
        <div className="bg-white p-5 rounded-lg border border-[#dadce0] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#5f6368] uppercase tracking-wider">Email HTML Template Code</h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(htmlEmailCode);
                onShowToast('HTML source code copied!', 'success');
              }}
              className="flex items-center gap-1 text-xs text-[#1a73e8] hover:underline font-medium"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy HTML</span>
            </button>
          </div>
          <pre className="p-4 bg-[#202124] text-gray-200 rounded-lg text-xs font-mono overflow-x-auto max-h-96">
            {htmlEmailCode}
          </pre>
        </div>
      )}

    </div>
  );
};

