import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { groupService } from '../services/groupService';
import type { Group } from '../types';

interface JoinGroupModalProps {
  open: boolean;
  onClose: () => void;
  onGroupJoined: (group: Group) => void;
}

const JoinGroupModal: React.FC<JoinGroupModalProps> = ({
  open,
  onClose,
  onGroupJoined,
}) => {
  const theme = useTheme();
  // @ts-ignore - MUI theme breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [groupKey, setGroupKey] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setGroupKey('');
    setPassword('');
    setError('');
    onClose();
  };

  const validateForm = () => {
    if (!groupKey || !password) {
      setError('Tutti i campi sono obbligatori');
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
      const group = await groupService.joinGroup('', { groupKey, password });
      onGroupJoined(group);
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Errore durante l\'accesso al gruppo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={isMobile}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Unisciti a un Gruppo
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Chiave Gruppo"
            value={groupKey}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGroupKey(e.target.value)}
            margin="normal"
            required
            autoFocus
            placeholder="Incolla qui la chiave ricevuta"
            helperText="La chiave del gruppo che hai ricevuto dal creatore"
          />
          <TextField
            fullWidth
            label="Password Gruppo"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            margin="normal"
            required
            helperText="La password condivisa per accedere al gruppo"
          />

          <Alert severity="info" sx={{ mt: 2 }}>
            Inserisci la chiave e la password che hai ricevuto dal creatore del gruppo.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={isLoading}>
            Annulla
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            fullWidth={isMobile}
          >
            {isLoading ? 'Accesso...' : 'Unisciti'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default JoinGroupModal;

