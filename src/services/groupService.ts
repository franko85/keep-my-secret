import api from './api';
import type { Group, CreateGroupRequest, JoinGroupRequest } from '../types';

export const groupService = {
  /**
   * Ottiene tutti i gruppi dell'utente
   */
  getMyGroups: async (): Promise<Group[]> => {
    const response = await api.get<Group[]>('/groups');
    return response.data;
  },

  /**
   * Crea un nuovo gruppo
   */
  createGroup: async (data: CreateGroupRequest): Promise<Group> => {
    const response = await api.post<Group>('/groups', data);
    return response.data;
  },

  /**
   * Unisciti a un gruppo
   */
  joinGroup: async (groupId: string, data: JoinGroupRequest): Promise<Group> => {
    const response = await api.post<Group>(`/groups/${groupId}/join`, data);
    return response.data;
  },
};

