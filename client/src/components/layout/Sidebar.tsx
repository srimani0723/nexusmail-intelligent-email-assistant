import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Inbox,
  Star,
  Send,
  FileText,
  Archive,
  Trash2,
  Plus,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  isExpanded?: boolean;
  collapsed?: boolean;
  onOpenCompose: () => void;
  unreadCount?: number;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  activeColor: string;
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isExpanded = true,
  collapsed,
  onOpenCompose,
  unreadCount = 0,
}) => {
  const isCollapsed = collapsed !== undefined ? collapsed : !isExpanded;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentFolder = searchParams.get('folder') || 'inbox';
  const isDashboard = location.pathname === '/inbox' || location.pathname === '/' || location.pathname.startsWith('/email');

  const navItems: NavItem[] = [
    {
      name: 'Inbox',
      path: '/inbox?folder=inbox',
      icon: <Inbox size={18} />,
      activeColor: 'text-indigo-600 dark:text-cyan-300 bg-indigo-50/80 dark:bg-indigo-950/60 font-semibold',
      badge: unreadCount,
    },
    {
      name: 'Starred',
      path: '/inbox?folder=starred',
      icon: <Star size={18} />,
      activeColor: 'text-amber-600 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-950/60 font-semibold',
    },
    {
      name: 'Sent',
      path: '/inbox?folder=sent',
      icon: <Send size={18} />,
      activeColor: 'text-indigo-600 dark:text-cyan-300 bg-indigo-50/80 dark:bg-indigo-950/60 font-semibold',
    },
    {
      name: 'Drafts',
      path: '/inbox?folder=drafts',
      icon: <FileText size={18} />,
      activeColor: 'text-indigo-600 dark:text-cyan-300 bg-indigo-50/80 dark:bg-indigo-950/60 font-semibold',
    },
    {
      name: 'Archive',
      path: '/inbox?folder=archive',
      icon: <Archive size={18} />,
      activeColor: 'text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-slate-800 font-semibold',
    },
    {
      name: 'Trash',
      path: '/inbox?folder=trash',
      icon: <Trash2 size={18} />,
      activeColor: 'text-rose-600 dark:text-rose-300 bg-rose-50/80 dark:bg-rose-950/60 font-semibold',
    },
  ];

  const isItemActive = (itemPath: string) => {
    if (!isDashboard) return false;
    const itemFolder = itemPath.split('folder=')[1] || 'inbox';
    return currentFolder === itemFolder;
  };

  return (
    <aside
      className={`bg-[#f6f8fc]/80 dark:bg-slate-950/80 backdrop-blur-xs flex flex-col justify-between select-none transition-all duration-200 ease-in-out shrink-0 h-full ${
        isCollapsed ? 'w-18 px-2' : 'w-64 px-3'
      }`}
    >
      <div className="flex flex-col gap-1 py-1">
        {/* Floating Gradient AI + Compose Button */}
        <div className="mb-4 mt-2 px-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenCompose}
            className={`group relative flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-cyan-500 text-white transition-all duration-300 shadow-md shadow-indigo-500/25 active:scale-98 overflow-hidden ${
              isCollapsed ? 'w-12 h-12 rounded-2xl mx-auto' : 'px-5 py-3.5 rounded-2xl w-full'
            }`}
            title="Compose new message"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

            <div className="relative flex items-center justify-center">
              <Plus size={20} className="stroke-[2.5]" />
            </div>
            {!isCollapsed && (
              <span className="font-semibold text-sm tracking-wide font-sans">
                Compose
              </span>
            )}
          </motion.button>
        </div>

        {/* Navigation Item List */}
        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const active = isItemActive(item.path);
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3.5 rounded-2xl transition-all duration-150 relative ${
                  isCollapsed
                    ? 'w-11 h-11 justify-center mx-auto'
                    : 'px-4 py-2.5 w-full text-sm'
                } ${
                  active
                    ? item.activeColor
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-slate-800/60 hover:text-gray-950 dark:hover:text-white font-medium'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <div className={`shrink-0 ${active ? 'text-inherit' : 'text-gray-500 dark:text-gray-400'}`}>
                  {item.icon}
                </div>
                {!isCollapsed && (
                  <div className="flex items-center justify-between flex-1 truncate">
                    <span className="truncate text-[13.5px]">
                      {item.name}
                    </span>
                    {item.badge && item.badge > 0 ? (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-cyan-300 ml-2">
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer: AI Engine Status */}
      {!isCollapsed && (
        <div className="p-3.5 mb-3 bg-gradient-to-br from-indigo-50/70 via-white/80 to-purple-50/50 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-indigo-950/40 backdrop-blur-md rounded-2xl border border-indigo-100/70 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-gray-100">
              <div className="p-1 rounded-md bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-2xs">
                <Sparkles size={12} />
              </div>
              <span>Nexus Intelligence</span>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 uppercase">
              Live
            </span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
            Gemini 3.5 Flash Lite engine actively filtering & summarizing your mail.
          </p>
          <div className="mt-2.5 pt-2 border-t border-indigo-100/50 dark:border-slate-800 flex items-center justify-between text-[10px] text-indigo-700 dark:text-cyan-400 font-semibold">
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} />
              AES-256 Vault
            </span>
            <span className="text-gray-400 dark:text-gray-500">OAuth 2.0</span>
          </div>
        </div>
      )}
    </aside>
  );
};
