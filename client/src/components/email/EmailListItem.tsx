import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  Archive,
  Trash2,
  Mail,
  MailOpen,
} from 'lucide-react';
import { format, isToday, isYesterday, isThisYear } from 'date-fns';
import { Email } from '../../types';

interface EmailListItemProps {
  email: Email;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onToggleStar: (id: string, isStarred: boolean) => void;
  onToggleRead: (id: string, isRead: boolean) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

const getAvatarColor = (name: string) => {
  const gradients = [
    'from-blue-600 to-indigo-600 text-white',
    'from-indigo-600 to-purple-600 text-white',
    'from-purple-600 to-pink-600 text-white',
    'from-cyan-600 to-blue-600 text-white',
    'from-emerald-600 to-teal-600 text-white',
    'from-amber-500 to-orange-600 text-white',
    'from-rose-500 to-red-600 text-white',
    'from-violet-600 to-indigo-700 text-white',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
};

export const EmailListItem: React.FC<EmailListItemProps> = ({
  email,
  isSelected,
  onSelect,
  onToggleStar,
  onToggleRead,
  onArchive,
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleRowClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input[type="checkbox"]')) {
      return;
    }
    navigate(`/email/${email.id}`);
  };

  const formatDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      if (isToday(date)) {
        return format(date, 'h:mm a');
      }
      if (isYesterday(date)) {
        return 'Yesterday';
      }
      if (isThisYear(date)) {
        return format(date, 'MMM d');
      }
      return format(date, 'MM/dd/yy');
    } catch {
      return '';
    }
  };

  const cleanSenderName = (rawSender: string) => {
    const match = rawSender.match(/^"?([^"<]+)"?\s*(?:<.*>)?$/);
    if (match && match[1].trim()) {
      return match[1].trim();
    }
    return rawSender.split('@')[0] || rawSender;
  };

  const senderName = cleanSenderName(email.sender);
  const initial = senderName.charAt(0).toUpperCase() || 'U';

  return (
    <motion.div
      onClick={handleRowClick}
      whileHover={{ backgroundColor: email.isRead ? undefined : undefined }}
      transition={{ duration: 0.1 }}
      className={`group border-b border-gray-100 dark:border-slate-800/80 hover:shadow-xs transition-colors duration-100 cursor-pointer select-none relative ${
        isSelected
          ? 'bg-indigo-50/70 dark:bg-indigo-950/40'
          : email.isRead
          ? 'bg-[#f4f7fc]/40 dark:bg-slate-900/30 hover:bg-[#e9f0fa] dark:hover:bg-slate-800/60'
          : 'bg-white dark:bg-slate-900 font-medium hover:bg-[#f6f9fe] dark:hover:bg-slate-800'
      }`}
    >
      {/* Active Selection Indicator Bar */}
      {isSelected && (
        <div className="absolute left-0 inset-y-0 w-1 bg-indigo-600 dark:bg-cyan-400 rounded-r-md" />
      )}

      {/* MOBILE LAYOUT (< md) */}
      <div className="flex md:hidden items-start px-3 py-3 gap-3">
        {/* Avatar Circle with gradient */}
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs mt-0.5 bg-gradient-to-tr ${getAvatarColor(
            senderName
          )}`}
        >
          {initial}
        </div>

        {/* Middle Content */}
        <div className="flex-1 min-w-0">
          {/* Top Row: Sender + Date */}
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span
              className={`truncate text-sm ${
                email.isRead
                  ? 'text-gray-700 dark:text-gray-300 font-normal'
                  : 'text-gray-950 dark:text-white font-bold'
              }`}
            >
              {senderName}
            </span>
            <span
              className={`text-xs shrink-0 ${
                email.isRead
                  ? 'text-gray-400 dark:text-gray-500 font-normal'
                  : 'text-indigo-600 dark:text-cyan-400 font-bold'
              }`}
            >
              {formatDate(email.receivedAt)}
            </span>
          </div>

          {/* Subject Line */}
          <div
            className={`truncate text-[13px] mb-0.5 ${
              email.isRead
                ? 'text-gray-800 dark:text-gray-300 font-normal'
                : 'text-gray-900 dark:text-gray-100 font-semibold'
            }`}
          >
            {email.subject || '(No Subject)'}
          </div>

          {/* Snippet Preview */}
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate font-normal">
            {email.snippet || ''}
          </div>
        </div>

        {/* Star Button */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar(email.id, email.isStarred);
          }}
          className="p-1 text-gray-400 dark:text-gray-500 hover:text-amber-500 shrink-0 self-center"
        >
          <Star
            size={18}
            className={email.isStarred ? 'fill-amber-400 text-amber-500' : ''}
          />
        </motion.button>
      </div>

      {/* DESKTOP LAYOUT (>= md) */}
      <div className="hidden md:flex items-center px-4 py-2 text-sm">
        {/* Left Column: Checkbox, Star & Sender Avatar */}
        <div className="flex items-center gap-3 shrink-0 mr-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(email.id, e.target.checked)}
            className="w-4 h-4 rounded-xs border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-colors"
            onClick={(e) => e.stopPropagation()}
          />

          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(email.id, email.isStarred);
            }}
            className={`p-1 rounded-full transition-colors ${
              email.isStarred
                ? 'text-amber-500 hover:text-amber-600'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
            title={email.isStarred ? 'Starred' : 'Not starred'}
          >
            <Star
              size={17}
              className={email.isStarred ? 'fill-amber-400 text-amber-500' : ''}
            />
          </motion.button>

          {/* Sender Avatar Circle */}
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs bg-gradient-to-tr ${getAvatarColor(
              senderName
            )}`}
          >
            {initial}
          </div>
        </div>

        {/* Sender Name */}
        <div className="w-44 shrink-0 truncate pr-3">
          <span
            className={`text-[13.5px] ${
              email.isRead
                ? 'text-gray-700 dark:text-gray-300 font-normal'
                : 'text-gray-950 dark:text-white font-bold'
            }`}
          >
            {senderName}
          </span>
        </div>

        {/* Subject & Snippet Preview */}
        <div className="flex-1 min-w-0 flex items-center gap-2 truncate pr-4">
          <span
            className={`truncate text-[13.5px] ${
              email.isRead
                ? 'text-gray-800 dark:text-gray-300 font-normal'
                : 'text-gray-900 dark:text-gray-100 font-bold'
            }`}
          >
            {email.subject || '(No Subject)'}
          </span>
          <span className="text-gray-400 dark:text-gray-600 text-xs shrink-0">-</span>
          <span className="text-gray-500 dark:text-gray-400 text-xs truncate font-normal">
            {email.snippet || ''}
          </span>
        </div>

        {/* Right Column: Date & Quick Actions on Hover */}
        <div className="shrink-0 flex items-center justify-end min-w-[110px]">
          <div
            className={`text-xs ${
              email.isRead
                ? 'text-gray-500 dark:text-gray-400'
                : 'text-gray-900 dark:text-gray-100 font-bold'
            } group-hover:hidden`}
          >
            {formatDate(email.receivedAt)}
          </div>

          {/* Hover Action Buttons */}
          <div className="hidden group-hover:flex items-center gap-1">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={(e) => {
                e.stopPropagation();
                onArchive(email.id);
              }}
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/80 dark:hover:bg-slate-700 rounded-full transition-colors"
              title="Archive"
            >
              <Archive size={16} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(email.id);
              }}
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-full transition-colors"
              title="Delete"
            >
              <Trash2 size={16} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleRead(email.id, email.isRead);
              }}
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200/80 dark:hover:bg-slate-700 rounded-full transition-colors"
              title={email.isRead ? 'Mark as unread' : 'Mark as read'}
            >
              {email.isRead ? <Mail size={16} /> : <MailOpen size={16} />}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
