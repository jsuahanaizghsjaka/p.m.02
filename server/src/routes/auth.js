/* Маршруты входа и регистрации.
   Пароль никогда не хранится в открытом виде — только его хеш (bcrypt). */

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../db.js';
import { signToken } from '../auth.js';

const router = Router();

// POST /api/auth/register — регистрация нового пользователя
router.post('/register', async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';

  if (!email || !password) return res.status(400).json({ error: 'Email и пароль обязательны' });
  if (password.length < 6) return res.status(400).json({ error: 'Пароль минимум 6 символов' });

  // email должен быть уникальным
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: 'Такой email уже зарегистрирован' });

  // хешируем пароль (10 — «стоимость», чем больше, тем медленнее перебор)
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hash } });

  const token = signToken(user.id);
  res.status(201).json({ token, user: { id: user.id, email: user.email } });
});

// POST /api/auth/login — вход
router.post('/login', async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';

  const user = await prisma.user.findUnique({ where: { email } });
  // одинаковый ответ и при неверном email, и при неверном пароле — чтобы не подсказывать злоумышленнику
  if (!user) return res.status(401).json({ error: 'Неверный email или пароль' });

  const ok = await bcrypt.compare(password, user.password);  // сверяем пароль с хешем
  if (!ok) return res.status(401).json({ error: 'Неверный email или пароль' });

  const token = signToken(user.id);
  res.json({ token, user: { id: user.id, email: user.email } });
});

export default router;
