import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sun,
  Moon,
  Check,
  Wand2,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AiLogo } from '../components/common/AiLogo';
import { ReplyTone } from '../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();

  // Interactive demo state on right panel
  const [selectedTone, setSelectedTone] = useState<ReplyTone>('Professional');

  const DEMO_REPLIES: Record<ReplyTone, string> = {
    Professional:
      'Hi Sarah, thanks for sharing the Q3 proposal. I have reviewed the milestones and confirm our team is aligned for Friday at 5 PM.',
    Friendly:
      'Hey Sarah! Exciting updates for Q3. Everything looks fantastic on our end—looking forward to catching up on Friday!',
    Formal:
      'Dear Ms. Lin, I acknowledge receipt of the Q3 deliverables. We shall provide the requested review prior to the stipulated Friday deadline.',
    Concise:
      'Received and approved. Confirmed for Friday at 5:00 PM EST.',
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between text-gray-900 dark:text-gray-100 selection:bg-indigo-500 selection:text-white transition-colors duration-200 relative overflow-y-auto lg:overflow-hidden font-sans">
      {/* Ambient Background Aura Orbs */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-500/15 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-80 h-80 bg-cyan-500/15 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-purple-500/15 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="px-5 sm:px-8 py-3 sm:py-4 flex items-center justify-between max-w-6xl mx-auto w-full z-10 shrink-0">
        <div className="cursor-pointer" onClick={() => navigate('/home')}>
          <AiLogo size="md" showText={true} animated={true} />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate('/home')}
            className="px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-cyan-400 border border-gray-200/70 dark:border-slate-800 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <BookOpen size={13} />
            <span className="hidden sm:inline">Product Features & Demo</span>
            <span className="sm:hidden">Features</span>
          </motion.button>

          <div className="hidden md:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-indigo-700 dark:text-cyan-300 border border-indigo-200/60 dark:border-slate-800 shadow-2xs">
            <Sparkles size={12} />
            <span>Gemini 3.5</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.9, rotate: 20 }}
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-gray-200/80 dark:border-slate-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white shadow-2xs transition-colors"
            title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {resolvedTheme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-600" />}
          </motion.button>
        </div>
      </header>

      {/* Main Hero Card Container (Fitted to viewport on desktop) */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-2 sm:py-4 z-10 min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-indigo-100/80 dark:border-slate-800/80 overflow-hidden"
        >
          {/* Left Side: Sign In Prompt & Value Prop */}
          <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-950/60 dark:to-cyan-950/60 text-indigo-700 dark:text-cyan-300 text-[11px] font-bold border border-indigo-200/60 dark:border-indigo-800/60 mb-4 shadow-2xs">
                <Sparkles size={12} />
                Next-Gen AI Email Assistant
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-2.5 font-sans">
                Master your inbox with{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-400 bg-clip-text text-transparent font-extrabold">
                  Gemini 3.5 AI
                </span>
              </h1>

              <p className="text-xs sm:text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Connect your Gmail account to experience real-time AI email summarization, key takeaways, action item detection, and tone-tailored reply drafting.
              </p>

              {/* Feature Checkpoints */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <div className="w-4 h-4 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Check size={10} className="stroke-[2.5]" />
                  </div>
                  <span>Instant 1-Click Executive Thread Summaries</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <div className="w-4 h-4 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Check size={10} className="stroke-[2.5]" />
                  </div>
                  <span>Tone-Tailored Responses (Professional, Friendly, Formal, Concise)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <div className="w-4 h-4 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Check size={10} className="stroke-[2.5]" />
                  </div>
                  <span>Prompt-Injection Sandboxed for Enterprise Security</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {/* Google OAuth 2.0 CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={login}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-3 transition-all cursor-pointer group"
              >
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-0.5 shadow-2xs shrink-0">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.79l7.97-6.2z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                </div>
                <span>Continue with Google</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 pt-0.5 px-1">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-emerald-600 dark:text-emerald-400" />
                  Official Google OAuth 2.0
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock size={12} className="text-emerald-600 dark:text-emerald-400" />
                  AES-256 Vault Encryption
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Interactive AI Copilot Live Preview */}
          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-5 sm:p-6 lg:p-8 text-white flex flex-col justify-between relative overflow-hidden border-t lg:border-t-0 lg:border-l border-slate-800">
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-wider font-extrabold text-cyan-300 flex items-center gap-1.5">
                  <Wand2 size={12} />
                  Live AI Engine Preview
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                  Gemini 3.5 Active
                </span>
              </div>

              {/* Mock AI Analysis Card */}
              <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl p-3.5 border border-slate-700/80 space-y-2.5 shadow-lg">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[9px]">
                      SL
                    </div>
                    <span className="font-semibold text-slate-200 text-xs">Sarah Lin (VP Partnerships)</span>
                  </div>
                  <span className="text-[10px] text-slate-400">10:42 AM</span>
                </div>

                {/* AI Executive Summary Block */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-indigo-500/30 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-300">
                    <Sparkles size={11} />
                    AI Executive Takeaway
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Q3 partnership strategy finalized with 3 core deliverables. Team alignment requested before Friday 5:00 PM EST.
                  </p>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-950/60 text-amber-300 border border-amber-900/60 flex items-center gap-1">
                      <CheckCircle2 size={9} /> Action Required
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-950/60 text-cyan-300 border border-indigo-900/60 flex items-center gap-1">
                      <Calendar size={9} /> Friday 5 PM
                    </span>
                  </div>
                </div>

                {/* Tone Selector Pills in Demo */}
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Click Tone to Draft:
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {(['Professional', 'Friendly', 'Formal', 'Concise'] as ReplyTone[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTone(t)}
                        className={`py-1 px-1 rounded-md text-[10px] font-bold transition-all text-center ${
                          selectedTone === t
                            ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-xs'
                            : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Generated Draft Output */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedTone}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.12 }}
                    className="p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-[10.5px] text-slate-200 leading-relaxed font-mono"
                  >
                    "{DEMO_REPLIES[selectedTone]}"
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 z-10">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={11} className="text-cyan-400" />
                Zero Password Storage
              </span>
              <span>100% User Review Control</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Bottom Footer */}
      <footer className="py-2.5 sm:py-3 text-center text-[10px] sm:text-[11px] text-gray-400 dark:text-gray-500 z-10 shrink-0">
        NexusMail Intelligent Email Assistant • Powered by Google Gemini 3.5 Flash Lite • Built with Antigravity
      </footer>
    </div>
  );
};
