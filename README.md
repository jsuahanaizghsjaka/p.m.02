# Habit Tracker

[![Maintainability](https://qlty.sh/gh/jsuahanaizghsjaka/projects/p.m.02/maintainability.svg)](https://qlty.sh/gh/jsuahanaizghsjaka/projects/p.m.02)

> Бейдж — Qlty (новое название Code Climate Quality; codeclimate.com перенаправляет на qlty.sh).

Веб-приложение для отслеживания привычек. Пользователь регистрируется, заводит
свои привычки, каждый день отмечает выполненные и видит «стрик» — сколько дней
подряд держится. У каждого пользователя свои данные (доступ по токену).

Доработка пет-проекта [Todo List App](https://github.com/dwyl/javascript-todo-list-tutorial)
из каталога: добавлены авторизация, серверная часть с базой данных, отметки по
дням и стрики.

## Стек

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **База данных:** PostgreSQL (через Prisma ORM)
- **Авторизация:** JWT + bcrypt

## Запуск локально

Нужны два терминала.

**1. Бэкенд:**
```bash
cd server
npm install
cp .env.example .env          # создать файл окружения
# в .env вписать DATABASE_URL своей PostgreSQL (подойдёт бесплатная на neon.tech)
npx prisma migrate dev        # создать таблицы в базе
npm run dev                   # http://localhost:4000
```

**2. Фронтенд:**
```bash
cd client
npm install
npm run dev                   # http://localhost:5173
```

Открыть в браузере http://localhost:5173.

## Деплой

- **Сайт:** https://habit-tracker-7h5j.onrender.com
- **API:** https://habit-tracker-api-ebr5.onrender.com (проверка: [/api/health](https://habit-tracker-api-ebr5.onrender.com/api/health))
- **База данных:** PostgreSQL (Neon, Франкфурт)

**Тестовый доступ:** `demo@mail.ru` / `demo123456`

> ⏳ Бесплатный тариф Render «усыпляет» сервер после 15 минут простоя —
> первый запрос может занять 30–60 секунд. Дальше всё работает быстро.

## Структура

```
server/   — Express API, Prisma (схема БД + миграции), авторизация
client/   — React-приложение (Vite)
```
