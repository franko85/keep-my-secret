import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Avvia Mock Service Worker se abilitato da configurazione
async function prepare() {
  if (import.meta.env.VITE_USE_MSW === 'true') {
    try {
      const { initializeStorage } = await import('./mocks/storage');
      const { worker } = await import('./mocks/browser');
      initializeStorage();
      // Path corretto per Aruba o sottocartella
      return worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: { url: '/keep-my-secret/mockServiceWorker.js' },
      });
    } catch (e) {
      // MSW non disponibile, ignora in produzione
      console.warn('MSW non disponibile:', e);
    }
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
