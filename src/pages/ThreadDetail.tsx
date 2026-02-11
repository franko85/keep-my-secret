import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, CircularProgress, Alert, Chip, IconButton, Divider } from '@mui/material';
import { ArrowBack as ArrowBackIcon, CheckCircle as CheckCircleIcon, Schedule as ScheduleIcon } from '@mui/icons-material';
import { threadService } from '../services/threadService';
import { commentService } from '../services/commentService';
import type { Thread, CommentWithReveal } from '../types';
import { formatCountdown, formatDate, isThreadExpired } from '../utils/dateUtils';
import CommentList from '../components/CommentList';
import AddCommentForm from '../components/AddCommentForm';

const ThreadDetail: React.FC = () => {
  const { groupId, threadId } = useParams<{ groupId: string; threadId: string }>();
  const navigate = useNavigate();
  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<CommentWithReveal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (threadId) {
      loadThreadData();
    }
  }, [threadId]);

  const loadThreadData = async () => {
    if (!threadId) return;
    setIsLoading(true);
    setError('');
    try {
      const [threadData, commentsData] = await Promise.all([
        threadService.getThread(threadId),
        commentService.getCommentsByThread(threadId),
      ]);
      setThread(threadData);
      setComments(commentsData);
    } catch (err) {
      setError('Errore nel caricamento dei dati');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentAdded = async () => {
    await loadThreadData();
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!thread) {
    return (
      <Box>
        <Alert severity="error">Thread non trovato</Alert>
      </Box>
    );
  }

  const expired = isThreadExpired(thread.endDate);

  return (
    <Box sx={{ pb: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate(`/groups/${groupId}`)} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
          {thread.title}
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={1} mb={2} flexWrap="wrap">
            <Chip
              label={expired ? 'Scaduto' : 'Attivo'}
              color={expired ? 'default' : 'success'}
              icon={expired ? <CheckCircleIcon /> : <ScheduleIcon />}
            />
            <Chip
              label={formatCountdown(thread.endDate)}
              variant="outlined"
              color={expired ? 'default' : 'warning'}
            />
          </Box>

          <Typography variant="body1" paragraph>
            {thread.content}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="caption" color="text.secondary">
            Creato il {formatDate(thread.createdAt)}
          </Typography>

          {expired && (
            <Alert severity="info" sx={{ mt: 2 }}>
              🎭 Thread scaduto - Le identità degli autori sono ora visibili!
            </Alert>
          )}
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>
        Commenti ({comments.length})
      </Typography>

      <CommentList comments={comments} isThreadExpired={expired} />

      <Box sx={{ mt: 3 }}>
        {threadId && (
          <AddCommentForm
            threadId={threadId}
            isDisabled={expired}
            onCommentAdded={handleCommentAdded}
          />
        )}
      </Box>
    </Box>
  );
};

export default ThreadDetail;

