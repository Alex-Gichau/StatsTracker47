import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Filter, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Copy, 
  Check, 
  Maximize2, 
  Minimize2,
  Video,
  Image as ImageIcon
} from 'lucide-react';
import { ProcessLog } from '../types';

interface BackgroundProcessLogsProps {
  logs: ProcessLog[];
  onClearLogs: () => void;
  isAnalyzing?: boolean;
}

export const BackgroundProcessLogs: React.FC<BackgroundProcessLogsProps> = ({
  logs,
  onClearLogs,
  isAnalyzing = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new logs arrive if open
  useEffect(() => {
    if (isOpen) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs.length, isOpen]);

  const filteredLogs = logs.filter(log => {
    const matchesCategory = selectedCategory === 'ALL' || log.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopyLogs = () => {
    const logText = filteredLogs.map(l => `[${l.timestamp}] [${l.category}] [${l.level.toUpperCase()}] ${l.message} ${l.details || ''}`).join('\n');
    navigator.clipboard.writeText(logText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryColor = (cat: ProcessLog['category']) => {
    switch (cat) {
      case 'API':
        return 'text-[#8ab4f8] bg-[#1a73e8]/20 border-[#8ab4f8]/30';
      case 'BRANDING':
        return 'text-[#fdd663] bg-[#f29900]/20 border-[#fdd663]/30';
      case 'TELEMETRY':
        return 'text-[#81c995] bg-[#1e8e3e]/20 border-[#81c995]/30';
      case 'MEET':
        return 'text-[#ce93d8] bg-[#9c27b0]/20 border-[#ce93d8]/30';
      case 'AI':
        return 'text-[#80deea] bg-[#00acc1]/20 border-[#80deea]/30';
      default:
        return 'text-[#bdc1c6] bg-[#5f6368]/20 border-[#bdc1c6]/30';
    }
  };

  const categories = ['ALL', 'API', 'BRANDING', 'TELEMETRY', 'MEET', 'AI', 'SYSTEM'];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-auto select-none">
      
      {/* Minimized Dock Bar */}
      <div className="bg-[#202124] text-[#bdc1c6] border-t border-[#3c4043] px-4 py-2 flex items-center justify-between text-xs shadow-lg transition-colors">
        
        {/* Left: Indicator & Latest Log preview */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 cursor-pointer min-w-0 flex-1 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2 shrink-0">
            <span className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-[#8ab4f8] animate-ping' : 'bg-[#81c995]'}`} />
            <Terminal className="w-3.5 h-3.5 text-[#8ab4f8]" />
            <span className="font-mono font-medium text-white">Background Telemetry Logs</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#3c4043] text-[#e8eaed] font-mono">
              {logs.length}
            </span>
          </div>

          {/* Latest Log Snippet */}
          {logs.length > 0 && !isOpen && (
            <div className="hidden sm:flex items-center gap-2 min-w-0 truncate text-[11px] text-[#9aa0a6] font-mono">
              <span className="text-[#5f6368]">•</span>
              <span className={`px-1 rounded text-[10px] uppercase font-semibold ${getCategoryColor(logs[logs.length - 1].category)}`}>
                {logs[logs.length - 1].category}
              </span>
              <span className="truncate">{logs[logs.length - 1].message}</span>
            </div>
          )}
        </div>

        {/* Right: Toggle buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-[#e8eaed] hover:bg-[#3c4043] rounded transition-colors font-medium"
          >
            <span>{isOpen ? 'Collapse Logs' : 'View Logs'}</span>
            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>

      {/* Expanded Logs Console Drawer */}
      {isOpen && (
        <div className={`bg-[#202124] text-[#e8eaed] border-t border-[#3c4043] flex flex-col font-mono shadow-2xl transition-all ${
          isMaximized ? 'h-[75vh]' : 'h-72 sm:h-80'
        }`}>
          
          {/* Console Controls Bar */}
          <div className="px-4 py-2 bg-[#292a2d] border-b border-[#3c4043] flex flex-wrap items-center justify-between gap-2 text-xs">
            
            {/* Filter tags */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              <span className="text-[10px] text-[#9aa0a6] uppercase font-sans mr-1">Filter:</span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.5 rounded text-[11px] font-sans font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#1a73e8] text-white'
                      : 'bg-[#3c4043] text-[#bdc1c6] hover:text-white hover:bg-[#4d5156]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Actions: Search, Copy, Clear, Maximize */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search logs..."
                className="px-2 py-0.5 bg-[#17181b] border border-[#3c4043] rounded text-[11px] text-white placeholder-[#70757a] focus:outline-none focus:border-[#8ab4f8] w-28 sm:w-40 font-sans"
              />

              <button
                onClick={handleCopyLogs}
                className="p-1 hover:bg-[#3c4043] text-[#bdc1c6] hover:text-white rounded transition-colors"
                title="Copy all logs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#81c995]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={onClearLogs}
                className="p-1 hover:bg-[#3c4043] text-[#bdc1c6] hover:text-[#f28b82] rounded transition-colors"
                title="Clear console"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-1 hover:bg-[#3c4043] text-[#bdc1c6] hover:text-white rounded transition-colors hidden sm:block"
                title={isMaximized ? "Restore size" : "Maximize logs"}
              >
                {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>

          </div>

          {/* Console Log Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1.5 text-[11px] sm:text-xs font-mono leading-relaxed select-text">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-[#70757a]">
                No background log events matching current filter.
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="flex items-start gap-2.5 hover:bg-[#292a2d] px-2 py-1 rounded transition-colors group"
                >
                  <span className="text-[#70757a] shrink-0 font-mono text-[10px]">
                    {log.timestamp}
                  </span>

                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold tracking-wider border shrink-0 ${getCategoryColor(log.category)}`}>
                    {log.category}
                  </span>

                  <div className="flex-1 min-w-0">
                    <span className={
                      log.level === 'success' ? 'text-[#81c995]' :
                      log.level === 'warn' ? 'text-[#fdd663]' :
                      'text-[#e8eaed]'
                    }>
                      {log.message}
                    </span>
                    {log.details && (
                      <span className="text-[#9aa0a6] block text-[10px] mt-0.5 break-all">
                        {log.details}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>

        </div>
      )}

    </div>
  );
};
