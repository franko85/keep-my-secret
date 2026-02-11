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

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!email || !username || !password || !confirmPassword) {
      setError('Tutti i campi sono obbligatori');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email non valida');
      return false;
    }
    if (username.length < 3) {
      setError('Il nome utente deve avere almeno 3 caratteri');
      return false;
    }
    if (password.length < 6) {
      setError('La password deve avere almeno 6 caratteri');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Le password non coincidono');
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
      await register({ email, username, password });
      navigate('/groups');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Errore durante la registrazione');
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
              Crea Account
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom align="center" sx={{ mb: 3 }}>
              Registrati per iniziare a usare Keep My Secret
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
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                autoComplete="email"
                autoFocus
                inputProps={{ inputMode: 'email' }}
              />
              <TextField
                fullWidth
                label="Nome Utente"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                required
                autoComplete="username"
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                autoComplete="new-password"
              />
              <TextField
                fullWidth
                label="Conferma Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
                required
                autoComplete="new-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ mt: 3, mb: 2 }}
              >
                {isLoading ? 'Registrazione in corso...' : 'Registrati'}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2">
                  Hai già un account?{' '}
                  <Link component={RouterLink} to="/login" underline="hover">
                    Accedi
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Register;

