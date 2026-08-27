import React, { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, User } from 'lucide-react';
import DOMPurify from 'dompurify';
import { Email } from '../../types';

interface ThreadViewProps {
  messages: Email[];
  activeEmailId: string;
}

export const ThreadView: React.FC<ThreadViewProps> = ({ messages, activeEmailId }) => {
  const [expandedIds, setExpandedIds] = useState<string[]>([activeEmailId, messages[messages.length - 1]?.id]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const cleanHtml = (html: string) => {
    return DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true },
      ADD_ATTR: ['target'],
    });
  };

  return (
    <div className="space-y-4">
      {messages.map((msg, idx) => {
        const isExpanded = expandedIds.includes(msg.id) || idx === messages.length - 1;
        const senderName = msg.sender.split('<')[0].replace(/"/g, '').trim() || msg.sender;
        const senderEmail = msg.sender.match(/<([^>]+)>/)?.[1] || '';

        return (
          <div
            key={msg.id}
            className={`border rounded-2xl transition-all duration-150 overflow-hidden ${
              isExpanded
                ? 'bg-white border-gray-200 shadow-xs'
                : 'bg-gray-50/70 border-gray-100 hover:bg-gray-100 cursor-pointer'
            }`}
          >
            {/* Message Header */}
            <div
              onClick={() => toggleExpand(msg.id)}
              className="p-4 flex items-center justify-between gap-4 select-none"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-google-blue-light text-google-blue-dark font-semibold text-xs flex items-center justify-center shrink-0">
                  {senderName.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-900 truncate">
                      {senderName}
                    </span>
                    {senderEmail && (
                      <span className="text-xs text-gray-500 truncate hidden sm:inline">
                        &lt;{senderEmail}&gt;
                      </span>
                    )}
                  </div>
                  {!isExpanded && (
                    <p className="text-xs text-gray-500 truncate mt-0.5 max-w-md">
                      {msg.snippet}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 text-xs text-gray-500">
                <span>{format(new Date(msg.receivedAt), 'MMM d, yyyy, h:mm a')}</span>
                <button
                  type="button"
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                >
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>

            {/* Expanded Body */}
            {isExpanded && (
              <div className="px-5 pb-5 pt-2 border-t border-gray-50">
                <div className="text-xs text-gray-500 mb-4">
                  To: <span className="text-gray-700">{msg.recipient}</span>
                  {msg.cc && <span className="ml-3">Cc: {msg.cc}</span>}
                </div>

                {msg.bodyHtml ? (
                  <div
                    className="text-sm text-gray-800 leading-relaxed font-sans prose prose-sm max-w-none break-words"
                    dangerouslySetInnerHTML={{ __html: cleanHtml(msg.bodyHtml) }}
                  />
                ) : (
                  <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-sans break-words">
                    {msg.bodyText}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
