import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Search,
  X,
  Sparkles,
  Settings as SettingsIcon,
  Activity as ActivityIcon,
  LogOut,
  SlidersHorizontal,
  ShieldCheck,
  Moon,
  Sun,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { AiLogo } from '../common/AiLogo';

interface HeaderProps {
  onToggleSidebar: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onSearch,
  searchQuery,
}) => {
  const { user, logout } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Global keyboard shortcut '/' or 'Ctrl+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || (e.ctrlKey && e.key === 'k') || (e.metaKey && e.key === 'k')) &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearch.trim());
    setIsFilterDropdownOpen(false);
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    onSearch('');
    searchInputRef.current?.focus();
  };

  const handleQuickFilter = (filterQuery: string) => {
    setLocalSearch(filterQuery);
    onSearch(filterQuery);
    setIsFilterDropdownOpen(false);
  };

  return (
    <header className="h-14 sm:h-16 bg-[#f6f8fc]/90 dark:bg-slate-950/90 backdrop-blur-md px-2.5 sm:px-5 flex items-center justify-between gap-2 sm:gap-4 select-none sticky top-0 z-30 transition-colors duration-200 border-b border-gray-200/50 dark:border-slate-800/60">
      {/* Left: Brand & Sidebar Toggle */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onToggleSidebar}
          className="p-2 sm:p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-slate-800/80 rounded-full transition-colors focus:outline-none"
          title="Toggle Navigation Menu"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </motion.button>

        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <AiLogo size="sm" animated={true} />
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent font-sans">
              Nexus<span className="text-indigo-600 dark:text-cyan-400">Mail</span>
            </span>
            <span className="hidden md:inline-flex text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white shadow-2xs items-center gap-1">
              <Sparkles size={9} />
              AI Copilot
            </span>
          </div>
        </div>
      </div>

      {/* Center: Fluid Framer Motion Search Bar */}
      <div className="flex-1 max-w-2xl min-w-0 relative">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <motion.div
            animate={{
              boxShadow: isSearchFocused
                ? resolvedTheme === 'dark'
                  ? '0 0 0 2px rgba(99, 102, 241, 0.4), 0 8px 20px -4px rgba(0, 0, 0, 0.5)'
                  : '0 0 0 2px rgba(99, 102, 241, 0.3), 0 8px 20px -4px rgba(99, 102, 241, 0.15)'
                : '0 0 0 0px transparent',
            }}
            transition={{ duration: 0.2 }}
            className={`flex items-center rounded-full transition-all duration-200 px-3 sm:px-4 py-1.5 sm:py-2 border ${
              isSearchFocused
                ? 'bg-white dark:bg-slate-900 border-indigo-500/80 dark:border-indigo-400'
                : 'bg-[#eaf1fb]/80 dark:bg-slate-800/80 hover:bg-[#e1ecfb] dark:hover:bg-slate-800 border-transparent'
            }`}
          >
            <button
              type="submit"
              className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-cyan-400 mr-2 sm:mr-3 p-0.5 rounded-full transition-colors shrink-0"
              aria-label="Search mail"
            >
              <Search size={16} className="sm:w-[17px] sm:h-[17px]" />
            </button>
            <input
              ref={searchInputRef}
              type="text"
              value={localSearch}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search emails, AI tags, or type '/'..."
              className="w-full bg-transparent border-none text-xs sm:text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none min-w-0 font-sans"
            />
            {localSearch && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-white p-1 rounded-full hover:bg-gray-200/70 dark:hover:bg-slate-700 mr-1 transition-colors shrink-0"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
            <div className="relative shrink-0" ref={filterRef}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="p-1 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-cyan-400 hover:bg-gray-200/70 dark:hover:bg-slate-700 rounded-full transition-colors"
                title="Search options & filters"
              >
                <SlidersHorizontal size={14} className="sm:w-[15px] sm:h-[15px]" />
              </motion.button>

              {/* Filter Options Dropdown */}
              <AnimatePresence>
                {isFilterDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -6 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 mt-3 w-60 sm:w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 p-2 z-50 text-xs"
                  >
                    <div className="px-3 py-1.5 font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px] flex items-center justify-between">
                      <span>Quick Filters</span>
                      <Zap size={11} className="text-amber-500" />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleQuickFilter('is:unread')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-cyan-400 flex items-center justify-between transition-colors"
                    >
                      <span>Unread emails</span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">is:unread</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFilter('is:starred')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-cyan-400 flex items-center justify-between transition-colors"
                    >
                      <span>Starred emails</span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">is:starred</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFilter('has:attachment')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-cyan-400 flex items-center justify-between transition-colors"
                    >
                      <span>Has attachment</span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">has:attachment</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </form>
      </div>

      {/* Right: Theme Switcher & User Avatar */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <motion.button
          whileTap={{ scale: 0.88, rotate: 20 }}
          onClick={toggleTheme}
          className="p-2 sm:p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-slate-800/80 rounded-full transition-colors focus:outline-none"
          title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} theme`}
          aria-label="Toggle dark mode"
        >
          {resolvedTheme === 'dark' ? (
            <Sun size={18} className="text-amber-400" />
          ) : (
            <Moon size={18} className="text-indigo-600" />
          )}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => navigate('/activity')}
          className={`hidden sm:flex p-2.5 rounded-full transition-colors ${
            location.pathname === '/activity'
              ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-cyan-300 shadow-2xs'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-slate-800/80'
          }`}
          title="Activity History"
          aria-label="Activity Log"
        >
          <ActivityIcon size={18} />
        </motion.button>

        {/* User Avatar & Dropdown */}
        <div className="relative ml-0.5" ref={menuRef}>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-transparent hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all shadow-xs"
            aria-label="Account details"
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name || 'User avatar'} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center font-bold text-xs sm:text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </motion.button>

          {/* Account Dropdown Card */}
          <AnimatePresence>
            {isAccountMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-72 sm:w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 py-4 px-4 z-50"
              >
                <div className="flex flex-col items-center pb-4 border-b border-gray-100 dark:border-slate-800 text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden mb-2 ring-2 ring-indigo-500/30 dark:ring-cyan-500/30 shadow-md">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white text-xl sm:text-2xl flex items-center justify-center font-bold">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base">{user?.name || 'NexusMail User'}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-full">{user?.email}</div>
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold border border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs">
                    <ShieldCheck size={12} />
                    Google OAuth 2.0 Connected
                  </div>
                </div>

                <div className="py-2.5 space-y-1">
                  <button
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl flex items-center gap-2.5 transition-colors font-medium hover:text-indigo-600 dark:hover:text-cyan-300"
                  >
                    <SettingsIcon size={15} className="text-gray-500 dark:text-gray-400" />
                    Account & AI Settings
                  </button>
                  <button
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      navigate('/activity');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl flex items-center gap-2.5 transition-colors font-medium hover:text-indigo-600 dark:hover:text-cyan-300"
                  >
                    <ActivityIcon size={15} className="text-gray-500 dark:text-gray-400" />
                    Activity History
                  </button>
                </div>

                <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl flex items-center gap-2.5 transition-colors font-semibold"
                  >
                    <LogOut size={15} />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
