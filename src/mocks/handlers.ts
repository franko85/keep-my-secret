import { http, HttpResponse, delay } from 'msw';
import {
  getUsers,
  saveUsers,
  getUserPasswords,
  saveUserPasswords,
  getGroups,
  saveGroups,
  getThreads,
  saveThreads,
  getComments,
  saveComments,
} from './storage';
import type {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Group,
  CreateGroupRequest,
  JoinGroupRequest,
  Thread,
  CreateThreadRequest,
  Comment,
  CreateCommentRequest,
  CommentWithReveal,
} from '../types';
import { toISOUTC, isThreadExpired } from '../utils/dateUtils';

// Simula latency di rete mobile
const networkDelay = () => delay(200 + Math.random() * 300);

// Funzione robusta per estrarre userId dal token
function extractUserIdFromToken(token: string | null): string | undefined {
  if (!token) return undefined;
  // Esempio: mock-token-user-1-123456789
  const match = token.match(/mock-token-(user-\d+)-\d+/);
  return match ? match[1] : undefined;
}

export const handlers = [
  // AUTH - Register
  http.post<never, RegisterRequest>('/api/auth/register', async ({ request }) => {
    await networkDelay();

    const body = await request.json();
    const { email, username, password } = body;

    const users = getUsers();
    const passwords = getUserPasswords();

    // Verifica se email già esiste
    if (users.find(u => u.email === email)) {
      return HttpResponse.json(
        { error: 'Email già registrata' },
        { status: 400 }
      );
    }

    // Crea nuovo utente
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      username,
      createdAt: toISOUTC(new Date()),
    };

    users.push(newUser);
    passwords[newUser.id] = password;

    saveUsers(users);
    saveUserPasswords(passwords);

    // Genera token simulato
    const token = `mock-token-${newUser.id}-${Date.now()}`;

    const response: AuthResponse = {
      user: newUser,
      token,
    };

    return HttpResponse.json(response);
  }),

  // AUTH - Login
  http.post<never, LoginRequest>('/api/auth/login', async ({ request }) => {
    await networkDelay();

    const body = await request.json();
    const { email, password } = body;

    const users = getUsers();
    const passwords = getUserPasswords();

    const user = users.find(u => u.email === email);

    if (!user || passwords[user.id] !== password) {
      return HttpResponse.json(
        { error: 'Credenziali non valide' },
        { status: 401 }
      );
    }

    // Genera token simulato
    const token = `mock-token-${user.id}-${Date.now()}`;

    const response: AuthResponse = {
      user,
      token,
    };

    return HttpResponse.json(response);
  }),

  // GROUPS - Get all groups for user
  http.get('/api/groups', async ({ request }) => {
    await networkDelay();

    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    // Estrai userId dal token
    const userId = extractUserIdFromToken(authHeader);
    if (!userId) {
      return HttpResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const groups = getGroups();
    const userGroups = groups.filter(g => g.memberIds.includes(userId));

    return HttpResponse.json(userGroups);
  }),

  // GROUPS - Create group
  http.post<never, CreateGroupRequest>('/api/groups', async ({ request }) => {
    await networkDelay();

    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const userId = extractUserIdFromToken(authHeader);
    if (!userId) {
      return HttpResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }
    const body = await request.json();
    const { name, password } = body;

    // Genera UUID per groupKey
    const groupKey = crypto.randomUUID();

    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name,
      groupKey,
      hashedPassword: password, // In produzione sarebbe hashato
      createdById: userId,
      memberIds: [userId],
      createdAt: toISOUTC(new Date()),
    };

    const groups = getGroups();
    groups.push(newGroup);
    saveGroups(groups);

    return HttpResponse.json(newGroup);
  }),

  // GROUPS - Join group
  http.post<{ id: string }, JoinGroupRequest>('/api/groups/:id/join', async ({ request }) => {
    await networkDelay();

    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const userId = extractUserIdFromToken(authHeader);
    if (!userId) {
      return HttpResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }
    const body = await request.json();
    const { groupKey, password } = body;

    const groups = getGroups();
    const group = groups.find(g => g.groupKey === groupKey);

    if (!group) {
      return HttpResponse.json({ error: 'Gruppo non trovato' }, { status: 404 });
    }

    if (group.hashedPassword !== password) {
      return HttpResponse.json({ error: 'Password non valida' }, { status: 401 });
    }

    // Aggiungi utente al gruppo se non presente
    if (!group.memberIds.includes(userId)) {
      group.memberIds.push(userId);
      saveGroups(groups);
    }

    return HttpResponse.json(group);
  }),

  // THREADS - Get threads for group
  http.get<{ groupId: string }>('/api/groups/:groupId/threads', async ({ request, params }) => {
    await networkDelay();

    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { groupId } = params;
    const threads = getThreads();
    const groupThreads = threads.filter(t => t.groupId === groupId);

    return HttpResponse.json(groupThreads);
  }),

  // THREADS - Create thread
  http.post<never, CreateThreadRequest>('/api/threads', async ({ request }) => {
    await networkDelay();

    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const userId = extractUserIdFromToken(authHeader);
    if (!userId) {
      return HttpResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }
    const body = await request.json();
    const { groupId, title, content, startDate, endDate } = body;

    // Validazione date
    if (new Date(startDate) >= new Date(endDate)) {
      return HttpResponse.json(
        { error: 'La data di fine deve essere successiva alla data di inizio' },
        { status: 400 }
      );
    }

    const newThread: Thread = {
      id: `thread-${Date.now()}`,
      groupId,
      title,
      content,
      startDate,
      endDate,
      createdById: userId,
      createdAt: toISOUTC(new Date()),
    };

    const threads = getThreads();
    threads.push(newThread);
    saveThreads(threads);

    return HttpResponse.json(newThread);
  }),

  // THREADS - Get single thread
  http.get<{ threadId: string }>('/api/threads/:threadId', async ({ request, params }) => {
    await networkDelay();

    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { threadId } = params;
    const threads = getThreads();
    const thread = threads.find(t => t.id === threadId);

    if (!thread) {
      return HttpResponse.json({ error: 'Thread non trovato' }, { status: 404 });
    }

    return HttpResponse.json(thread);
  }),

  // COMMENTS - Get comments for thread
  http.get<{ threadId: string }>('/api/threads/:threadId/comments', async ({ request, params }) => {
    await networkDelay();

    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { threadId } = params;
    const comments = getComments();
    const threads = getThreads();
    const users = getUsers();

    const thread = threads.find(t => t.id === threadId);
    if (!thread) {
      return HttpResponse.json({ error: 'Thread non trovato' }, { status: 404 });
    }

    const threadComments = comments.filter(c => c.threadId === threadId);
    const isExpired = isThreadExpired(thread.endDate);

    // Aggiungi informazioni autore SEMPRE
    const commentsWithReveal: CommentWithReveal[] = threadComments.map(comment => ({
      ...comment,
      isRevealed: isExpired,
      author: users.find(u => u.id === comment.authorId),
    }));

    return HttpResponse.json(commentsWithReveal);
  }),

  // COMMENTS - Create comment
  http.post<never, CreateCommentRequest>('/api/comments', async ({ request }) => {
    await networkDelay();

    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const userId = extractUserIdFromToken(authHeader);
    if (!userId) {
      return HttpResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }
    const body = await request.json();
    const { threadId, content } = body;

    const threads = getThreads();
    const thread = threads.find(t => t.id === threadId);

    if (!thread) {
      return HttpResponse.json({ error: 'Thread non trovato' }, { status: 404 });
    }

    // Verifica se thread è scaduto
    if (isThreadExpired(thread.endDate)) {
      return HttpResponse.json(
        { error: 'Non è possibile commentare su un thread scaduto' },
        { status: 400 }
      );
    }

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      threadId,
      content,
      authorId: userId,
      createdAt: toISOUTC(new Date()),
    };

    const comments = getComments();
    comments.push(newComment);
    saveComments(comments);

    // Restituisci subito anche l'autore e isRevealed (come la GET)
    const users = getUsers();
    const author = users.find(u => u.id === userId);
    const isExpired = isThreadExpired(thread.endDate);
    const commentWithReveal = {
      ...newComment,
      isRevealed: isExpired,
      author,
    };

    return HttpResponse.json(commentWithReveal);
  }),
];

