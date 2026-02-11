import React from 'react';
import { Box, Card, CardContent, Typography, Avatar, Chip } from '@mui/material';
import { Person as PersonIcon, AccessTime as TimeIcon } from '@mui/icons-material';
import type { CommentWithReveal } from '../types';
import { formatTime, formatDate } from '../utils/dateUtils';

interface CommentListProps {
  comments: CommentWithReveal[];
  isThreadExpired: boolean;
}

const CommentList: React.FC<CommentListProps> = ({ comments, isThreadExpired }) => {
  if (comments.length === 0) {
    return (
      <Card sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Nessun commento ancora. Sii il primo a commentare!
        </Typography>
      </Card>
    );
  }

  return (
    <Box>
      {comments.map((comment) => (
        <Card key={comment.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1} gap={1}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                <PersonIcon fontSize="small" />
              </Avatar>

              {comment.author ? (
                <Typography variant="subtitle2" fontWeight={600}>
                  {comment.author.username}
                </Typography>
              ) : (
                <Chip label="Anonimo" size="small" color="default" />
              )}

              <Box flexGrow={1} />

              <Chip
                icon={<TimeIcon />}
                label={formatTime(comment.createdAt)}
                size="small"
                variant="outlined"
              />
            </Box>

            <Typography variant="body1" sx={{ mt: 2 }}>
              {isThreadExpired ? comment.content : 'Contenuto nascosto fino alla scadenza del thread'}
            </Typography>

            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              Pubblicato il {formatDate(comment.createdAt)}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default CommentList;
