import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Конфиг сборщика Vite. Подключаем плагин React (JSX и быстрый hot-reload).
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, host: true },   // host:true — слушать все интерфейсы (нужно для превью)
});
