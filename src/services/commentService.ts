import api from './api';
import type {CommentWithReveal, CreateCommentRequest} from '../types';

export const commentService = {
    /**
     * Ottiene tutti i commenti di un thread
     */
    getCommentsByThread: async (threadId: string): Promise<CommentWithReveal[]> => {
        const response = await api.get<CommentWithReveal[]>(`/threads/${threadId}/comments`);
        return response.data;
    },

    /**
     * Crea un nuovo commento
     */
    createComment: async (data: CreateCommentRequest): Promise<CommentWithReveal> => {
        const response = await api.post<CommentWithReveal>('/comments', data);
        return response.data;
    },
};
