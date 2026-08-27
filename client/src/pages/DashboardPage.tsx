import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { emailApi } from '../api/client';
import { Email } from '../types';
import { EmailList, CategoryTab } from '../components/email/EmailList';
import { useToast } from '../components/common/Toast';

export const DashboardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const folder = searchParams.get('folder') || 'inbox';
  const searchQuery = searchParams.get('q') || '';
  const [category, setCategory] = useState<CategoryTab>('primary');

  // Pagination states
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);
  const [tokenStack, setTokenStack] = useState<(string | undefined)[]>([undefined]);
  const [pageIndex, setPageIndex] = useState<number>(0);

  // Reset pagination when folder, search, or category changes
  useEffect(() => {
    setPageToken(undefined);
    setTokenStack([undefined]);
    setPageIndex(0);
  }, [folder, searchQuery, category]);

  // Fetch emails query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['emails', folder, category, searchQuery, pageToken],
    queryFn: () => {
      if (searchQuery) {
        return emailApi.searchEmails(searchQuery, pageToken);
      }
      return emailApi.getEmails({
        folder,
        category: folder === 'inbox' ? category : undefined,
        limit: 50,
        pageToken,
      });
    },
    refetchInterval: 45000,
  });

  const handleNextPage = () => {
    if (data?.nextPageToken) {
      const nextTok = data.nextPageToken;
      setTokenStack((prev) => [...prev, nextTok]);
      setPageToken(nextTok);
      setPageIndex((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (pageIndex > 0) {
      const newIndex = pageIndex - 1;
      const prevTok = tokenStack[newIndex];
      setTokenStack((prev) => prev.slice(0, newIndex + 1));
      setPageToken(prevTok);
      setPageIndex(newIndex);
    }
  };

  const handleManualSync = async () => {
    try {
      setIsSyncing(true);
      await emailApi.getEmails({
        folder,
        category: folder === 'inbox' ? category : undefined,
        limit: 50,
        sync: true,
      });
      await queryClient.invalidateQueries({ queryKey: ['emails'] });
      showToast({ message: 'Inbox synchronized with Gmail', type: 'success' });
    } catch (err: any) {
      showToast({ message: err.message || 'Failed to sync with Gmail', type: 'error' });
    } finally {
      setIsSyncing(false);
    }
  };

  // Mutations
  const starMutation = useMutation({
    mutationFn: ({ id, isStarred }: { id: string; isStarred: boolean }) =>
      emailApi.markStar(id, isStarred),
    onSuccess: (updated: Email) => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      showToast({
        message: updated.isStarred ? 'Conversation starred' : 'Conversation unstarred',
        type: 'info',
      });
    },
  });

  const readMutation = useMutation({
    mutationFn: ({ id, isRead }: { id: string; isRead: boolean }) =>
      emailApi.markRead(id, isRead),
    onSuccess: (updated: Email) => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      showToast({
        message: updated.isRead ? 'Marked as read' : 'Marked as unread',
        type: 'info',
      });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => emailApi.archiveEmail(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      showToast({ message: 'Conversation archived', type: 'success' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => emailApi.deleteEmail(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      showToast({ message: 'Conversation moved to trash', type: 'info' });
    },
  });

  const handleToggleStar = (id: string, currentStarred: boolean) => {
    starMutation.mutate({ id, isStarred: !currentStarred });
  };

  const handleToggleRead = (id: string, currentRead: boolean) => {
    readMutation.mutate({ id, isRead: !currentRead });
  };

  const handleArchive = (id: string) => {
    archiveMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleBatchArchive = async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id) => emailApi.archiveEmail(id)));
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      showToast({ message: `${ids.length} conversations archived`, type: 'success' });
    } catch {
      showToast({ message: 'Failed to archive selected emails', type: 'error' });
    }
  };

  const handleBatchDelete = async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id) => emailApi.deleteEmail(id)));
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      showToast({ message: `${ids.length} conversations moved to trash`, type: 'info' });
    } catch {
      showToast({ message: 'Failed to delete selected emails', type: 'error' });
    }
  };

  const handleBatchMarkRead = async (ids: string[], isRead: boolean) => {
    try {
      await Promise.all(ids.map((id) => emailApi.markRead(id, isRead)));
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      showToast({
        message: `${ids.length} conversations marked as ${isRead ? 'read' : 'unread'}`,
        type: 'info',
      });
    } catch {
      showToast({ message: 'Failed to update read status', type: 'error' });
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-200">
      {/* Email List Component (No redundant folder heading, directly starts with action bar) */}
      <div className="flex-1 overflow-hidden">
        <EmailList
          emails={data?.emails || []}
          isLoading={isLoading || isSyncing}
          isError={isError}
          error={error}
          activeCategory={category}
          onCategoryChange={(cat) => setCategory(cat)}
          isInboxFolder={folder === 'inbox' && !searchQuery}
          onRefresh={handleManualSync}
          onToggleStar={handleToggleStar}
          onToggleRead={handleToggleRead}
          onArchive={handleArchive}
          onDelete={handleDelete}
          onBatchArchive={handleBatchArchive}
          onBatchDelete={handleBatchDelete}
          onBatchMarkRead={handleBatchMarkRead}
          hasNextPage={!!data?.nextPageToken}
          hasPrevPage={pageIndex > 0}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          pageIndex={pageIndex}
          pageSize={50}
          totalEstimate={data?.resultSizeEstimate}
          emptyTitle={searchQuery ? 'No matching emails found' : 'No emails here'}
          emptySubtitle={
            searchQuery
              ? 'Try searching with different keywords or check spelling.'
              : 'Your email list is all caught up. Click Sync to check for new messages.'
          }
        />
      </div>
    </div>
  );
};
