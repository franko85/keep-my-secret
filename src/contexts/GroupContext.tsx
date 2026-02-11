import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Group } from '../types';
import { groupService } from '../services/groupService';

interface GroupContextType {
  groups: Group[];
  currentGroup: Group | null;
  isLoading: boolean;
  fetchGroups: () => Promise<void>;
  setCurrentGroup: (group: Group | null) => void;
  addGroup: (group: Group) => void;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const GroupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentGroup, setCurrentGroupState] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const data = await groupService.getMyGroups();
      setGroups(data);
    } catch (error) {
      console.error('Errore nel caricamento dei gruppi:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const setCurrentGroup = (group: Group | null) => {
    setCurrentGroupState(group);
  };

  const addGroup = (group: Group) => {
    setGroups((prev) => [...prev, group]);
  };

  const value: GroupContextType = {
    groups,
    currentGroup,
    isLoading,
    fetchGroups,
    setCurrentGroup,
    addGroup,
  };

  return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>;
};

export const useGroups = (): GroupContextType => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error('useGroups deve essere usato all\'interno di GroupProvider');
  }
  return context;
};

