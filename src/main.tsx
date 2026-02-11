import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { initializeStorage } from './mocks/storage';
import { worker } from './mocks/browser';

// Inizializza i dati seed nel localStorage
initializeStorage();

// Avvia Mock Service Worker in development
async function prepare() {
  if (import.meta.env.DEV) {
    return worker.start({
      onUnhandledRequest: 'bypass',
    });
  }
  return Promise.resolve();
}

prepare().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});

