/* ============================================================
   Бэкенд-сервер (шаг 4: авторизация)
   index.js теперь только «собирает» приложение, а логика разнесена
   по файлам: routes/auth.js, routes/habits.js, auth.js, db.js.
   Запуск:  npm run dev
   ============================================================ */

import 'dotenv/config';      // переменные из .env (PORT, DATABASE_URL, JWT_SECRET)
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import habitsRouter from './routes/habits.js';

const app = express();
app.use(cors());
app.use(express.json());

// проверка, что сервер жив (без авторизации)
app.get('/api/health', (req, res) => res.json({ ok: true }));

// группы маршрутов
app.use('/api/auth', authRouter);       // /api/auth/register, /api/auth/login
app.use('/api/habits', habitsRouter);   // защищены входом

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API запущен: http://localhost:${PORT}`);
});
