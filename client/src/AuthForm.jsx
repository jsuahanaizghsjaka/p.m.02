import { useState } from 'react';
import { register, login, saveSession } from './api';

// Экран входа/регистрации. После успеха зовёт onAuth(user).
export default function AuthForm({ onAuth }) {
  const [mode, setMode] = useState('login');   // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const fn = mode === 'login' ? login : register;
      const data = await fn(email.trim().toLowerCase(), password);
      saveSession(data.token, data.user);   // сохраняем токен в браузере
      onAuth(data.user);                     // сообщаем App, что вошли
    } catch (err) {
      setError(err.message);                 // показываем ответ сервера (напр. «Неверный email или пароль»)
    } finally {
      setBusy(false);
    }
  }

  function switchMode(m) { setMode(m); setError(''); }

  return (
    <div className="auth">
      <h1>Трекер привычек</h1>
      <p className="muted">Войди, чтобы вести свои привычки</p>

      <div className="auth-tabs">
        <button className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>Вход</button>
        <button className={mode === 'register' ? 'active' : ''} onClick={() => switchMode('register')}>Регистрация</button>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="email" placeholder="Email" autoComplete="email"
          value={email} onChange={e => setEmail(e.target.value)} required
        />
        <input
          type="password" placeholder="Пароль (минимум 6 символов)" autoComplete="current-password"
          value={password} onChange={e => setPassword(e.target.value)} required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" className="primary" disabled={busy}>
          {busy ? 'Подождите…' : (mode === 'login' ? 'Войти' : 'Создать аккаунт')}
        </button>
      </form>
    </div>
  );
}
