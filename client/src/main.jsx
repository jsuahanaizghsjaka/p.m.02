import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

// Находим div#root в index.html и рендерим в него наше приложение
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
