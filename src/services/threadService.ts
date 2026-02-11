import api from './api';
import type { Thread, CreateThreadRequest } from '../types';

export const threadService = {
  /**
   * Ottiene tutti i thread di un gruppo
   */
  getThreadsByGroup: async (groupId: string): Promise<Thread[]> => {
    const response = await api.get<Thread[]>(`/groups/${groupId}/threads`);
    return response.data;
  },

  /**
   * Ottiene un singolo thread
   */
  getThread: async (threadId: string): Promise<Thread> => {
    const response = await api.get<Thread>(`/threads/${threadId}`);
    return response.data;
  },

  /**
   * Crea un nuovo thread
   */
  createThread: async (data: CreateThreadRequest): Promise<Thread> => {
    const response = await api.post<Thread>('/threads', data);
    return response.data;
  },
};
