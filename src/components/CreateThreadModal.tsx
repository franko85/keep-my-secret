import React, { useState, useEffect } from 'react';
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
import { threadService } from '../services/threadService';
import type { Thread } from '../types';
import { datetimeLocalToISO } from '../utils/dateUtils';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

interface CreateThreadModalProps {
  open: boolean;
  onClose: () => void;
  groupId: string;
  onThreadCreated: (thread: Thread) => void;
}

const CreateThreadModal: React.FC<CreateThreadModalProps> = ({
  open,
  onClose,
  groupId,
  onThreadCreated,
}) => {
  const theme = useTheme();
  // @ts-ignore - MUI theme breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setTitle('');
    setContent('');
    setStartDate('');
    setEndDate('');
    setError('');
    onClose();
  };

  const validateForm = () => {
    if (!title || !content || !startDate || !endDate) {
      setError('Tutti i campi sono obbligatori');
      return false;
    }
    if (title.length < 3) {
      setError('Il titolo deve avere almeno 3 caratteri');
      return false;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      setError('La data di fine deve essere successiva alla data di inizio');
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
      const thread = await threadService.createThread({
        groupId,
        title,
        content,
        startDate: datetimeLocalToISO(startDate),
        endDate: datetimeLocalToISO(endDate),
      });
      onThreadCreated(thread);
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Errore durante la creazione del thread');
    } finally {
      setIsLoading(false);
    }
  };

  // Inizializza la data di inizio con la data corrente quando il modal si apre
  useEffect(() => {
    if (open) {
      const now = new Date();
      // Formatta in yyyy-MM-ddTHH:mm per input type="datetime-local"
      const pad = (n: number) => n.toString().padStart(2, '0');
      const local = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
      setStartDate(local);
      setEndDate('');
      setTitle('');
      setContent('');
      setError('');
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={isMobile}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Crea Nuovo Thread
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
            label="Titolo"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            margin="normal"
            required
            autoFocus
            placeholder="es. Feedback sul progetto, Proposte per team building..."
          />

          <TextField
            fullWidth
            label="Contenuto"
            value={content}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
            margin="normal"
            required
            multiline
            rows={4}
            placeholder="Descrivi il topic del thread..."
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Data Inizio"
                value={startDate ? new Date(startDate) : null}
                onChange={(date: Date | null) => setStartDate(date ? date.toISOString().slice(0, 16) : '')}
                slotProps={{ textField: { fullWidth: true, required: true, InputLabelProps: { shrink: true }, helperText: 'I commenti saranno visibili da questa data' } }}
              />
              <DateTimePicker
                label="Data Fine"
                value={endDate ? new Date(endDate) : null}
                onChange={(date: Date | null) => setEndDate(date ? date.toISOString().slice(0, 16) : '')}
                slotProps={{ textField: { fullWidth: true, required: true, InputLabelProps: { shrink: true }, helperText: 'Dopo questa data le identità saranno rivelate' } }}
              />
            </LocalizationProvider>
          </Box>

          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>Come funziona:</strong> I commenti rimarranno anonimi fino alla data di fine.
            Dopo la scadenza, l'autore e l'orario di ogni commento verranno rivelati.
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
            {isLoading ? 'Creazione...' : 'Crea Thread'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateThreadModal;

