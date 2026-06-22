import { create } from 'zustand';
import api from '../shared/services/api.js';

export const useInterviewStore = create((set, get) => ({
  history: [],
  totalHistory: 0,
  totalPages: 1,
  currentPage: 1,
  
  activeInterview: null,
  activeMessages: [],
  activeResult: null,
  
  analytics: null,
  
  loading: false,
  messageLoading: false,
  error: null,

  fetchHistory: async (page = 1, search = '', difficulty = 'All', status = 'All') => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/interviews/history', {
        params: { page, limit: 8, search, difficulty, status },
      });
      set({
        history: res.data.interviews,
        totalHistory: res.data.total,
        totalPages: res.data.pages,
        currentPage: res.data.page,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch interview history.',
        loading: false,
      });
    }
  },

  createInterview: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/interviews/create', data);
      set({ activeInterview: res.data, activeMessages: [], activeResult: null, loading: false });
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to create interview.',
        loading: false,
      });
      return null;
    }
  },

  fetchInterviewDetails: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/interviews/${id}`);
      set({
        activeInterview: {
          _id: res.data._id,
          topic: res.data.topic,
          role: res.data.role,
          difficulty: res.data.difficulty,
          interviewType: res.data.interviewType,
          duration: res.data.duration,
          status: res.data.status,
        },
        activeMessages: res.data.messages,
        loading: false,
      });
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch interview details.',
        loading: false,
      });
      return null;
    }
  },

  startInterview: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post(`/interviews/${id}/start`);
      // Update local interview status and message logs
      set((state) => ({
        activeInterview: res.data.interview,
        activeMessages: res.data.message ? [res.data.message] : state.activeMessages,
        loading: false,
      }));
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to start interview.',
        loading: false,
      });
      return null;
    }
  },

  sendMessage: async (id, messageText) => {
    set({ messageLoading: true, error: null });
    
    // Optimistically add candidate's response to local state first
    const optimisticCandidateMessage = {
      _id: `temp-${Date.now()}`,
      sender: 'candidate',
      message: messageText,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      activeMessages: [...state.activeMessages, optimisticCandidateMessage],
    }));

    try {
      const res = await api.post(`/interviews/${id}/message`, { message: messageText });
      
      // Replace temp message and append the new AI response
      set((state) => {
        const filtered = state.activeMessages.filter((m) => m._id !== optimisticCandidateMessage._id);
        return {
          activeMessages: [...filtered, res.data.candidateMessage, res.data.interviewerMessage],
          messageLoading: false,
        };
      });
      return res.data.interviewerMessage;
    } catch (err) {
      // Revert optimistic addition and display error
      set((state) => ({
        activeMessages: state.activeMessages.filter((m) => m._id !== optimisticCandidateMessage._id),
        error: err.response?.data?.message || 'Failed to send message.',
        messageLoading: false,
      }));
      return null;
    }
  },

  endInterview: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post(`/interviews/${id}/end`);
      set({
        activeInterview: res.data.interview,
        activeResult: res.data.result,
        loading: false,
      });
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to evaluate and end interview.',
        loading: false,
      });
      return null;
    }
  },

  fetchInterviewResult: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/interviews/${id}/result`);
      set({ activeResult: res.data, loading: false });
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch interview result.',
        loading: false,
      });
      return null;
    }
  },

  fetchAnalytics: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/analytics');
      set({ analytics: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch analytics.',
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
