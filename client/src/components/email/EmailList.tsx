import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Inbox,
  RotateCw,
  Archive,
  Trash2,
  Mail,
  MailOpen,
  CheckSquare,
  Square,
  Tag,
  Users,
  Info,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { Email } from '../../types';
import { EmailListItem } from './EmailListItem';
import { EmailListSkeleton } from '../common/Skeleton';

export type CategoryTab = 'primary' | 'promotions' | 'social' | 'updates';

interface EmailListProps {
  emails: Email[];
  isLoading: boolean;
  isError: boolean;
  error?: any;
  activeCategory?: CategoryTab;
  onCategoryChange?: (cat: CategoryTab) => void;
  onRefresh: () => void;
  onToggleStar: (id: string, isStarred: boolean) => void;
  onToggleRead: (id: string, isRead: boolean) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onBatchArchive?: (ids: string[]) => void;
  onBatchDelete?: (ids: string[]) => void;
  onBatchMarkRead?: (ids: string[], isRead: boolean) => void;
  // Pagination props
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  pageIndex?: number;
  pageSize?: number;
  totalEstimate?: number;
  emptyTitle?: string;
  emptySubtitle?: string;
  isInboxFolder?: boolean;
}

export const EmailList: React.FC<EmailListProps> = ({
  emails,
  isLoading,
  isError,
  error,
  activeCategory = 'primary',
  onCategoryChange,
  onRefresh,
  onToggleStar,
  onToggleRead,
  onArchive,
  onDelete,
  onBatchArchive,
  onBatchDelete,
  onBatchMarkRead,
  hasNextPage = false,
  hasPrevPage = false,
  onNextPage,
  onPrevPage,
  pageIndex = 0,
  pageSize = 50,
  totalEstimate,
  emptyTitle = 'No emails found',
  emptySubtitle = 'Your inbox is all caught up!',
  isInboxFolder = true,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const allSelected = emails.length > 0 && selectedIds.length === emails.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(emails.map((e) => e.id));
    }
  };

  const handleSelectOne = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleBatchAction = (action: 'archive' | 'delete' | 'read' | 'unread') => {
    if (selectedIds.length === 0) return;
    if (action === 'archive' && onBatchArchive) {
      onBatchArchive(selectedIds);
    } else if (action === 'delete' && onBatchDelete) {
      onBatchDelete(selectedIds);
    } else if (action === 'read' && onBatchMarkRead) {
      onBatchMarkRead(selectedIds, true);
    } else if (action === 'unread' && onBatchMarkRead) {
      onBatchMarkRead(selectedIds, false);
    }
    setSelectedIds([]);
  };

  const startRange = emails.length > 0 ? pageIndex * pageSize + 1 : 0;
  const endRange = emails.length > 0 ? pageIndex * pageSize + emails.length : 0;
  const totalDisplay = totalEstimate && totalEstimate > endRange ? `${totalEstimate}+` : `${endRange || 0}`;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden select-none transition-colors duration-200">
      {/* Top Action Toolbar */}
      <div className="px-3 sm:px-4 py-2 border-b border-gray-100 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Select All Checkbox */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={handleSelectAll}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
            title={allSelected ? 'Deselect all' : 'Select all'}
          >
            {allSelected ? (
              <CheckSquare size={17} className="text-indigo-600 dark:text-cyan-400" />
            ) : someSelected ? (
              <div className="w-4 h-4 bg-indigo-600 dark:bg-cyan-500 rounded-xs flex items-center justify-center text-white text-[10px] font-bold">
                -
              </div>
            ) : (
              <Square size={17} />
            )}
          </motion.button>

          {/* Batch Actions */}
          {selectedIds.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1 pl-1 sm:pl-2 border-l border-gray-200 dark:border-slate-700"
            >
              <span className="text-[11px] sm:text-xs font-bold text-indigo-700 dark:text-cyan-300 mr-1 sm:mr-2 px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/80 rounded-full border border-indigo-200/50 dark:border-indigo-800/50">
                {selectedIds.length} selected
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleBatchAction('archive')}
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                title="Archive selected"
              >
                <Archive size={16} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleBatchAction('delete')}
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-full transition-colors"
                title="Delete selected"
              >
                <Trash2 size={16} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleBatchAction('read')}
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                title="Mark as read"
              >
                <MailOpen size={16} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleBatchAction('unread')}
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                title="Mark as unread"
              >
                <Mail size={16} />
              </motion.button>
            </motion.div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center gap-1.5"
              title="Refresh / Sync with Gmail"
            >
              <RotateCw size={15} className={isLoading ? 'animate-spin text-indigo-600 dark:text-cyan-400' : ''} />
              <span className="hidden sm:inline text-xs font-semibold text-gray-600 dark:text-gray-300">
                {isLoading ? 'Syncing...' : 'Sync'}
              </span>
            </motion.button>
          )}
        </div>

        {/* Pagination Toolbar */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500 dark:text-gray-400 font-medium">
          <span className="font-mono text-[11px] sm:text-xs">
            {emails.length > 0 ? `${startRange}–${endRange} of ${totalDisplay}` : '0 messages'}
          </span>
          <div className="flex items-center gap-0.5">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={onPrevPage}
              disabled={!hasPrevPage || isLoading}
              className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Newer page"
            >
              <ChevronLeft size={17} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={onNextPage}
              disabled={!hasNextPage || isLoading}
              className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Older page"
            >
              <ChevronRight size={17} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Gmail Category Tabs Strip */}
      {isInboxFolder && (
        <div className="flex items-center border-b border-gray-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shrink-0 text-xs font-medium transition-colors overflow-x-auto no-scrollbar relative">
          <button
            onClick={() => onCategoryChange && onCategoryChange('primary')}
            className={`flex-1 min-w-[105px] py-3 px-3 sm:px-4 flex items-center justify-center gap-2 transition-all relative ${
              activeCategory === 'primary'
                ? 'text-indigo-600 dark:text-cyan-400 font-bold'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Inbox size={15} />
            <span>Primary</span>
            {activeCategory === 'primary' && (
              <motion.div
                layoutId="categoryTabUnderline"
                className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-indigo-600 to-cyan-500"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>

          <button
            onClick={() => onCategoryChange && onCategoryChange('promotions')}
            className={`flex-1 min-w-[105px] py-3 px-3 sm:px-4 flex items-center justify-center gap-2 transition-all relative ${
              activeCategory === 'promotions'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Tag size={15} />
            <span>Promotions</span>
            {activeCategory === 'promotions' && (
              <motion.div
                layoutId="categoryTabUnderline"
                className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>

          <button
            onClick={() => onCategoryChange && onCategoryChange('social')}
            className={`flex-1 min-w-[105px] py-3 px-3 sm:px-4 flex items-center justify-center gap-2 transition-all relative ${
              activeCategory === 'social'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Users size={15} />
            <span>Social</span>
            {activeCategory === 'social' && (
              <motion.div
                layoutId="categoryTabUnderline"
                className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>

          <button
            onClick={() => onCategoryChange && onCategoryChange('updates')}
            className={`flex-1 min-w-[105px] py-3 px-3 sm:px-4 flex items-center justify-center gap-2 transition-all relative ${
              activeCategory === 'updates'
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Info size={15} />
            <span>Updates</span>
            {activeCategory === 'updates' && (
              <motion.div
                layoutId="categoryTabUnderline"
                className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-400"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        </div>
      )}

      {/* Email List Content */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800/60">
        {isLoading ? (
          <EmailListSkeleton count={10} />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3 shadow-xs">
              <Info size={24} />
            </div>
            <div className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">
              Could not load emails
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mb-4">
              {error?.message || 'There was an error communicating with Gmail. Try refreshing.'}
            </div>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={onRefresh}
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full text-xs font-semibold shadow-xs"
            >
              Retry Sync
            </motion.button>
          </div>
        ) : emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 p-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-cyan-950/50 text-indigo-600 dark:text-cyan-400 flex items-center justify-center mb-4 shadow-sm border border-indigo-100/60 dark:border-indigo-900/40">
              <Sparkles size={28} />
            </div>
            <div className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
              {emptyTitle}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 max-w-md mb-5 leading-relaxed">
              {emptySubtitle}
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={onRefresh}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-bold rounded-full text-xs shadow-md shadow-indigo-500/20 flex items-center gap-2"
            >
              <Zap size={14} />
              Sync Gmail Now
            </motion.button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {emails.map((email) => (
                <EmailListItem
                  key={email.id}
                  email={email}
                  isSelected={selectedIds.includes(email.id)}
                  onSelect={handleSelectOne}
                  onToggleStar={onToggleStar}
                  onToggleRead={onToggleRead}
                  onArchive={onArchive}
                  onDelete={onDelete}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
