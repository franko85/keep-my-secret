import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, CardActionArea, Fab, CircularProgress, Alert, Chip, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { Add as AddIcon, ArrowBack as ArrowBackIcon, CheckCircle as CheckCircleIcon, Schedule as ScheduleIcon, Pending as PendingIcon } from '@mui/icons-material';
import { threadService } from '../services/threadService';
import type { Thread } from '../types';
import { formatCountdown, formatDate, isThreadExpired, isThreadActive } from '../utils/dateUtils';
import CreateThreadModal from '../components/CreateThreadModal';

const GroupDetail: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    if (groupId) loadThreads();
  }, [groupId]);

  const loadThreads = async () => {
    if (!groupId) return;
    setIsLoading(true);
    setError('');
    try {
      const data = await threadService.getThreadsByGroup(groupId);
      setThreads(data);
    } catch (err) {
      setError('Errore nel caricamento dei thread');
    } finally {
      setIsLoading(false);
    }
  };

  const handleThreadClick = (thread: Thread) => navigate(`/groups/${groupId}/threads/${thread.id}`);
  const handleThreadCreated = (thread: Thread) => {
    setThreads((prev) => [...prev, thread]);
    setCreateModalOpen(false);
  };

  const getThreadStatus = (thread: Thread) => {
    if (isThreadExpired(thread.endDate)) return { label: 'Scaduto', color: 'default' as const, icon: <CheckCircleIcon /> };
    if (isThreadActive(thread.startDate, thread.endDate)) return { label: 'Attivo', color: 'success' as const, icon: <ScheduleIcon /> };
    return { label: 'Programmato', color: 'info' as const, icon: <PendingIcon /> };
  };

  if (isLoading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/groups')} sx={{ mr: 1 }}><ArrowBackIcon /></IconButton>
        <Typography variant="h4" component="h1">Thread del Gruppo</Typography>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {threads.length === 0 ? (
        <Card sx={{ mt: 3, textAlign: 'center', p: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>Nessun thread trovato</Typography>
          <Typography variant="body2" color="text.secondary">Crea il primo thread!</Typography>
        </Card>
      ) : (
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)'
          },
          gap: 2
        }}>
          {threads.map((thread) => {
            const status = getThreadStatus(thread);
            return (
              <Card key={thread.id}><CardActionArea onClick={() => handleThreadClick(thread)}><CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                  <Typography variant="h6" sx={{ flexGrow: 1, pr: 1 }}>{thread.title}</Typography>
                  <Chip label={status.label} color={status.color} size="small" icon={status.icon} />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {thread.content.length > 100 ? `${thread.content.substring(0, 100)}...` : thread.content}
                </Typography>
                <Chip label={formatCountdown(thread.endDate)} size="small" variant="outlined" color={isThreadExpired(thread.endDate) ? 'default' : 'warning'} />
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  Creato il {formatDate(thread.createdAt)}
                </Typography>
              </CardContent></CardActionArea></Card>
            );
          })}
        </Box>
      )}
      <Fab color="primary" sx={{ position: 'fixed', bottom: isMobile ? 72 : 16, right: 16 }} onClick={() => setCreateModalOpen(true)}><AddIcon /></Fab>
      {groupId && <CreateThreadModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} groupId={groupId} onThreadCreated={handleThreadCreated} />}
    </Box>
  );
};

export default GroupDetail;

