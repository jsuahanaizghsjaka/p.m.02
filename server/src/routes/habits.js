/* Маршруты привычек (с отметками по дням и стриками).
   Все защищены requireAuth — пользователь видит только свои привычки. */

import { Router } from 'express';
import { prisma } from '../db.js';
import { requireAuth } from '../auth.js';

const router = Router();
router.use(requireAuth);

// дата в виде 'YYYY-MM-DD' (по локальному времени сервера)
function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// стрик: сколько дней подряд выполнено (если сегодня ещё нет — считаем со вчера)
function computeStreak(daysSet) {
  let streak = 0;
  const d = new Date();
  if (!daysSet.has(dayKey(d))) d.setDate(d.getDate() - 1);
  while (daysSet.has(dayKey(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

// приводим запись из БД к виду, удобному фронту
function shape(habit) {
  const days = new Set(habit.completions.map(c => c.day));
  return {
    id: habit.id,
    name: habit.name,
    doneToday: days.has(dayKey()),
    streak: computeStreak(days),
  };
}

// GET /api/habits — мои привычки (с doneToday и streak)
router.get('/', async (req, res) => {
  const habits = await prisma.habit.findMany({
    where: { userId: req.userId },
    orderBy: { id: 'asc' },
    include: { completions: true },
  });
  res.json(habits.map(shape));
});

// POST /api/habits — создать
router.post('/', async (req, res) => {
  const name = (req.body.name || '').trim();
  if (!name) return res.status(400).json({ error: 'Поле name обязательно' });
  const habit = await prisma.habit.create({
    data: { name, userId: req.userId },
    include: { completions: true },
  });
  res.status(201).json(shape(habit));
});

// PATCH /api/habits/:id/toggle — переключить отметку ЗА СЕГОДНЯ
router.patch('/:id/toggle', async (req, res) => {
  const id = Number(req.params.id);
  const habit = await prisma.habit.findFirst({ where: { id, userId: req.userId } });
  if (!habit) return res.status(404).json({ error: 'Привычка не найдена' });

  const day = dayKey();
  const existing = await prisma.completion.findUnique({
    where: { habitId_day: { habitId: id, day } },
  });
  if (existing) {
    await prisma.completion.delete({ where: { id: existing.id } });   // сняли отметку
  } else {
    await prisma.completion.create({ data: { habitId: id, day } });   // поставили отметку
  }

  const updated = await prisma.habit.findUnique({
    where: { id },
    include: { completions: true },
  });
  res.json(shape(updated));
});

// DELETE /api/habits/:id — удалить (вместе с отметками, благодаря onDelete: Cascade)
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const habit = await prisma.habit.findFirst({ where: { id, userId: req.userId } });
  if (!habit) return res.status(404).json({ error: 'Привычка не найдена' });
  await prisma.habit.delete({ where: { id } });
  res.status(204).end();
});

export default router;
