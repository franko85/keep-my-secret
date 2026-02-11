import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Configura il service worker MSW per il browser
export const worker = setupWorker(...handlers);

