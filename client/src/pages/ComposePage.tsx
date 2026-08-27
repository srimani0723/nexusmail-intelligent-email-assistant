import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Trash2,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  X,
} from 'lucide-react';
import { emailApi, aiApi } from '../api/client';
import { Button } from '../components/common/Button';
import { useToast } from '../components/common/Toast';

export const ComposePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [bodyText, setBodyText] = useState('');

  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiHelper, setShowAiHelper] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to.trim()) {
      setError('Please provide at least one recipient email address.');
      return;
    }
    if (!subject.trim() && !bodyText.trim()) {
      setError('Please provide a subject or body.');
      return;
    }

    try {
      setIsSending(true);
      setError(null);

      await emailApi.sendEmail({
        to: to.trim(),
        cc: cc.trim() || undefined,
        bcc: bcc.trim() || undefined,
        subject: subject.trim() || '(No Subject)',
        bodyText: bodyText.trim(),
      });

      showToast({ message: 'Email sent successfully!', type: 'success' });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to send email');
      showToast({ message: err.message || 'Failed to send email', type: 'error' });
    } finally {
      setIsSending(false);
    }
  };

  const handleAiDraftFromPrompt = async () => {
    if (!aiPrompt.trim()) return;
    try {
      setIsAiGenerating(true);
      const res = await aiApi.generateReply({
        subject: subject || 'Draft Message',
        sender: 'Recipient',
        bodyText: `User request: ${aiPrompt}`,
        additionalContext: aiPrompt,
      });

      setBodyText((prev) => (prev ? `${prev}\n\n${res.replyText}` : res.replyText));
      setShowAiHelper(false);
      setAiPrompt('');
      showToast({ message: 'AI draft generated!', type: 'info' });
    } catch (err: any) {
      setError(err.message || 'Failed to generate AI draft');
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Compose New Email</h1>
        </div>

        <button
          type="button"
          onClick={() => setShowAiHelper(!showAiHelper)}
          className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-indigo-700 border border-purple-200 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs"
        >
          <Sparkles size={14} className="text-purple-600" />
          AI Writing Assistant
        </button>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSend} className="flex-1 flex flex-col overflow-hidden max-w-4xl w-full mx-auto p-6 space-y-4">
        {/* Recipient To */}
        <div className="flex items-center px-4 py-2 border border-gray-200 rounded-xl text-sm focus-within:border-google-blue focus-within:ring-1 focus-within:ring-google-blue transition-all">
          <span className="text-gray-500 w-12 shrink-0 font-medium">To</span>
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="recipient@example.com"
            className="flex-1 outline-none text-gray-900 bg-transparent"
            required
          />
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {!showCc && (
              <button
                type="button"
                onClick={() => setShowCc(true)}
                className="hover:text-google-blue font-medium"
              >
                Cc
              </button>
            )}
            {!showBcc && (
              <button
                type="button"
                onClick={() => setShowBcc(true)}
                className="hover:text-google-blue font-medium"
              >
                Bcc
              </button>
            )}
          </div>
        </div>

        {/* Optional CC */}
        {showCc && (
          <div className="flex items-center px-4 py-2 border border-gray-200 rounded-xl text-sm animate-in fade-in duration-100">
            <span className="text-gray-500 w-12 shrink-0 font-medium">Cc</span>
            <input
              type="email"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              placeholder="cc@example.com"
              className="flex-1 outline-none text-gray-900 bg-transparent"
            />
          </div>
        )}

        {/* Optional BCC */}
        {showBcc && (
          <div className="flex items-center px-4 py-2 border border-gray-200 rounded-xl text-sm animate-in fade-in duration-100">
            <span className="text-gray-500 w-12 shrink-0 font-medium">Bcc</span>
            <input
              type="email"
              value={bcc}
              onChange={(e) => setBcc(e.target.value)}
              placeholder="bcc@example.com"
              className="flex-1 outline-none text-gray-900 bg-transparent"
            />
          </div>
        )}

        {/* Subject */}
        <div className="flex items-center px-4 py-2 border border-gray-200 rounded-xl text-sm focus-within:border-google-blue focus-within:ring-1 focus-within:ring-google-blue transition-all">
          <span className="text-gray-500 w-16 shrink-0 font-medium">Subject</span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject..."
            className="w-full outline-none text-gray-900 font-medium bg-transparent"
          />
        </div>

        {/* AI Prompt Input */}
        {showAiHelper && (
          <div className="p-3 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border border-purple-200 rounded-2xl flex items-center gap-2 animate-in fade-in duration-150">
            <Sparkles size={16} className="text-indigo-600 shrink-0" />
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Tell AI what to write (e.g. 'Draft an invitation for project kickoff on Friday')..."
              className="flex-1 text-xs bg-white px-3 py-2 rounded-xl border border-purple-200 outline-none focus:ring-1 focus:ring-purple-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAiDraftFromPrompt();
                }
              }}
            />
            <Button
              type="button"
              variant="gemini"
              size="sm"
              onClick={handleAiDraftFromPrompt}
              isLoading={isAiGenerating}
            >
              Draft
            </Button>
            <button
              type="button"
              onClick={() => setShowAiHelper(false)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-800 rounded-xl flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0 text-google-red" />
            <span>{error}</span>
          </div>
        )}

        {/* Body Text Area */}
        <div className="flex-1 border border-gray-200 rounded-2xl p-4 focus-within:border-google-blue focus-within:ring-1 focus-within:ring-google-blue transition-all">
          <textarea
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            placeholder="Write your email here..."
            className="w-full h-full resize-none outline-none text-sm text-gray-800 leading-relaxed font-sans"
          />
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSending}
            leftIcon={<Send size={16} />}
          >
            Send Email
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-google-red"
          >
            Discard
          </Button>
        </div>
      </form>
    </div>
  );
};
