import type { User, Group, Thread, Comment } from '../types';
import { toISOUTC } from './dateUtils';

// Utility per creare date relative
const addDays = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const addHours = (hours: number): Date => {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date;
};

// Utenti demo
export const seedUsers: User[] = [
  {
    id: 'user-1',
    email: 'mario.rossi@example.com',
    username: 'Mario Rossi',
    createdAt: toISOUTC(addDays(-30)),
  },
  {
    id: 'user-2',
    email: 'giulia.bianchi@example.com',
    username: 'Giulia Bianchi',
    createdAt: toISOUTC(addDays(-25)),
  },
  {
    id: 'user-3',
    email: 'luca.verdi@example.com',
    username: 'Luca Verdi',
    createdAt: toISOUTC(addDays(-20)),
  },
];

// Password degli utenti: "password123" (hash simulato)
export const seedUserPasswords: Record<string, string> = {
  'user-1': 'password123',
  'user-2': 'password123',
  'user-3': 'password123',
};

// Gruppi demo
export const seedGroups: Group[] = [
  {
    id: 'group-1',
    name: 'Team Lavoro',
    groupKey: 'abc123-def456-ghi789',
    hashedPassword: 'team2024', // Password: "team2024"
    createdById: 'user-1',
    memberIds: ['user-1', 'user-2', 'user-3'],
    createdAt: toISOUTC(addDays(-15)),
  },
  {
    id: 'group-2',
    name: 'Amici Calcetto',
    groupKey: 'xyz789-uvw456-rst123',
    hashedPassword: 'calcio2024', // Password: "calcio2024"
    createdById: 'user-2',
    memberIds: ['user-1', 'user-2'],
    createdAt: toISOUTC(addDays(-10)),
  },
];

// Thread demo con vari stati
export const seedThreads: Thread[] = [
  // Thread scaduto (commenti rivelati)
  {
    id: 'thread-1',
    groupId: 'group-1',
    title: 'Feedback sul progetto Q4',
    content: 'Cosa pensate del progetto completato a dicembre? Siate sinceri!',
    startDate: toISOUTC(addDays(-7)),
    endDate: toISOUTC(addDays(-2)),
    createdById: 'user-1',
    createdAt: toISOUTC(addDays(-7)),
  },
  // Thread attivo (commenti anonimi)
  {
    id: 'thread-2',
    groupId: 'group-1',
    title: 'Proposte per il team building',
    content: 'Raccogliamo idee anonime per la prossima attività di team. Votazioni tra 2 giorni!',
    startDate: toISOUTC(addDays(-1)),
    endDate: toISOUTC(addDays(2)),
    createdById: 'user-2',
    createdAt: toISOUTC(addDays(-1)),
  },
  // Thread futuro (non ancora iniziato)
  {
    id: 'thread-3',
    groupId: 'group-1',
    title: 'Valutazione nuovo processo',
    content: 'Tra una settimana valuteremo il nuovo processo. Preparate feedback!',
    startDate: toISOUTC(addDays(7)),
    endDate: toISOUTC(addDays(14)),
    createdById: 'user-1',
    createdAt: toISOUTC(addDays(-1)),
  },
  // Thread attivo nel gruppo calcetto
  {
    id: 'thread-4',
    groupId: 'group-2',
    title: 'Chi può giocare domenica?',
    content: 'Confermate la presenza per domenica pomeriggio. Risposte entro venerdì!',
    startDate: toISOUTC(addDays(-2)),
    endDate: toISOUTC(addDays(3)),
    createdById: 'user-2',
    createdAt: toISOUTC(addDays(-2)),
  },
];

// Commenti demo
export const seedComments: Comment[] = [
  // Commenti su thread-1 (scaduto - rivelati)
  {
    id: 'comment-1',
    threadId: 'thread-1',
    content: 'Ottimo lavoro di squadra! Forse un po\' troppo stress nelle ultime settimane.',
    authorId: 'user-2',
    createdAt: toISOUTC(addDays(-6)),
  },
  {
    id: 'comment-2',
    threadId: 'thread-1',
    content: 'Penso che la comunicazione potrebbe migliorare. A volte mancavano informazioni chiave.',
    authorId: 'user-3',
    createdAt: toISOUTC(addDays(-5)),
  },
  {
    id: 'comment-3',
    threadId: 'thread-1',
    content: 'Concordo con il commento sulla comunicazione. Per il resto tutto ok!',
    authorId: 'user-1',
    createdAt: toISOUTC(addDays(-4)),
  },

  // Commenti su thread-2 (attivo - anonimi)
  {
    id: 'comment-4',
    threadId: 'thread-2',
    content: 'Escape room! Sarebbe divertente e aiuta il problem solving.',
    authorId: 'user-1',
    createdAt: toISOUTC(addHours(-20)),
  },
  {
    id: 'comment-5',
    threadId: 'thread-2',
    content: 'Preferisco qualcosa all\'aperto, magari un\'escursione o rafting.',
    authorId: 'user-3',
    createdAt: toISOUTC(addHours(-15)),
  },
  {
    id: 'comment-6',
    threadId: 'thread-2',
    content: 'Cooking class! Cucinare insieme potrebbe essere rilassante.',
    authorId: 'user-2',
    createdAt: toISOUTC(addHours(-10)),
  },
  {
    id: 'comment-7',
    threadId: 'thread-2',
    content: '+1 per l\'escape room, oppure un torneo sportivo (calcetto, bowling).',
    authorId: 'user-1',
    createdAt: toISOUTC(addHours(-5)),
  },

  // Commenti su thread-4 (attivo - anonimi)
  {
    id: 'comment-8',
    threadId: 'thread-4',
    content: 'Io ci sono! A che ora esattamente?',
    authorId: 'user-1',
    createdAt: toISOUTC(addHours(-30)),
  },
  {
    id: 'comment-9',
    threadId: 'thread-4',
    content: 'Probabile, ma devo confermare stasera con la famiglia.',
    authorId: 'user-2',
    createdAt: toISOUTC(addHours(-25)),
  },
];

