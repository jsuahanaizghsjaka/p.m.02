# Habit Tracker

<!-- Бейдж Code Climate подключим на шаге деплоя (нужен для оценки «4/5»):
[![Maintainability](https://api.codeclimate.com/...)](https://codeclimate.com/...) -->

Веб-приложение для отслеживания привычек. Пользователь регистрируется, заводит
свои привычки, каждый день отмечает выполненные и видит «стрик» — сколько дней
подряд держится. У каждого пользователя свои данные (доступ по токену).

Доработка пет-проекта [Todo List App](https://github.com/dwyl/javascript-todo-list-tutorial)
из каталога: добавлены авторизация, серверная часть с базой данных, отметки по
дням и стрики.

## Стек

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **База данных:** SQLite (через Prisma ORM); на деплое — PostgreSQL
- **Авторизация:** JWT + bcrypt

## Запуск локально

Нужны два терминала.

**1. Бэкенд:**
```bash
cd server
npm install
cp .env.example .env          # создать файл окружения
npx prisma migrate dev        # создать базу и таблицы
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

Ссылка появится после публикации: _(скоро)_

## Структура

```
server/   — Express API, Prisma (схема БД + миграции), авторизация
client/   — React-приложение (Vite)
```
