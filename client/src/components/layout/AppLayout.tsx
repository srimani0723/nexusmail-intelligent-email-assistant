import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ComposeModal } from '../compose/ComposeModal';
import { useQuery } from '@tanstack/react-query';
import { emailApi } from '../../api/client';
import { Plus, X } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(() => window.innerWidth >= 1024);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isComposeOpen, setIsComposeOpen] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const searchQuery = searchParams.get('q') || '';

  // Close mobile sidebar on route/param change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  // Query unread count for sidebar badge
  const { data: inboxData } = useQuery({
    queryKey: ['emails', 'inbox'],
    queryFn: () => emailApi.getEmails({ folder: 'inbox', limit: 50 }),
    refetchInterval: 30000,
  });

  const unreadCount = inboxData?.emails.filter((e) => !e.isRead).length || 0;

  const handleSearch = (query: string) => {
    if (query) {
      navigate(`/inbox?q=${encodeURIComponent(query)}`);
    } else {
      const folder = searchParams.get('folder') || 'inbox';
      navigate(`/inbox?folder=${folder}`);
    }
  };

  const handleToggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen((prev) => !prev);
    } else {
      setIsSidebarExpanded((prev) => !prev);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f6f8fc] dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Google Header */}
      <Header
        onToggleSidebar={handleToggleSidebar}
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Backdrop Overlay */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          />
        )}

        {/* Sidebar Drawer on Mobile / Standard Column on Desktop */}
        <div
          className={`z-50 md:z-auto transition-transform duration-200 ease-out md:static md:translate-x-0 ${
            isMobileMenuOpen
              ? 'fixed inset-y-0 left-0 top-0 w-72 max-w-[80vw] bg-[#f6f8fc] dark:bg-slate-950 shadow-2xl translate-x-0 flex flex-col pt-3'
              : 'hidden md:flex'
          }`}
        >
          {/* Mobile drawer close header */}
          {isMobileMenuOpen && (
            <div className="px-4 pb-2 flex items-center justify-between md:hidden border-b border-gray-200/80 dark:border-slate-800">
              <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-200 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>
          )}

          <Sidebar
            isExpanded={isSidebarExpanded || isMobileMenuOpen}
            onOpenCompose={() => {
              setIsComposeOpen(true);
              setIsMobileMenuOpen(false);
            }}
            unreadCount={unreadCount}
          />
        </div>

        {/* Content Container (Full width on mobile, Rounded Card on Desktop) */}
        <main className="flex-1 overflow-hidden bg-white dark:bg-slate-900 rounded-none sm:rounded-2xl sm:mr-3 sm:mb-3 shadow-xs border-0 sm:border border-gray-200/80 dark:border-slate-800 flex flex-col relative transition-colors duration-200 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Floating Action Button (FAB) for Compose on Mobile Screens */}
      <button
        onClick={() => setIsComposeOpen(true)}
        className="md:hidden fixed bottom-5 right-5 z-30 w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 text-google-blue dark:text-blue-400 compose-button-shadow border border-gray-200 dark:border-slate-700 flex items-center justify-center active:scale-95 transition-transform"
        title="Compose email"
        aria-label="Compose new message"
      >
        <Plus size={26} />
      </button>

      {/* Compose Dialog */}
      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
      />
    </div>
  );
};
