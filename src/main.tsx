import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import 'katex/dist/katex.min.css';
import App from './App.tsx';
import './index.css';

// Filter out benign Vite HMR development server notices
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (
      event.reason &&
      (typeof event.reason === 'string' || event.reason.message) &&
      (String(event.reason).includes('WebSocket') || String(event.reason?.message).includes('WebSocket'))
    ) {
      // Prevent benign dev-server WebSocket noise from surfacing
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

