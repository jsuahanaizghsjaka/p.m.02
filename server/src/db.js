// Единственный экземпляр PrismaClient на всё приложение.
// Через него делаем запросы к базе: prisma.habit.findMany(), .create() и т.д.
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
