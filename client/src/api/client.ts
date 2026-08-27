import axios from 'axios';
import {
  User,
  ConnectedAccount,
  Email,
  EmailThread,
  Activity,
  EmailSummary,
  EmailReplyDraft,
  SendEmailPayload,
  SendReplyPayload,
  ReplyTone,
  GetEmailsResponse,
} from '../types';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Bearer token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexus_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for unified data extraction & error handling
api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success !== undefined) {
      return response.data;
    }
    return response;
  },
  (error) => {
    const errorData = error.response?.data?.error || {
      code: 'NETWORK_ERROR',
      message: error.message || 'Network request failed',
    };
    return Promise.reject(errorData);
  }
);

export const authApi = {
  getMe: async (): Promise<{ user: User }> => {
    const res: any = await api.get('/auth/me');
    return res.data;
  },
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};

export const accountApi = {
  getAccount: async (): Promise<{ user: User; connectedAccount: ConnectedAccount | null; isConnected: boolean }> => {
    const res: any = await api.get('/account');
    return res.data;
  },
  deleteAccount: async (): Promise<void> => {
    await api.delete('/account');
  },
  disconnectAccount: async (): Promise<void> => {
    await api.delete('/account');
  },
};

export const emailApi = {
  getEmails: async (params?: {
    folder?: string;
    category?: 'primary' | 'promotions' | 'social' | 'updates';
    q?: string;
    limit?: number;
    offset?: number;
    pageToken?: string;
    sync?: boolean;
  }): Promise<GetEmailsResponse> => {
    const res: any = await api.get('/emails', { params });
    return res.data;
  },
  searchEmails: async (q: string, pageToken?: string): Promise<GetEmailsResponse> => {
    const res: any = await api.get('/emails/search', { params: { q, pageToken } });
    return res.data;
  },
  getEmail: async (id: string): Promise<Email> => {
    const res: any = await api.get(`/emails/${id}`);
    return res.data;
  },
  getEmailById: async (id: string): Promise<Email> => {
    const res: any = await api.get(`/emails/${id}`);
    return res.data;
  },
  getThread: async (threadId: string): Promise<EmailThread> => {
    const res: any = await api.get(`/threads/${threadId}`);
    return res.data;
  },
  markRead: async (id: string, isRead: boolean): Promise<Email> => {
    const res: any = await api.patch(`/emails/${id}/read`, { isRead });
    return res.data;
  },
  markStar: async (id: string, isStarred: boolean): Promise<Email> => {
    const res: any = await api.patch(`/emails/${id}/star`, { isStarred });
    return res.data;
  },
  archiveEmail: async (id: string): Promise<Email> => {
    const res: any = await api.post(`/emails/${id}/archive`);
    return res.data;
  },
  deleteEmail: async (id: string): Promise<void> => {
    await api.delete(`/emails/${id}`);
  },
  sendEmail: async (payload: SendEmailPayload): Promise<{ id: string; threadId: string }> => {
    const res: any = await api.post('/emails/send', payload);
    return res.data;
  },
  replyEmail: async (id: string, payload: SendReplyPayload): Promise<{ id: string; threadId: string }> => {
    const res: any = await api.post(`/emails/${id}/reply`, payload);
    return res.data;
  },
  sendReply: async (id: string, payload: SendReplyPayload): Promise<{ id: string; threadId: string }> => {
    const res: any = await api.post(`/emails/${id}/reply`, payload);
    return res.data;
  },
};

export const aiApi = {
  summarize: async (payload: { emailId?: string; threadId?: string; subject?: string; sender?: string; bodyText?: string }): Promise<EmailSummary> => {
    const res: any = await api.post('/ai/summarize', payload);
    return res.data;
  },
  summarizeEmail: async (emailId: string): Promise<EmailSummary> => {
    const res: any = await api.post('/ai/summarize', { emailId });
    return res.data;
  },
  generateReply: async (payload: {
    emailId?: string;
    threadId?: string;
    tone?: ReplyTone;
    additionalContext?: string;
    subject?: string;
    sender?: string;
    bodyText?: string;
  }): Promise<EmailReplyDraft> => {
    const res: any = await api.post('/ai/reply', payload);
    const data = res.data;
    return {
      ...data,
      draft: data.replyText || data.draft || '',
      replyText: data.replyText || data.draft || '',
    };
  },
};

export const activityApi = {
  getActivity: async (limit = 50): Promise<{ activities: Activity[] }> => {
    const res: any = await api.get('/activity', { params: { limit } });
    return res.data;
  },
};
