import type { User, Group, Thread, Comment } from '../types';
import { seedUsers, seedUserPasswords, seedGroups, seedThreads, seedComments } from '../utils/seedData';

// Chiavi localStorage
export const STORAGE_KEYS = {
  USERS: 'kms_users',
  USER_PASSWORDS: 'kms_user_passwords',
  GROUPS: 'kms_groups',
  THREADS: 'kms_threads',
  COMMENTS: 'kms_comments',
  AUTH_TOKEN: 'kms_token',
  CURRENT_USER: 'kms_current_user',
};

/**
 * Inizializza il localStorage con i dati seed se non esistono
 */
export const initializeStorage = (): void => {
  // Verifica se i dati sono già stati inizializzati
  const usersExist = localStorage.getItem(STORAGE_KEYS.USERS);

  if (!usersExist) {
    console.log('🌱 Inizializzazione dati seed...');

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(seedUsers));
    localStorage.setItem(STORAGE_KEYS.USER_PASSWORDS, JSON.stringify(seedUserPasswords));
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(seedGroups));
    localStorage.setItem(STORAGE_KEYS.THREADS, JSON.stringify(seedThreads));
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(seedComments));

    console.log('✅ Dati seed inizializzati con successo!');
    console.log('👤 Utenti demo:', seedUsers.map(u => `${u.email} (password: password123)`).join(', '));
    console.log('👥 Gruppi demo:', seedGroups.map(g => `${g.name} (key: ${g.groupKey}, password: ${g.hashedPassword})`).join(', '));
  }
};

/**
 * Ottiene gli utenti dal localStorage
 */
export const getUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

/**
 * Salva gli utenti nel localStorage
 */
export const saveUsers = (users: User[]): void => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

/**
 * Ottiene le password degli utenti dal localStorage
 */
export const getUserPasswords = (): Record<string, string> => {
  const data = localStorage.getItem(STORAGE_KEYS.USER_PASSWORDS);
  return data ? JSON.parse(data) : {};
};

/**
 * Salva le password degli utenti nel localStorage
 */
export const saveUserPasswords = (passwords: Record<string, string>): void => {
  localStorage.setItem(STORAGE_KEYS.USER_PASSWORDS, JSON.stringify(passwords));
};

/**
 * Ottiene i gruppi dal localStorage
 */
export const getGroups = (): Group[] => {
  const data = localStorage.getItem(STORAGE_KEYS.GROUPS);
  return data ? JSON.parse(data) : [];
};

/**
 * Salva i gruppi nel localStorage
 */
export const saveGroups = (groups: Group[]): void => {
  localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
};

/**
 * Ottiene i thread dal localStorage
 */
export const getThreads = (): Thread[] => {
  const data = localStorage.getItem(STORAGE_KEYS.THREADS);
  return data ? JSON.parse(data) : [];
};

/**
 * Salva i thread nel localStorage
 */
export const saveThreads = (threads: Thread[]): void => {
  localStorage.setItem(STORAGE_KEYS.THREADS, JSON.stringify(threads));
};

/**
 * Ottiene i commenti dal localStorage
 */
export const getComments = (): Comment[] => {
  const data = localStorage.getItem(STORAGE_KEYS.COMMENTS);
  return data ? JSON.parse(data) : [];
};

/**
 * Salva i commenti nel localStorage
 */
export const saveComments = (comments: Comment[]): void => {
  localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
};

/**
 * Ottiene il token di autenticazione
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Salva il token di autenticazione
 */
export const saveAuthToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
};

/**
 * Rimuove il token di autenticazione
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Ottiene l'utente corrente
 */
export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

/**
 * Salva l'utente corrente
 */
export const saveCurrentUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
};

/**
 * Rimuove l'utente corrente
 */
export const removeCurrentUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

/**
 * Pulisce tutti i dati di autenticazione
 */
export const clearAuth = (): void => {
  removeAuthToken();
  removeCurrentUser();
};

/**
 * Reset completo del localStorage (per testing)
 */
export const resetStorage = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  initializeStorage();
};

