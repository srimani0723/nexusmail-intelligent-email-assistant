import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Star,
  Archive,
  Trash2,
  Mail,
  MailOpen,
  Printer,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { format } from 'date-fns';
import DOMPurify from 'dompurify';
import { emailApi, aiApi } from '../api/client';
import { Email, AiSummaryResponse } from '../types';
import { AiSummaryCard } from '../components/ai/AiSummaryCard';
import { AiReplyGenerator } from '../components/ai/AiReplyGenerator';
import { useToast } from '../components/common/Toast';
import { EmailDetailSkeleton } from '../components/common/Skeleton';

export const EmailDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<AiSummaryResponse | null>(null);
  const [showReplyDrawer, setShowReplyDrawer] = useState(true);
  const [expandedMessages, setExpandedMessages] = useState<Record<string, boolean>>({});

  // Fetch email and thread details
  const {
    data: email,
    isLoading: isEmailLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['email', id],
    queryFn: () => emailApi.getEmail(id!),
    enabled: !!id,
  });

  const threadId = email?.gmailThreadId || email?.threadId;

  const { data: threadData } = useQuery({
    queryKey: ['thread', threadId],
    queryFn: () => emailApi.getThread(threadId!),
    enabled: !!threadId,
  });

  // Mutations
  const starMutation = useMutation({
    mutationFn: ({ emailId, isStarred }: { emailId: string; isStarred: boolean }) =>
      emailApi.markStar(emailId, isStarred),
    onSuccess: (updated: Email) => {
      queryClient.setQueryData(['email', id], updated);
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      showToast({
        message: updated.isStarred ? 'Conversation starred' : 'Conversation unstarred',
        type: 'info',
      });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (emailId: string) => emailApi.archiveEmail(emailId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      showToast({ message: 'Conversation archived', type: 'success' });
      navigate(-1);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (emailId: string) => emailApi.deleteEmail(emailId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      showToast({ message: 'Conversation moved to trash', type: 'info' });
      navigate(-1);
    },
  });

  const readMutation = useMutation({
    mutationFn: ({ emailId, isRead }: { emailId: string; isRead: boolean }) =>
      emailApi.markRead(emailId, isRead),
    onSuccess: (updated: Email) => {
      queryClient.setQueryData(['email', id], updated);
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      showToast({
        message: updated.isRead ? 'Marked as read' : 'Marked as unread',
        type: 'info',
      });
    },
  });

  const handleGenerateSummary = async () => {
    if (!id) return;
    try {
      setIsSummaryLoading(true);
      const res = await aiApi.summarizeEmail(id);
      setSummaryData(res);
      showToast({ message: 'AI summary generated', type: 'success' });
    } catch (err: any) {
      showToast({ message: err.message || 'Failed to summarize email', type: 'error' });
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const toggleMessageExpand = (msgId: string) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  const formatDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return format(date, 'MMM d, yyyy, h:mm a');
    } catch {
      return '';
    }
  };

  if (isEmailLoading) {
    return <EmailDetailSkeleton />;
  }

  if (isError || !email) {
    return (
      <div className="p-6 sm:p-8 max-w-xl mx-auto text-center">
        <div className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Unable to load conversation
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          {(error as any)?.message || 'The email may have been deleted or is not accessible.'}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-google-blue dark:bg-blue-600 text-white rounded-full text-xs font-semibold hover:bg-google-blue-hover transition-colors"
        >
          Back to Inbox
        </button>
      </div>
    );
  }

  const threadMessages = threadData?.messages || [email];

  return (
    <div className="flex flex-col h-full bg-[#f6f8fc] dark:bg-slate-950 text-gray-900 dark:text-gray-100 overflow-y-auto transition-colors duration-200">
      {/* Top Sticky Action Toolbar */}
      <div className="sticky top-0 z-20 px-3 sm:px-6 py-2 sm:py-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border-b border-gray-200/80 dark:border-slate-800 flex items-center justify-between gap-2 sm:gap-4 shadow-2xs">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            title="Back to inbox (Esc)"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="h-5 w-px bg-gray-200 dark:bg-slate-700 mx-0.5 sm:mx-1" />

          <button
            onClick={() => archiveMutation.mutate(email.id)}
            className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            title="Archive"
          >
            <Archive size={17} />
          </button>

          <button
            onClick={() => deleteMutation.mutate(email.id)}
            className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-google-red hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-full transition-colors"
            title="Delete"
          >
            <Trash2 size={17} />
          </button>

          <button
            onClick={() => readMutation.mutate({ emailId: email.id, isRead: !email.isRead })}
            className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            title={email.isRead ? 'Mark as unread' : 'Mark as read'}
          >
            {email.isRead ? <Mail size={17} /> : <MailOpen size={17} />}
          </button>

          <button
            onClick={() => starMutation.mutate({ emailId: email.id, isStarred: !email.isStarred })}
            className={`p-1.5 sm:p-2 rounded-full transition-colors ${
              email.isStarred
                ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
            title={email.isStarred ? 'Starred' : 'Star'}
          >
            <Star
              size={17}
              className={email.isStarred ? 'fill-amber-400 text-amber-500' : ''}
            />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <button
            onClick={() => window.print()}
            className="hidden sm:inline-flex p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            title="Print thread"
          >
            <Printer size={17} />
          </button>
        </div>
      </div>

      {/* Main Conversation Container */}
      <div className="p-3 sm:p-6 max-w-5xl mx-auto w-full space-y-4 sm:space-y-6">
        {/* Subject Header */}
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-snug break-words">
            {email.subject || '(No Subject)'}
          </h1>
          <span className="text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-gray-200/70 dark:bg-slate-800 text-gray-700 dark:text-gray-300 shrink-0">
            {threadMessages.length} {threadMessages.length === 1 ? 'msg' : 'msgs'}
          </span>
        </div>

        {/* 1. Gemini AI Summary Card */}
        <AiSummaryCard
          summaryData={summaryData}
          isLoading={isSummaryLoading}
          onGenerateSummary={handleGenerateSummary}
        />

        {/* 2. Messages in Thread */}
        <div className="space-y-3 sm:space-y-4">
          {threadMessages.map((msg, index) => {
            const isLast = index === threadMessages.length - 1;
            const isExpanded = isLast || expandedMessages[msg.id];

            return (
              <div
                key={msg.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-150 overflow-hidden ${
                  isLast
                    ? 'border-gray-300 dark:border-slate-700 shadow-google-1'
                    : 'border-gray-200 dark:border-slate-800 shadow-2xs'
                }`}
              >
                {/* Message Item Header */}
                <div
                  onClick={() => !isLast && toggleMessageExpand(msg.id)}
                  className={`p-3.5 sm:p-5 flex items-center justify-between gap-3 select-none ${
                    !isLast ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/60' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-google-blue text-white font-semibold text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-2xs">
                      {msg.sender ? msg.sender.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate">
                          {msg.sender}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                        to {msg.recipient || 'me'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(msg.receivedAt)}
                    </span>
                    {!isLast && (
                      <button
                        type="button"
                        className="text-gray-400 p-1 rounded-md"
                        title={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Message Body */}
                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2 border-t border-gray-100 dark:border-slate-800">
                    {msg.bodyHtml ? (
                      <div
                        className="email-content-body text-xs sm:text-[13.5px] text-gray-900 dark:text-slate-100 leading-relaxed font-sans prose dark:prose-invert max-w-none break-words overflow-x-auto"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(msg.bodyHtml, {
                            ADD_ATTR: ['target'],
                            FORBID_TAGS: ['script', 'iframe'],
                          }),
                        }}
                      />
                    ) : (
                      <p className="email-content-body text-xs sm:text-[13.5px] text-gray-900 dark:text-slate-100 leading-relaxed whitespace-pre-wrap font-sans break-words">
                        {msg.bodyText}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 3. Gemini AI Reply Copilot */}
        {showReplyDrawer && (
          <div className="mt-4 sm:mt-6">
            <AiReplyGenerator
              emailId={email.id}
              threadId={email.gmailThreadId}
              recipientEmail={email.sender}
              subject={email.subject}
              sender={email.sender}
              bodyText={email.bodyText}
              onReplySent={() => {
                queryClient.invalidateQueries({ queryKey: ['thread', threadId] });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
