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
  Mail,
  Inbox,
  Clock,
  Layers,
  ChevronRight,
  Database,
  Cpu,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AiLogo } from '../components/common/AiLogo';
import { ReplyTone } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();

  // Interactive Live Example State
  const [activeTab, setActiveTab] = useState<'project' | 'client' | 'interview'>('project');
  const [activeTone, setActiveTone] = useState<ReplyTone>('Professional');

  const EXAMPLES = {
    project: {
      title: 'Q3 Enterprise Deliverables & Roadmap',
      sender: 'Marcus Chen (Head of Product)',
      rawBody:
        'Hi team, following up on our quarterly planning session. We need the final security audit report signed off by Thursday 4:00 PM EST. Also, please ensure the staging environment has the updated OAuth credentials deployed before the client demo on Friday at 2:00 PM. Let me know if you need additional engineering resources.',
      summary:
        'Quarterly planning requirements finalized. Security audit sign-off is due Thursday at 4 PM, and staging OAuth updates must be deployed ahead of Friday’s client demo.',
      keyPoints: [
        'Security audit report must be signed off by Thursday 4:00 PM EST',
        'Deploy updated OAuth credentials to staging before Friday 2:00 PM demo',
        'Engineering resources available upon request',
      ],
      action: 'Sign off security audit & deploy OAuth credentials to staging',
      deadline: 'Thursday, 4:00 PM EST',
      replies: {
        Professional:
          'Hi Marcus, thanks for the update. I have reviewed the requirements and will ensure the security audit is signed off before Thursday 4 PM, with staging deployment ready for Friday’s demo.',
        Friendly:
          'Hey Marcus! All on track here. We will get that security audit wrapped up by Thursday and have staging prepped for the Friday demo. Cheers!',
        Formal:
          'Dear Mr. Chen, I acknowledge the deliverables outlined. Our team will execute the security audit sign-off by Thursday at 16:00 EST and verify staging deployment prior to Friday’s demo.',
        Concise:
          'Understood. Audit sign-off by Thursday 4 PM; staging prepped for Friday 2 PM.',
      },
    },
    client: {
      title: 'Contract Renewal & SLA Agreement Updates',
      sender: 'Elena Rostova (Legal & Procurement)',
      rawBody:
        'Hello, we have completed the legal review for the annual SaaS contract. The updated SLA guarantees 99.95% uptime and includes 24/7 dedicated support. Please countersign the attached agreement and return it by Wednesday end-of-day so we can activate the enterprise tier next week.',
      summary:
        'Legal review completed with 99.95% SLA uptime and 24/7 support. Countersignature required by Wednesday EOD for next week activation.',
      keyPoints: [
        'Annual SaaS contract approved by legal review',
        'Upgraded SLA to 99.95% uptime with 24/7 support',
        'Countersigned agreement must be returned by Wednesday EOD',
      ],
      action: 'Countersign and return the SaaS agreement',
      deadline: 'Wednesday, End of Day (5:00 PM)',
      replies: {
        Professional:
          'Hi Elena, thank you for providing the finalized agreement. I have reviewed the 99.95% SLA terms and will return the countersigned document before Wednesday EOD.',
        Friendly:
          'Hi Elena! Great news on the contract. Reviewing the 24/7 support terms now and will send over the signed copy before Wednesday evening!',
        Formal:
          'Dear Ms. Rostova, We acknowledge the completed legal review. The countersigned SLA agreement will be submitted prior to the close of business Wednesday.',
        Concise:
          'Received and approved. Will return countersigned SLA by Wednesday EOD.',
      },
    },
    interview: {
      title: 'Senior Engineering Candidate Review',
      sender: 'Devin Vance (Lead Technical Recruiter)',
      rawBody:
        'Hi there, the candidate Alex Morgan scored 95/100 on the distributed systems assessment. We would like to schedule the final architectural interview for Monday afternoon (between 2:00 PM and 5:00 PM). Please confirm your availability by Friday morning.',
      summary:
        'Candidate Alex Morgan scored 95/100 on technical assessment. Confirmation needed by Friday morning for Monday afternoon interview.',
      keyPoints: [
        'Candidate scored 95/100 on distributed systems test',
        'Final architectural interview scheduled for Monday 2:00 PM – 5:00 PM',
        'Confirmation of availability needed by Friday morning',
      ],
      action: 'Confirm availability for Monday afternoon interview',
      deadline: 'Friday, 10:00 AM EST',
      replies: {
        Professional:
          'Hi Devin, impressive score from Alex. I am available for the architectural round on Monday from 2:00 PM to 3:30 PM. Please send the calendar invite.',
        Friendly:
          'Hey Devin! Fantastic result on the assessment. I am totally free Monday from 2 PM onwards—send over the invite!',
        Formal:
          'Dear Devin, I confirm my availability to conduct the architectural assessment on Monday commencing at 14:00. Please transmit the meeting coordinates.',
        Concise:
          'Available Monday 2:00 PM – 3:30 PM. Please schedule.',
      },
    },
  };

  const currentExample = EXAMPLES[activeTab];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 selection:bg-indigo-500 selection:text-white transition-colors duration-200 overflow-x-hidden font-sans">
      {/* Ambient Radial Auroras */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-500/15 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-cyan-500/15 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 left-1/4 w-[600px] h-[600px] bg-purple-500/15 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. REFINED TOP NAVBAR */}
      <header className="sticky top-0 z-50 px-4 sm:px-8 py-3.5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-gray-200/70 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo & Version Tag */}
          <div
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <AiLogo size="md" showText={true} animated={true} />
            <span className="hidden sm:inline-flex items-center text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-cyan-300 border border-indigo-200/60 dark:border-indigo-800/60">
              v2.0 AI
            </span>
          </div>

          {/* Center Segmented Pill Nav Links */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full border border-gray-200/60 dark:border-slate-800/60 text-xs font-semibold text-gray-600 dark:text-gray-300 shadow-2xs">
            <a
              href="#features"
              className="px-4 py-1.5 rounded-full hover:text-indigo-600 dark:hover:text-cyan-300 hover:bg-white dark:hover:bg-slate-800 transition-all"
            >
              Features
            </a>
            <a
              href="#examples"
              className="px-4 py-1.5 rounded-full hover:text-indigo-600 dark:hover:text-cyan-300 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center gap-1.5"
            >
              <Sparkles size={13} className="text-indigo-500 dark:text-cyan-400" />
              <span>Live Playground</span>
            </a>
            <a
              href="#security"
              className="px-4 py-1.5 rounded-full hover:text-indigo-600 dark:hover:text-cyan-300 hover:bg-white dark:hover:bg-slate-800 transition-all"
            >
              Security Vault
            </a>
            <a
              href="#tech"
              className="px-4 py-1.5 rounded-full hover:text-indigo-600 dark:hover:text-cyan-300 hover:bg-white dark:hover:bg-slate-800 transition-all"
            >
              Architecture
            </a>
          </nav>

          {/* Right Actions: Status Badge, Theme Switcher, and Main CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Gemini Live Status Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-900/80 border border-gray-200/60 dark:border-slate-800 text-[11px] font-bold text-gray-700 dark:text-gray-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Gemini 3.5 Flash Lite</span>
            </div>

            {/* Theme Toggle */}
            <motion.button
              whileTap={{ scale: 0.9, rotate: 20 }}
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-full bg-slate-100/90 dark:bg-slate-900/90 border border-gray-200/80 dark:border-slate-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white shadow-2xs transition-colors cursor-pointer"
              title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {resolvedTheme === 'dark' ? (
                <Sun size={17} className="text-amber-400" />
              ) : (
                <Moon size={17} className="text-indigo-600" />
              )}
            </motion.button>

            {/* Primary Action Button */}
            {isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/inbox')}
                className="px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-indigo-500/25 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open Inbox</span>
                <ArrowRight size={14} />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/login')}
                className="px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-indigo-500/25 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Sign In</span>
                <ArrowRight size={14} />
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-8 max-w-6xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-950/70 dark:to-cyan-950/70 text-indigo-700 dark:text-cyan-300 text-xs font-bold border border-indigo-200/70 dark:border-indigo-800/70 shadow-sm">
            <Sparkles size={14} />
            <span>Built 100% Autonomous & No-Code with Google Antigravity</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1] max-w-4xl mx-auto font-sans">
            The Autonomous AI Email Client Powered by{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-400 bg-clip-text text-transparent">
              Gemini 3.5
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-normal">
            NexusMail connects with your Gmail to extract instant 3-bullet structured summaries, detect deadlines, identify required actions, and draft contextual replies with 1 click.
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={isAuthenticated ? () => navigate('/') : login}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2.5"
            >
              <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-0.5 shadow-2xs">
                <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.79l7.97-6.2z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
              </div>
              <span>Connect with Google Gmail</span>
              <ArrowRight size={16} />
            </motion.button>

            <a
              href="#examples"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 text-gray-700 dark:text-gray-200 font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
            >
              See Interactive Examples ↓
            </a>
          </div>

          {/* Trust Marks */}
          <div className="pt-6 flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400 font-medium flex-wrap">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500" />
              Google Verified OAuth 2.0
            </span>
            <span className="flex items-center gap-1.5">
              <Lock size={14} className="text-emerald-500" />
              AES-256-GCM Vault Encryption
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-cyan-500" />
              Zero Password Storage
            </span>
          </div>
        </motion.div>
      </section>

      {/* 3. INTERACTIVE LIVE EXAMPLES SECTION */}
      <section id="examples" className="py-16 sm:py-24 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-y border-gray-200/80 dark:border-slate-800/80 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-cyan-300 text-xs font-bold border border-indigo-200/60 dark:border-indigo-800/60">
              <Wand2 size={12} />
              Interactive Playground
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white font-sans">
              See Gemini 3.5 AI in Action
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Select a real-world email scenario below to see how raw incoming messages are transformed into executive takeaways and customizable drafts.
            </p>

            {/* Scenario Tabs */}
            <div className="flex items-center justify-center gap-2 pt-4 flex-wrap">
              {[
                { id: 'project', label: '1. Project Roadmap', icon: '🚀' },
                { id: 'client', label: '2. Contract Renewal', icon: '📄' },
                { id: 'interview', label: '3. Candidate Review', icon: '👥' },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Interactive Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Raw Email Context */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950 rounded-3xl p-5 sm:p-6 border border-gray-200/80 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-slate-800">
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">
                    Incoming Raw Email
                  </div>
                  <div className="font-bold text-sm text-gray-900 dark:text-gray-100 mt-0.5">
                    {currentExample.title}
                  </div>
                </div>
                <span className="text-[11px] text-indigo-600 dark:text-cyan-400 font-semibold">
                  from {currentExample.sender.split(' ')[0]}
                </span>
              </div>

              <div className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-sans bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800/80">
                {currentExample.rawBody}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-gray-400 dark:text-gray-500 pt-1">
                <Mail size={13} />
                <span>Standard length: ~65 words • Unstructured email content</span>
              </div>
            </div>

            {/* Right: AI Intelligence Output */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-indigo-100 dark:border-slate-800 space-y-4 shadow-md shadow-indigo-500/5">
              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-cyan-50/60 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-cyan-950/40 border border-indigo-100/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-950 dark:text-cyan-300 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-indigo-600 dark:text-cyan-400" />
                    AI Executive Summary
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 uppercase">
                    Gemini 3.5
                  </span>
                </div>

                <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                  {currentExample.summary}
                </p>

                {/* Key Takeaways */}
                <ul className="space-y-1.5 pt-1">
                  {currentExample.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[11.5px] text-gray-700 dark:text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                {/* Badges */}
                <div className="pt-2 border-t border-indigo-100/60 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 text-[11px]">
                    <span className="font-bold text-amber-800 dark:text-amber-300 block mb-0.5 flex items-center gap-1">
                      <CheckCircle2 size={11} /> Action Required
                    </span>
                    <span className="text-amber-950 dark:text-amber-100 font-semibold">{currentExample.action}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/40 text-[11px]">
                    <span className="font-bold text-indigo-800 dark:text-cyan-300 block mb-0.5 flex items-center gap-1">
                      <Calendar size={11} /> Deadline
                    </span>
                    <span className="text-indigo-950 dark:text-slate-100 font-semibold">{currentExample.deadline}</span>
                  </div>
                </div>
              </div>

              {/* Reply Copilot Tone Switcher */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                  <span>Tone-Tailored Reply Generator:</span>
                  <span className="text-indigo-600 dark:text-cyan-400 font-mono text-[11px]">
                    Click tone to view draft
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Professional', 'Friendly', 'Formal', 'Concise'] as ReplyTone[]).map((t) => (
                    <motion.button
                      key={t}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTone(t)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold text-center transition-all ${
                        activeTone === t
                          ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {t}
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTone + activeTab}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-gray-200/80 dark:border-slate-800 text-xs text-gray-900 dark:text-gray-100 leading-relaxed font-sans"
                  >
                    <span className="font-bold text-indigo-600 dark:text-cyan-400 mr-2 font-mono">[{activeTone}]:</span>
                    "{currentExample.replies[activeTone]}"
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KEY CAPABILITIES / FEATURES GRID */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-cyan-300 text-xs font-bold border border-indigo-200/60 dark:border-indigo-800/60">
            <Zap size={12} />
            Core Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white font-sans">
            Engineered for Executive Productivity
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Everything you need to master high-volume correspondence without cognitive overload.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
              <Sparkles size={22} />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Instant Executive Summaries
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Condense multi-page conversation threads into a 3-sentence overview with bulleted key takeaways, identified deadlines, and detected action items.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Wand2 size={22} />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Tone-Tailored Reply Copilot
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Switch between Professional, Friendly, Formal, and Concise tones. Full human review ensures nothing sends without your explicit confirmation.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/20">
              <Layers size={22} />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Gmail Categories & 800+ Pagination
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Live Gmail category filters (Primary, Promotions, Social, Updates) and tokenized pagination to navigate mailboxes of any size with sub-second speeds.
            </p>
          </div>
        </div>
      </section>

      {/* 5. SECURITY & VAULT SECTION */}
      <section id="security" className="py-16 sm:py-20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white px-4 sm:px-8 border-t border-slate-800 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 text-xs font-bold border border-cyan-800/80">
              <ShieldCheck size={13} />
              Enterprise Privacy & Security
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-sans">
              Zero Password Storage. Strict Multi-Tenant Isolation.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              NexusMail authenticates strictly through official Google OAuth 2.0 with offline access tokens encrypted at rest using AES-256-GCM authenticated cipher.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                <span>AES-256-GCM Encrypted Token Storage with Auth Tag Verification</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                <span>Prompt-Injection Quarantining with XML Tag Sandboxing</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                <span>Multi-Tenant DB Query Scoping by Authenticated User ID</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-6 bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 border border-slate-700 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2 font-bold text-xs text-cyan-300">
                <Database size={15} />
                <span>Security Architecture Status</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase">
                Encrypted
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/60 flex items-center justify-between">
                <span>Google OAuth 2.0 Tokens</span>
                <span className="font-mono text-cyan-300 text-[11px]">AES-256-GCM</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/60 flex items-center justify-between">
                <span>Database Engine</span>
                <span className="font-mono text-cyan-300 text-[11px]">Neon Serverless Postgres</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/60 flex items-center justify-between">
                <span>AI Execution Model</span>
                <span className="font-mono text-cyan-300 text-[11px]">Google Gemini 3.5 Flash Lite</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TECHNOLOGY STACK & ANTIGRAVITY SECTION */}
      <section id="tech" className="py-16 sm:py-20 px-4 sm:px-8 max-w-6xl mx-auto text-center space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-cyan-300 text-xs font-bold border border-indigo-200/60 dark:border-indigo-800/60">
            <Cpu size={12} />
            Tech Stack
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white font-sans">
            Built with Modern, Ultra-Fast Technologies
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 text-center space-y-1 shadow-xs">
            <div className="font-bold text-sm text-gray-900 dark:text-white">React 19.2</div>
            <div className="text-[11px] text-gray-500">Frontend UI</div>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 text-center space-y-1 shadow-xs">
            <div className="font-bold text-sm text-gray-900 dark:text-white">Framer Motion 13</div>
            <div className="text-[11px] text-gray-500">Spring Animations</div>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 text-center space-y-1 shadow-xs">
            <div className="font-bold text-sm text-gray-900 dark:text-white">Express & Node.js</div>
            <div className="text-[11px] text-gray-500">RESTful API</div>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 text-center space-y-1 shadow-xs">
            <div className="font-bold text-sm text-gray-900 dark:text-white">Neon PostgreSQL</div>
            <div className="text-[11px] text-gray-500">Prisma ORM</div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA BANNER */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans">
            Ready to Supercharge Your Email Experience?
          </h2>
          <p className="text-xs sm:text-base text-indigo-100 max-w-xl mx-auto leading-relaxed">
            Connect your Google account in 1 click and let Gemini 3.5 AI handle the heavy lifting.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={isAuthenticated ? () => navigate('/') : login}
            className="px-8 py-4 bg-white text-indigo-900 font-bold text-sm rounded-2xl shadow-lg hover:bg-slate-100 transition-all inline-flex items-center gap-2"
          >
            <span>Launch NexusMail Now</span>
            <ArrowRight size={16} />
          </motion.button>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="py-8 border-t border-gray-200/60 dark:border-slate-800 text-center text-xs text-gray-500 dark:text-gray-400 space-y-2">
        <div>
          NexusMail Intelligent Email Assistant • Powered by Google Gemini 3.5 Flash Lite
        </div>
        <div className="text-[11px] text-gray-400 dark:text-gray-500">
          Built 100% Autonomous & No-Code using <span className="font-semibold text-indigo-600 dark:text-cyan-400">Google Antigravity</span>
        </div>
      </footer>
    </div>
  );
};
