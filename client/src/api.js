/* Общение с бэкендом + хранение сессии (токен) в localStorage. */

// Адрес API: на деплое задаётся переменной VITE_API_URL (см. README),
// локально по умолчанию — наш сервер на :4000
const API = (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api';

// --- сессия (токен и пользователь хранятся в браузере) ---
export function getToken() { return localStorage.getItem('token'); }
export function getUser() {
  try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
}
export function saveSession(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}
export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// универсальный помощник: добавляет заголовки, токен и разбирает ответ
async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (res.status === 204) return null;            // нет тела (например, после удаления)

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || 'Ошибка запроса');
    err.status = res.status;                      // пробрасываем код, чтобы App мог отличить 401
    throw err;
  }
  return data;
}

// --- авторизация ---
export function register(email, password) {
  return request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) });
}
export function login(email, password) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

// --- привычки (токен подставляется автоматически) ---
export function getHabits() { return request('/habits'); }
export function addHabit(name) { return request('/habits', { method: 'POST', body: JSON.stringify({ name }) }); }
export function toggleHabit(id) { return request(`/habits/${id}/toggle`, { method: 'PATCH' }); }
export function deleteHabit(id) { return request(`/habits/${id}`, { method: 'DELETE' }); }
