/* Авторизация через JWT (JSON Web Token).
   Токен — это «пропуск»: после входа сервер выдаёт его клиенту,
   а клиент прикладывает его к каждому запросу в заголовке Authorization. */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// создать токен, в котором «зашит» id пользователя (живёт 7 дней)
export function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

// middleware-«охранник»: пускает дальше только с валидным токеном.
// Если токен ок — кладёт id пользователя в req.userId.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Нужен вход в систему' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);  // проверяем подпись токена
    req.userId = payload.userId;
    next();                                          // пропускаем дальше
  } catch {
    return res.status(401).json({ error: 'Неверный или просроченный токен' });
  }
}
