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
  Typography,
  IconButton,
  Snackbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Close as CloseIcon, ContentCopy as CopyIcon } from '@mui/icons-material';
import { groupService } from '../services/groupService';
import type { Group } from '../types';

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
  onGroupCreated: (group: Group) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  open,
  onClose,
  onGroupCreated,
}) => {
  const theme = useTheme();
  // @ts-ignore - MUI theme breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [createdGroup, setCreatedGroup] = useState<Group | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleClose = () => {
    setName('');
    setPassword('');
    setError('');
    setCreatedGroup(null);
    onClose();
  };

  const validateForm = () => {
    if (!name || !password) {
      setError('Tutti i campi sono obbligatori');
      return false;
    }
    if (name.length < 3) {
      setError('Il nome del gruppo deve avere almeno 3 caratteri');
      return false;
    }
    if (password.length < 4) {
      setError('La password deve avere almeno 4 caratteri');
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
      const group = await groupService.createGroup({ name, password });
      setCreatedGroup(group);
      onGroupCreated(group);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Errore durante la creazione del gruppo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyGroupKey = () => {
    if (createdGroup) {
      navigator.clipboard.writeText(createdGroup.groupKey);
      setSnackbarOpen(true);
    }
  };

  if (createdGroup) {
    return (
      <>
        <Dialog
          open={open}
          onClose={handleClose}
          fullScreen={isMobile}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Gruppo Creato! 🎉
            <IconButton
              onClick={handleClose}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Alert severity="success" sx={{ mb: 3 }}>
              Il gruppo "{createdGroup.name}" è stato creato con successo!
            </Alert>

            <Typography variant="body2" gutterBottom>
              Condividi questa chiave con gli altri membri per permettergli di unirsi:
            </Typography>

            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: 'grey.100',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="body1" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {createdGroup.groupKey}
              </Typography>
              <IconButton onClick={handleCopyGroupKey} color="primary">
                <CopyIcon />
              </IconButton>
            </Box>

            <Alert severity="info" sx={{ mt: 3 }}>
              <strong>Importante:</strong> Conserva anche la password del gruppo. Sarà richiesta insieme alla chiave per accedere.
            </Alert>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose} variant="contained" fullWidth={isMobile}>
              Ho Capito
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          message="Chiave copiata!"
        />
      </>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={isMobile}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Crea Nuovo Gruppo
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
            label="Nome Gruppo"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            margin="normal"
            required
            autoFocus
            placeholder="es. Team Lavoro, Amici, Famiglia..."
          />
          <TextField
            fullWidth
            label="Password Gruppo"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            margin="normal"
            required
            helperText="Scegli una password per proteggere l'accesso al gruppo"
          />

          <Alert severity="info" sx={{ mt: 2 }}>
            Verrà generata automaticamente una chiave univoca da condividere con i membri del gruppo.
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
            {isLoading ? 'Creazione...' : 'Crea Gruppo'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateGroupModal;

