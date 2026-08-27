import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { AiSummaryResponse } from '../../types';
import { useToast } from '../common/Toast';
import { AiThinkingLoader } from '../common/Skeleton';

interface AiSummaryCardProps {
  summaryData?: AiSummaryResponse | null;
  isLoading: boolean;
  onGenerateSummary: () => void;
}

export const AiSummaryCard: React.FC<AiSummaryCardProps> = ({
  summaryData,
  isLoading,
  onGenerateSummary,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopySummary = () => {
    if (!summaryData) return;
    const textToCopy = `SUMMARY:\n${summaryData.summary}\n\nKEY POINTS:\n${summaryData.keyPoints.map((kp) => `• ${kp}`).join('\n')}\n\nACTION REQUIRED:\n${summaryData.actionRequired}\n\nDEADLINE:\n${summaryData.deadline}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    showToast({ message: 'AI summary copied to clipboard', type: 'info' });
    setTimeout(() => setCopied(false), 2000);
  };

  if (!summaryData && !isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-cyan-500/10 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-cyan-950/40 rounded-3xl p-4 sm:p-5 border border-indigo-200/70 dark:border-indigo-800/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-colors relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-400/10 dark:bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3.5 z-10">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              Gemini 3.5 AI Summary
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-2xs">
                Instant
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Extract key takeaways, immediate action items, and identified deadlines.
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={onGenerateSummary}
          className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold rounded-2xl shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 shrink-0 z-10"
        >
          <Zap size={14} />
          Summarize with AI
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl border border-indigo-100 dark:border-slate-800 shadow-md shadow-indigo-500/5 overflow-hidden transition-all duration-200"
    >
      {/* Card Header */}
      <div className="px-4 sm:px-5 py-3.5 bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-cyan-50/80 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-cyan-950/40 border-b border-indigo-100/70 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-2xs">
            <Sparkles size={15} />
          </div>
          <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            AI Executive Summary
            {isLoading && (
              <span className="text-[11px] font-semibold text-indigo-600 dark:text-cyan-400 animate-pulse">
                Analyzing with Gemini 3.5...
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {summaryData && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleCopySummary}
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-cyan-300 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-colors text-xs flex items-center gap-1 font-semibold"
              title="Copy summary"
            >
              {copied ? <Check size={14} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={14} />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </motion.button>
          )}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </motion.button>
        </div>
      </div>

      {/* Card Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 sm:p-5 space-y-4 text-xs"
          >
            {isLoading ? (
              <AiThinkingLoader
                message="Gemini 3.5 is analyzing email..."
                subMessage="Extracting key points, action items, and deadlines"
              />
            ) : summaryData ? (
              <>
                {/* 1. Concise Summary */}
                <div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-indigo-700 dark:text-cyan-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Zap size={11} />
                    Core Summary
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 text-xs sm:text-[13px] leading-relaxed bg-slate-50/80 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                    {summaryData.summary}
                  </p>
                </div>

                {/* 2. Key Points */}
                {summaryData.keyPoints && summaryData.keyPoints.length > 0 && (
                  <div>
                    <div className="text-[10px] sm:text-[11px] font-bold text-indigo-700 dark:text-cyan-400 uppercase tracking-wider mb-2">
                      Key Takeaways
                    </div>
                    <ul className="space-y-2">
                      {summaryData.keyPoints.map((point: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-[12.5px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 mt-1.5 shrink-0" />
                          <span className="leading-snug">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 3. Action Required & Deadline Badges */}
                <div className="pt-2 border-t border-gray-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Action Required */}
                  <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40">
                    <div className="text-[10px] sm:text-[11px] font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-1">
                      <CheckCircle2 size={13} className="text-amber-600 dark:text-amber-400" />
                      Action Required
                    </div>
                    <div className="text-amber-950 dark:text-amber-100 text-xs font-semibold">
                      {summaryData.actionRequired || 'No specific action required.'}
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40">
                    <div className="text-[10px] sm:text-[11px] font-bold text-indigo-800 dark:text-cyan-300 flex items-center gap-1.5 mb-1">
                      <Calendar size={13} className="text-indigo-600 dark:text-cyan-400" />
                      Deadline
                    </div>
                    <div className="text-indigo-950 dark:text-slate-100 text-xs font-semibold">
                      {summaryData.deadline || 'No deadline identified.'}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
