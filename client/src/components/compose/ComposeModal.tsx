import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Minus,
  Maximize2,
  Minimize2,
  Send,
  Sparkles,
  Trash2,
  RotateCw,
} from 'lucide-react';
import { emailApi, aiApi } from '../../api/client';
import { ReplyTone } from '../../types';
import { useToast } from '../common/Toast';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTo?: string;
  initialSubject?: string;
  initialBody?: string;
}

export const ComposeModal: React.FC<ComposeModalProps> = ({
  isOpen,
  onClose,
  initialTo = '',
  initialSubject = '',
  initialBody = '',
}) => {
  const [to, setTo] = useState(initialTo);
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);

  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // AI Assistant in Compose
  const [showAiAssist, setShowAiAssist] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTone, setAiTone] = useState<ReplyTone>('Professional');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to.trim()) {
      showToast({ message: 'Please specify at least one recipient', type: 'warning' });
      return;
    }
    if (!subject.trim()) {
      showToast({ message: 'Please enter a subject line', type: 'warning' });
      return;
    }

    try {
      setIsSending(true);
      await emailApi.sendEmail({
        to: to.trim(),
        cc: cc.trim() || undefined,
        bcc: bcc.trim() || undefined,
        subject: subject.trim(),
        bodyText: body,
      });

      showToast({ message: 'Email sent successfully via Gmail', type: 'success' });
      onClose();
    } catch (err: any) {
      showToast({ message: err.message || 'Failed to send email', type: 'error' });
    } finally {
      setIsSending(false);
    }
  };

  const handleAiDraft = async () => {
    if (!aiPrompt.trim()) {
      showToast({ message: 'Please provide a topic or prompt for AI', type: 'warning' });
      return;
    }

    try {
      setIsAiGenerating(true);
      const res = await aiApi.generateReply({
        emailId: 'compose-new',
        tone: aiTone,
        additionalContext: `Write a new email about: ${aiPrompt}. Subject idea: ${subject || 'New Message'}`,
      });

      setBody((prev) => (prev ? `${prev}\n\n${res.draft}` : res.draft));
      setShowAiAssist(false);
      setAiPrompt('');
      showToast({ message: 'AI draft inserted', type: 'info' });
    } catch (err: any) {
      showToast({ message: 'Could not generate draft', type: 'error' });
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`fixed z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl border border-indigo-100 dark:border-slate-800 flex flex-col transition-all duration-200 text-gray-900 dark:text-gray-100 overflow-hidden ${
          isMinimized
            ? 'bottom-0 right-0 sm:right-10 w-full sm:w-80 h-12 rounded-t-2xl'
            : isMaximized
            ? 'inset-0 sm:inset-4 w-full sm:w-auto h-full sm:h-auto rounded-none sm:rounded-3xl'
            : 'inset-0 sm:inset-auto sm:bottom-0 sm:right-10 w-full sm:w-[600px] h-full sm:h-[600px] rounded-none sm:rounded-t-3xl'
        }`}
      >
        {/* Header Window Bar */}
        <div className="h-12 bg-gradient-to-r from-slate-100/90 via-indigo-50/50 to-slate-100/90 dark:from-slate-800/90 dark:via-indigo-950/40 dark:to-slate-800/90 px-4 flex items-center justify-between border-b border-gray-200/80 dark:border-slate-800 select-none">
          <div className="flex items-center gap-2 truncate">
            <span className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
              {subject || 'New Message'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/70 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              <Minus size={14} />
            </button>
            <button
              type="button"
              onClick={() => {
                setIsMaximized(!isMaximized);
                setIsMinimized(false);
              }}
              className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/70 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
              title="Close"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Body Area */}
        {!isMinimized && (
          <form onSubmit={handleSend} className="flex-1 flex flex-col overflow-hidden">
            {/* Recipient & Subject Header Fields */}
            <div className="divide-y divide-gray-100 dark:divide-slate-800 text-xs px-4">
              {/* To Field */}
              <div className="flex items-center py-2.5">
                <span className="w-16 text-gray-500 dark:text-gray-400 font-semibold">To</span>
                <input
                  type="email"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Recipient email address"
                  className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 font-sans"
                  required
                />
                <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 font-semibold">
                  {!showCc && (
                    <button
                      type="button"
                      onClick={() => setShowCc(true)}
                      className="hover:text-indigo-600 dark:hover:text-cyan-400"
                    >
                      Cc
                    </button>
                  )}
                  {!showBcc && (
                    <button
                      type="button"
                      onClick={() => setShowBcc(true)}
                      className="hover:text-indigo-600 dark:hover:text-cyan-400"
                    >
                      Bcc
                    </button>
                  )}
                </div>
              </div>

              {/* Optional Cc Field */}
              {showCc && (
                <div className="flex items-center py-2 animate-in fade-in">
                  <span className="w-16 text-gray-500 dark:text-gray-400 font-semibold">Cc</span>
                  <input
                    type="text"
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    placeholder="Cc recipients"
                    className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  />
                </div>
              )}

              {/* Optional Bcc Field */}
              {showBcc && (
                <div className="flex items-center py-2 animate-in fade-in">
                  <span className="w-16 text-gray-500 dark:text-gray-400 font-semibold">Bcc</span>
                  <input
                    type="text"
                    value={bcc}
                    onChange={(e) => setBcc(e.target.value)}
                    placeholder="Bcc recipients"
                    className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  />
                </div>
              )}

              {/* Subject Field */}
              <div className="flex items-center py-2.5">
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject"
                  className="w-full bg-transparent outline-none text-gray-900 dark:text-gray-100 font-bold placeholder:text-gray-400 placeholder:font-normal font-sans"
                  required
                />
              </div>
            </div>

            {/* AI Assist Expandable Box */}
            <AnimatePresence>
              {showAiAssist && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="m-3 p-3.5 bg-gradient-to-r from-indigo-50 via-purple-50 to-cyan-50 dark:from-indigo-950/50 dark:via-purple-950/40 dark:to-cyan-950/50 rounded-2xl border border-indigo-200/80 dark:border-indigo-800/80 text-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-indigo-950 dark:text-cyan-300 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-indigo-600 dark:text-cyan-400" />
                      Gemini 3.5 AI Copilot Assistant
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAiAssist(false)}
                      className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <X size={13} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Describe what to write (e.g. reschedule call to next Thursday, propose partnership...)"
                    className="w-full bg-white dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900 dark:text-gray-100 mb-2.5 font-sans"
                  />
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1 text-[11px]">
                      {(['Professional', 'Friendly', 'Formal', 'Concise'] as ReplyTone[]).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setAiTone(t)}
                          className={`px-2.5 py-0.5 rounded-full border font-semibold transition-all ${
                            aiTone === t
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                              : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleAiDraft}
                      disabled={isAiGenerating}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold rounded-xl shadow-2xs flex items-center gap-1.5 text-xs"
                    >
                      {isAiGenerating ? <RotateCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                      Draft with AI
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Body Textarea */}
            <div className="flex-1 p-4 overflow-y-auto">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your email here..."
                className="w-full h-full bg-transparent resize-none outline-none text-[13.5px] text-gray-800 dark:text-gray-200 leading-relaxed font-sans placeholder:text-gray-400"
              />
            </div>

            {/* Bottom Toolbar & Send Button */}
            <div className="h-14 px-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs shrink-0">
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  disabled={isSending}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold rounded-full shadow-md shadow-indigo-500/25 transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  {isSending ? (
                    <>
                      <RotateCw size={14} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Send
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.92 }}
                  type="button"
                  onClick={() => setShowAiAssist(!showAiAssist)}
                  className="p-2 text-indigo-600 dark:text-cyan-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-full transition-colors flex items-center gap-1.5 text-xs font-bold"
                  title="Help me write with AI"
                >
                  <Sparkles size={16} />
                  <span className="hidden sm:inline">AI Copilot</span>
                </motion.button>
              </div>

              <div className="flex items-center gap-1 text-gray-400">
                <button
                  type="button"
                  onClick={() => {
                    setBody('');
                    setSubject('');
                    setTo('');
                    onClose();
                  }}
                  className="p-2 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-full transition-colors"
                  title="Discard draft"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </form>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
