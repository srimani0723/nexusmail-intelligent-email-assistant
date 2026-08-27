import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity as ActivityIcon,
  Sparkles,
  Send,
  Mail,
  Archive,
  Trash2,
  Star,
  RotateCw,
  Clock,
  Filter,
  ArrowLeft,
  Wand2,
  CheckCircle2,
  Tag,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { activityApi } from '../api/client';
import { Activity } from '../types';

type FilterCategory = 'ALL' | 'AI' | 'EMAILS' | 'LABELS';

export const ActivityPage: React.FC = () => {
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('ALL');

  const { data: activityResponse, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['activity'],
    queryFn: () => activityApi.getActivity(100),
  });

  const activities: Activity[] = activityResponse?.activities || [];

  const getActionTheme = (action: string) => {
    switch (action) {
      case 'EMAIL_SUMMARIZED':
        return {
          icon: <Sparkles size={16} />,
          gradient: 'from-purple-600 to-indigo-600 text-white',
          badgeBg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900/50',
          title: 'Summarized with AI',
        };
      case 'REPLY_GENERATED':
        return {
          icon: <Wand2 size={16} />,
          gradient: 'from-indigo-600 to-cyan-500 text-white',
          badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-cyan-300 border-indigo-200 dark:border-indigo-900/50',
          title: 'Generated AI Reply Draft',
        };
      case 'EMAIL_SENT':
        return {
          icon: <Send size={16} />,
          gradient: 'from-blue-600 to-cyan-500 text-white',
          badgeBg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/50',
          title: 'Sent Email via Gmail',
        };
      case 'EMAIL_ARCHIVED':
        return {
          icon: <Archive size={16} />,
          gradient: 'from-slate-600 to-slate-700 text-white',
          badgeBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          title: 'Archived Conversation',
        };
      case 'EMAIL_DELETED':
        return {
          icon: <Trash2 size={16} />,
          gradient: 'from-rose-600 to-red-600 text-white',
          badgeBg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/50',
          title: 'Moved Email to Trash',
        };
      case 'EMAIL_STARRED':
        return {
          icon: <Star size={16} className="fill-amber-400 text-amber-500" />,
          gradient: 'from-amber-500 to-orange-500 text-white',
          badgeBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/50',
          title: 'Starred Conversation',
        };
      case 'EMAIL_UNSTARRED':
        return {
          icon: <Star size={16} />,
          gradient: 'from-slate-400 to-slate-500 text-white',
          badgeBg: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
          title: 'Unstarred Conversation',
        };
      case 'EMAIL_VIEWED':
        return {
          icon: <Mail size={16} />,
          gradient: 'from-sky-500 to-blue-600 text-white',
          badgeBg: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-900/50',
          title: 'Viewed Email Conversation',
        };
      default:
        return {
          icon: <ActivityIcon size={16} />,
          gradient: 'from-indigo-500 to-blue-600 text-white',
          badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-cyan-300 border-indigo-200 dark:border-indigo-900/50',
          title: action.replace(/_/g, ' '),
        };
    }
  };

  const filteredActivities = activities.filter((act: Activity) => {
    if (filterCategory === 'AI') {
      return act.action === 'EMAIL_SUMMARIZED' || act.action === 'REPLY_GENERATED';
    }
    if (filterCategory === 'EMAILS') {
      return act.action === 'EMAIL_SENT' || act.action === 'EMAIL_VIEWED';
    }
    if (filterCategory === 'LABELS') {
      return (
        act.action === 'EMAIL_ARCHIVED' ||
        act.action === 'EMAIL_DELETED' ||
        act.action === 'EMAIL_STARRED' ||
        act.action === 'EMAIL_UNSTARRED' ||
        act.action === 'EMAIL_MARKED_READ' ||
        act.action === 'EMAIL_MARKED_UNREAD'
      );
    }
    return true;
  });

  const formatTimestamp = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return {
        relative: formatDistanceToNow(d, { addSuffix: true }),
        exact: format(d, 'MMM d, yyyy h:mm a'),
      };
    } catch {
      return { relative: 'Recently', exact: '' };
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f6f8fc] dark:bg-slate-950 text-gray-900 dark:text-gray-100 overflow-y-auto transition-colors duration-200">
      {/* Top Header */}
      <div className="px-4 sm:px-8 py-4 sm:py-5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200/80 dark:border-slate-800 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate(-1)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            title="Back to inbox"
          >
            <ArrowLeft size={18} />
          </motion.button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-2xs">
                <ActivityIcon size={16} />
              </div>
              <span>Activity History</span>
            </h1>
            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 hidden sm:block">
              Audit log of all email interactions, AI summarizations, and draft generations.
            </p>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => refetch()}
          disabled={isLoading || isFetching}
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center gap-1.5 text-xs font-semibold"
          title="Refresh activity feed"
        >
          <RotateCw size={16} className={isFetching ? 'animate-spin text-indigo-600 dark:text-cyan-400' : ''} />
          <span className="hidden sm:inline">Refresh</span>
        </motion.button>
      </div>

      <div className="p-3.5 sm:p-8 max-w-4xl mx-auto w-full space-y-4 sm:space-y-6">
        {/* Filter Pills Bar (Scrollable on mobile) */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold overflow-x-auto no-scrollbar pb-1">
          <span className="text-gray-400 dark:text-gray-500 flex items-center gap-1 mr-1 shrink-0 text-[11px]">
            <Filter size={12} /> Filter:
          </span>
          {(
            [
              { key: 'ALL', label: 'All Events', count: activities.length },
              {
                key: 'AI',
                label: 'AI Copilot',
                count: activities.filter((a) => a.action === 'EMAIL_SUMMARIZED' || a.action === 'REPLY_GENERATED').length,
              },
              {
                key: 'EMAILS',
                label: 'Messages',
                count: activities.filter((a) => a.action === 'EMAIL_SENT' || a.action === 'EMAIL_VIEWED').length,
              },
              {
                key: 'LABELS',
                label: 'Labels & Trash',
                count: activities.filter((a) =>
                  ['EMAIL_ARCHIVED', 'EMAIL_DELETED', 'EMAIL_STARRED', 'EMAIL_UNSTARRED', 'EMAIL_MARKED_READ', 'EMAIL_MARKED_UNREAD'].includes(
                    a.action
                  )
                ).length,
              },
            ] as { key: FilterCategory; label: string; count: number }[]
          ).map((item) => {
            const active = filterCategory === item.key;
            return (
              <motion.button
                key={item.key}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterCategory(item.key)}
                className={`px-3.5 py-1.5 rounded-full transition-all shrink-0 flex items-center gap-1.5 text-xs font-bold ${
                  active
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200/80 dark:border-slate-800'
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {item.count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Timeline Container */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl border border-gray-200/80 dark:border-slate-800 shadow-md shadow-indigo-500/5 p-4 sm:p-6 overflow-hidden">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3.5 py-3 border-b border-gray-100 dark:border-slate-800 last:border-none">
                  <div className="w-9 h-9 bg-gray-200 dark:bg-slate-800 rounded-2xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="w-1/3 h-4 bg-gray-200 dark:bg-slate-800 rounded-md" />
                    <div className="w-1/2 h-3 bg-gray-100 dark:bg-slate-700 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-12 text-gray-400 dark:text-gray-500">
              <div className="w-14 h-14 rounded-3xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 dark:text-cyan-400 flex items-center justify-center mx-auto mb-3 border border-indigo-100/60 dark:border-indigo-900/40">
                <Clock size={28} />
              </div>
              <div className="text-sm font-bold text-gray-800 dark:text-gray-200">No events recorded in this category</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-sm mx-auto">
                Actions you perform in NexusMail are logged here automatically.
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-slate-800/80">
              <AnimatePresence mode="popLayout">
                {filteredActivities.map((act: Activity) => {
                  const theme = getActionTheme(act.action);
                  const time = formatTimestamp(act.createdAt);

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      key={act.id}
                      className="py-3.5 sm:py-4 flex items-start gap-3 sm:gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 -mx-4 sm:-mx-6 px-4 sm:px-6 transition-colors rounded-2xl"
                    >
                      {/* Action Icon Badge */}
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm bg-gradient-to-tr ${theme.gradient}`}
                      >
                        {theme.icon}
                      </div>

                      {/* Main Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-[13.5px] text-gray-900 dark:text-gray-100">
                              {theme.title}
                            </span>
                            {act.action.includes('SUMMARIZED') && (
                              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 uppercase">
                                AI
                              </span>
                            )}
                          </div>
                          <span
                            className="text-[11px] text-gray-400 dark:text-gray-500 shrink-0 font-sans"
                            title={time.exact}
                          >
                            {time.relative}
                          </span>
                        </div>

                        {/* Event Metadata (Subject, Tone, Sender) */}
                        {act.metadata && (
                          <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                            {act.metadata.subject && (
                              <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300 truncate max-w-full sm:max-w-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-gray-200/60 dark:border-slate-700">
                                {act.metadata.subject}
                              </span>
                            )}
                            {act.metadata.tone && (
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-cyan-300 rounded-lg border border-indigo-100 dark:border-indigo-900/60">
                                Tone: {act.metadata.tone}
                              </span>
                            )}
                            {act.metadata.sender && (
                              <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                from {act.metadata.sender}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
