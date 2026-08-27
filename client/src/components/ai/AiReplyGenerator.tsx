import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Send,
  Copy,
  Check,
  RotateCw,
  Trash2,
  ShieldCheck,
  PenTool,
  Wand2,
  Zap,
} from 'lucide-react';
import { aiApi, emailApi } from '../../api/client';
import { ReplyTone } from '../../types';
import { useToast } from '../common/Toast';

interface AiReplyGeneratorProps {
  emailId: string;
  threadId?: string;
  recipientEmail: string;
  subject: string;
  sender: string;
  bodyText: string;
  onReplySent?: () => void;
}

const TONES: { label: ReplyTone; icon: string; desc: string }[] = [
  { label: 'Professional', icon: '💼', desc: 'Clear, polite, & business ready' },
  { label: 'Friendly', icon: '😊', desc: 'Warm & conversational' },
  { label: 'Formal', icon: '👔', desc: 'Executive & authoritative' },
  { label: 'Concise', icon: '⚡', desc: 'Brief & to the point' },
];

export const AiReplyGenerator: React.FC<AiReplyGeneratorProps> = ({
  emailId,
  threadId,
  recipientEmail,
  subject,
  sender,
  bodyText,
  onReplySent,
}) => {
  const [tone, setTone] = useState<ReplyTone>('Professional');
  const [additionalContext, setAdditionalContext] = useState<string>('');
  const [draft, setDraft] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isDraftReady, setIsDraftReady] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const { showToast } = useToast();

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const res = await aiApi.generateReply({
        emailId,
        tone,
        additionalContext: additionalContext.trim() || undefined,
      });

      setDraft(res.draft);
      setIsDraftReady(true);
      showToast({ message: `${tone} reply drafted with AI`, type: 'info' });
    } catch (err: any) {
      showToast({ message: 'Error generating AI reply', type: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendReply = async () => {
    if (!draft.trim()) {
      showToast({ message: 'Reply draft cannot be empty', type: 'warning' });
      return;
    }

    try {
      setIsSending(true);
      await emailApi.replyEmail(emailId, {
        to: recipientEmail,
        subject: subject.toLowerCase().startsWith('re:') ? subject : `Re: ${subject}`,
        bodyText: draft,
      });

      showToast({ message: 'Reply sent successfully via Gmail', type: 'success' });
      setDraft('');
      setIsDraftReady(false);
      setAdditionalContext('');
      if (onReplySent) {
        onReplySent();
      }
    } catch (err: any) {
      showToast({ message: err.message || 'Failed to send reply', type: 'error' });
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyDraft = () => {
    if (!draft) return;
    navigator.clipboard.writeText(draft);
    setCopied(true);
    showToast({ message: 'Draft copied to clipboard', type: 'info' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDiscard = () => {
    setDraft('');
    setIsDraftReady(false);
    setAdditionalContext('');
  };

  const wordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl border border-indigo-100 dark:border-slate-800 shadow-md shadow-indigo-500/5 overflow-hidden transition-colors"
    >
      {/* Header */}
      <div className="px-4 sm:px-5 py-3.5 bg-gradient-to-r from-purple-50/80 via-indigo-50/60 to-cyan-50/80 dark:from-purple-950/40 dark:via-indigo-950/30 dark:to-cyan-950/40 border-b border-indigo-100/70 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-2xs">
            <Wand2 size={15} />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
              Gemini 3.5 AI Reply Copilot
            </div>
            <div className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400">
              Drafts tone-tailored responses. You review and click Send.
            </div>
          </div>
        </div>

        <div className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200/80 dark:border-emerald-800/80 shrink-0">
          <ShieldCheck size={12} />
          Human In The Loop
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Tone Selector Pills */}
        <div>
          <label className="block text-[10px] sm:text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
            Select Tone
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TONES.map((t) => (
              <motion.button
                key={t.label}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setTone(t.label)}
                className={`py-2.5 px-3 rounded-2xl border text-left transition-all relative ${
                  tone === t.label
                    ? 'border-indigo-600 dark:border-cyan-400 bg-gradient-to-br from-indigo-50 to-blue-50/50 dark:from-indigo-950/80 dark:to-slate-900 text-indigo-950 dark:text-white shadow-sm ring-1 ring-indigo-500/50'
                    : 'border-gray-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/60 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs mb-0.5">
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate leading-tight hidden sm:block">
                  {t.desc}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Optional Custom Instructions Input */}
        <div>
          <label className="block text-[10px] sm:text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Custom Instructions <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="e.g. Confirm availability for Tuesday at 2 PM..."
              className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 outline-none transition-all"
            />
          </div>
        </div>

        {/* Generate Button */}
        {!isDraftReady && (
          <div className="pt-1">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold rounded-2xl shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <RotateCw size={15} className="animate-spin" />
                  Generating {tone} Draft...
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  Generate {tone} Reply
                </>
              )}
            </motion.button>
          </div>
        )}

        {/* Editable Draft Preview Section */}
        <AnimatePresence>
          {isDraftReady && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 pt-2 border-t border-gray-100 dark:border-slate-800"
            >
              <div className="flex items-center justify-between">
                <div className="text-[10px] sm:text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  <PenTool size={12} className="text-indigo-600 dark:text-cyan-400" />
                  Review & Edit Reply
                </div>
                <div className="text-[10px] text-gray-400 font-medium">
                  {wordCount} words
                </div>
              </div>

              <textarea
                rows={5}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full text-xs sm:text-[13.5px] text-gray-800 dark:text-gray-200 bg-slate-50/80 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-gray-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 outline-none leading-relaxed resize-y font-sans transition-all"
                placeholder="Your reply draft..."
              />

              {/* Action Buttons Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex-1 sm:flex-initial px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center gap-1 border border-gray-200 dark:border-slate-700 font-semibold"
                    title="Regenerate"
                  >
                    <RotateCw size={12} className={isGenerating ? 'animate-spin' : ''} />
                    Retry
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={handleCopyDraft}
                    className="flex-1 sm:flex-initial px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center gap-1 border border-gray-200 dark:border-slate-700 font-semibold"
                  >
                    {copied ? <Check size={12} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={12} />}
                    {copied ? 'Copied' : 'Copy'}
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={handleDiscard}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                    title="Discard draft"
                  >
                    <Trash2 size={14} />
                  </motion.button>
                </div>

                {/* Send Email Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={handleSendReply}
                  disabled={isSending || !draft.trim()}
                  className="w-full sm:w-auto py-2.5 px-5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold rounded-2xl shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSending ? (
                    <>
                      <RotateCw size={13} className="animate-spin" />
                      Sending via Gmail...
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      Send Reply
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
