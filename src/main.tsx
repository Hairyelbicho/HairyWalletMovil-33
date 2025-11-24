// Polyfills PRIMERO - ANTES de cualquier import
import { Buffer } from 'buffer';

// Configurar Buffer globalmente
window.Buffer = window.Buffer || Buffer;
globalThis.Buffer = globalThis.Buffer || Buffer;

// Configurar global
window.global = window.global || window;
globalThis.global = globalThis.global || globalThis;

// AHORA sí, importar React y el resto
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
