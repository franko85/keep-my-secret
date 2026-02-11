import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password) {
      setError('Tutti i campi sono obbligatori');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email non valida');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
      navigate('/groups');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Errore durante il login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ p: 0 }}>
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          pt: { xs: 2, sm: 4 },
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 420, boxShadow: 3 }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Keep My Secret
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom align="center" sx={{ mb: 3 }}>
              Accedi al tuo account
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                margin="normal"
                required
                autoComplete="email"
                autoFocus
                inputProps={{ inputMode: 'email' }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                margin="normal"
                required
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ mt: 3, mb: 2 }}
              >
                {isLoading ? 'Accesso in corso...' : 'Accedi'}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2">
                  Non hai un account?{' '}
                  <Link component={RouterLink} to="/register" underline="hover">
                    Registrati
                  </Link>
                </Typography>
              </Box>

              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  <strong>Account Demo:</strong>
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  📧 mario.rossi@example.com
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  🔑 password123
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;

