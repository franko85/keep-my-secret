import React from 'react';
import { Box, Typography, Card, CardContent, Avatar, Divider, Button } from '@mui/material';
import { Person as PersonIcon, Email as EmailIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/dateUtils';

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Il Mio Profilo
      </Typography>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', mr: 3 }}>
              <PersonIcon sx={{ fontSize: 48 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" gutterBottom>
                {user.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <EmailIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                {user.email}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary">
            Membro da: {formatDate(user.createdAt)}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Informazioni sull'App
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Keep My Secret ti permette di creare gruppi e discutere argomenti in modo anonimo.
            I commenti rimangono anonimi fino alla scadenza del thread, quando le identità vengono rivelate.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Versione: 1.0.0 (Mock Mode)
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;

