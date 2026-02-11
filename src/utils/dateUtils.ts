import { formatDistanceToNow, format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';

/**
 * Converte una data in formato ISO UTC
 */
export const toISOUTC = (date: Date): string => {
  return date.toISOString();
};

/**
 * Verifica se un thread è scaduto
 */
export const isThreadExpired = (endDate: string): boolean => {
  return new Date() >= new Date(endDate);
};

/**
 * Verifica se un thread è attivo (tra startDate e endDate)
 */
export const isThreadActive = (startDate: string, endDate: string): boolean => {
  const now = new Date();
  return now >= new Date(startDate) && now < new Date(endDate);
};

/**
 * Formatta il countdown alla scadenza
 */
export const formatCountdown = (endDate: string): string => {
  const end = parseISO(endDate);
  const now = new Date();

  if (now >= end) {
    return 'Scaduto';
  }

  return `Scade ${formatDistanceToNow(end, { addSuffix: true, locale: it })}`;
};

/**
 * Formatta una data per visualizzazione
 */
export const formatDate = (dateString: string): string => {
  return format(parseISO(dateString), 'dd/MM/yyyy HH:mm', { locale: it });
};

/**
 * Formatta solo l'ora
 */
export const formatTime = (dateString: string): string => {
  return format(parseISO(dateString), 'HH:mm', { locale: it });
};

/**
 * Converte datetime-local input value in ISO UTC
 */
export const datetimeLocalToISO = (value: string): string => {
  return new Date(value).toISOString();
};

/**
 * Converte ISO UTC in datetime-local input value
 */
export const isoToDatetimeLocal = (isoString: string): string => {
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
};

