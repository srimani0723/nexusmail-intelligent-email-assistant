import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Settings as SettingsIcon,
  ShieldCheck,
  Sparkles,
  Lock,
  Trash2,
  CheckCircle2,
  RotateCw,
  AlertTriangle,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';
import { accountApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../components/common/Toast';
import { AiLogo } from '../components/common/AiLogo';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  const { data: accountInfo, isLoading } = useQuery({
    queryKey: ['account'],
    queryFn: () => accountApi.getAccount(),
  });

  const disconnectMutation = useMutation({
    mutationFn: () => accountApi.disconnectAccount(),
    onSuccess: () => {
      showToast({ message: 'Google account disconnected successfully', type: 'info' });
      logout();
    },
    onError: (err: any) => {
      showToast({ message: err.message || 'Failed to disconnect account', type: 'error' });
    },
  });

  return (
    <div className="flex flex-col h-full bg-[#f6f8fc] dark:bg-slate-950 text-gray-900 dark:text-gray-100 overflow-y-auto transition-colors duration-200">
      {/* Header */}
      <div className="px-8 py-5 bg-white dark:bg-slate-900 border-b border-gray-200/80 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <SettingsIcon size={22} className="text-google-blue" />
            Account & Preferences
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Manage your connected Google credentials, theme preferences, and AI configuration.
          </p>
        </div>
      </div>

      <div className="p-8 max-w-4xl mx-auto w-full space-y-6">
        {/* 1. Theme Preferences Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 shadow-google-1 p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Appearance & Theme
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Choose your preferred color theme for the interface.
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-md">
            <button
              onClick={() => setTheme('light')}
              className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                theme === 'light'
                  ? 'border-google-blue bg-blue-50/70 dark:bg-blue-950/60 ring-2 ring-google-blue text-google-blue'
                  : 'border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Sun size={20} className="text-amber-500" />
              <span className="text-xs font-semibold">Light</span>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                theme === 'dark'
                  ? 'border-google-blue bg-blue-50/70 dark:bg-blue-950/60 ring-2 ring-google-blue text-google-blue'
                  : 'border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Moon size={20} className="text-indigo-500" />
              <span className="text-xs font-semibold">Dark</span>
            </button>

            <button
              onClick={() => setTheme('system')}
              className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                theme === 'system'
                  ? 'border-google-blue bg-blue-50/70 dark:bg-blue-950/60 ring-2 ring-google-blue text-google-blue'
                  : 'border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Laptop size={20} className="text-gray-500" />
              <span className="text-xs font-semibold">System</span>
            </button>
          </div>
        </div>

        {/* 2. Connected Google Account Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 shadow-google-1 p-6">
          <div className="flex items-center justify-between pb-5 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-3.5">
              <AiLogo size="md" animated={true} />
              <div>
                <div className="font-bold text-base text-gray-900 dark:text-gray-100 font-sans">
                  {user?.name || 'Connected Google Account'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</div>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-full border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 size={13} />
              Active & Connected
            </div>
          </div>

          <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
              <div className="text-gray-400 dark:text-gray-500 font-medium mb-1">Auth Protocol</div>
              <div className="text-gray-900 dark:text-gray-100 font-semibold">Google OAuth 2.0 (Offline)</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
              <div className="text-gray-400 dark:text-gray-500 font-medium mb-1">Token Storage</div>
              <div className="text-gray-900 dark:text-gray-100 font-semibold flex items-center gap-1">
                <Lock size={12} className="text-emerald-600 dark:text-emerald-400" />
                AES-256-GCM Encrypted
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
              <div className="text-gray-400 dark:text-gray-500 font-medium mb-1">Password Status</div>
              <div className="text-gray-900 dark:text-gray-100 font-semibold">Zero Passwords Stored</div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Disconnecting will revoke access and wipe stored OAuth tokens.
            </div>
            <button
              onClick={() => setShowDisconnectModal(true)}
              className="px-4 py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-google-red dark:text-rose-300 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-800 transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={14} />
              Disconnect Google Account
            </button>
          </div>
        </div>

        {/* 3. AI Intelligence Engine Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 shadow-google-1 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="font-semibold text-base text-gray-900 dark:text-gray-100">
                AI Intelligence Engine
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Configured with Gemini AI for summarization, key points, and tone drafting.
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
              <div>
                <div className="font-semibold text-gray-800 dark:text-gray-200">Active AI Model</div>
                <div className="text-gray-500 dark:text-gray-400">Google Gemini 3.5 Flash Lite (Ultra-fast, high precision summaries & reply drafts)</div>
              </div>
              <span className="px-2.5 py-1 bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-semibold rounded-full border border-purple-200 dark:border-purple-800 text-[11px]">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
              <div>
                <div className="font-semibold text-gray-800 dark:text-gray-200">Untrusted Email Sandboxing</div>
                <div className="text-gray-500 dark:text-gray-400">
                  Prompt-injection protection active on all incoming email bodies.
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-semibold rounded-full border border-emerald-200 dark:border-emerald-800 text-[11px] flex items-center gap-1">
                <ShieldCheck size={12} />
                Enabled
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Disconnect Confirmation Modal */}
      {showDisconnectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-google-3 border border-gray-200 dark:border-slate-800 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/60 text-google-red dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">
              Disconnect Google Account?
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              This will remove your encrypted access tokens and sign you out. You will need to re-authorize with Google to access your inbox.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowDisconnectModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-gray-200 dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => disconnectMutation.mutate()}
                disabled={disconnectMutation.isPending}
                className="px-4 py-2 text-xs font-semibold text-white bg-google-red hover:bg-rose-700 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
              >
                {disconnectMutation.isPending ? (
                  <RotateCw size={13} className="animate-spin" />
                ) : (
                  <Trash2 size={13} />
                )}
                Yes, Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
