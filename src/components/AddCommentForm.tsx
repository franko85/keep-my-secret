import React, { useState } from 'react';
import { Box, TextField, Button, Alert, Paper } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { commentService } from '../services/commentService';
import type { CommentWithReveal } from '../types';

interface AddCommentFormProps {
  threadId: string;
  isDisabled: boolean;
  onCommentAdded: (comment: CommentWithReveal) => void;
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({ threadId, isDisabled, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!content.trim()) {
      setError('Il commento non può essere vuoto');
      return;
    }

    if (content.length < 3) {
      setError('Il commento deve avere almeno 3 caratteri');
      return;
    }

    setIsLoading(true);
    try {
      const comment = await commentService.createComment({ threadId, content: content.trim() });
      onCommentAdded(comment);
      setContent('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Errore durante l\'invio del commento');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 2, position: 'sticky', bottom: { xs: 64, md: 0 }, zIndex: 10 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder={isDisabled ? 'Thread scaduto - impossibile commentare' : 'Scrivi il tuo commento anonimo...'}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isDisabled || isLoading}
          sx={{ mb: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          endIcon={<SendIcon />}
          disabled={isDisabled || isLoading || !content.trim()}
          fullWidth
        >
          {isLoading ? 'Invio...' : 'Invia Commento'}
        </Button>

        {isDisabled && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Questo thread è scaduto. Non è più possibile aggiungere commenti.
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

export default AddCommentForm;
