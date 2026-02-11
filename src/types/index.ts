// User types
export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

// Group types
export interface Group {
  id: string;
  name: string;
  groupKey: string;
  hashedPassword: string;
  createdById: string;
  memberIds: string[];
  createdAt: string;
}

export interface CreateGroupRequest {
  name: string;
  password: string;
}

export interface JoinGroupRequest {
  groupKey: string;
  password: string;
}

// Thread types
export interface Thread {
  id: string;
  groupId: string;
  title: string;
  content: string;
  startDate: string; // ISO UTC
  endDate: string; // ISO UTC
  createdById: string;
  createdAt: string;
}

export interface CreateThreadRequest {
  groupId: string;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
}

// Comment types
export interface Comment {
  id: string;
  threadId: string;
  content: string;
  authorId: string;
  createdAt: string; // ISO UTC
}

export interface CommentWithReveal extends Comment {
  isRevealed: boolean;
  author?: User;
}

export interface CreateCommentRequest {
  threadId: string;
  content: string;
}

