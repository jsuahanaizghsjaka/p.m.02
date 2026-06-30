import { useEffect, useState } from 'react';
import {
  getHabits, addHabit, toggleHabit, deleteHabit,
  getToken, getUser, clearSession,
} from './api';
import AuthForm from './AuthForm';

export default function App() {
  // авторизация
  const [authed, setAuthed] = useState(!!getToken());  // есть ли токен в браузере
  const [user, setUser] = useState(getUser());

  // привычки
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // загрузка привычек (только если вошли)
  useEffect(() => {
    if (!authed) { setLoading(false); return; }
    setLoading(true);
    getHabits()
      .then(setHabits)
      .catch(err => {
        if (err.status === 401) logout();           // токен протух → на экран входа
        else setError('Не удалось загрузить привычки');
      })
      .finally(() => setLoading(false));
  }, [authed]);

  function handleAuth(u) { setUser(u); setAuthed(true); setError(''); }

  function logout() {
    clearSession();
    setUser(null);
    setAuthed(false);
    setHabits([]);
  }

  async function handleAdd(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      const created = await addHabit(trimmed);
      setHabits(prev => [...prev, created]);
      setName('');
    } catch (err) { err.status === 401 ? logout() : setError('Не удалось добавить'); }
  }

  async function handleToggle(id) {
    try {
      const updated = await toggleHabit(id);
      setHabits(prev => prev.map(h => (h.id === id ? updated : h)));
    } catch (err) { err.status === 401 ? logout() : setError('Не удалось обновить'); }
  }

  async function handleDelete(id) {
    try {
      await deleteHabit(id);
      setHabits(prev => prev.filter(h => h.id !== id));
    } catch (err) { err.status === 401 ? logout() : setError('Не удалось удалить'); }
  }

  // не вошли → показываем форму входа
  if (!authed) return <AuthForm onAuth={handleAuth} />;

  const doneCount = habits.filter(h => h.doneToday).length;

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>Трекер привычек</h1>
          <p className="muted">{user?.email} · выполнено {doneCount} из {habits.length}</p>
        </div>
        <button className="logout" onClick={logout}>Выход</button>
      </header>

      <form className="add" onSubmit={handleAdd}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Новая привычка…" />
        <button type="submit">Добавить</button>
      </form>

      {loading && <p className="muted">Загрузка…</p>}
      {error && <p className="error">{error}</p>}

      <ul className="list">
        {habits.map(h => (
          <li key={h.id} className={'item' + (h.doneToday ? ' done' : '')}>
            <span className="check" onClick={() => handleToggle(h.id)}>{h.doneToday ? '✓' : ''}</span>
            <span className="name" onClick={() => handleToggle(h.id)}>{h.name}</span>
            <span className="streak" title="дней подряд">🔥 {h.streak}</span>
            <button className="del" onClick={() => handleDelete(h.id)} title="Удалить">✕</button>
          </li>
        ))}
      </ul>

      {!loading && habits.length === 0 && (
        <p className="muted">Пока пусто — добавь первую привычку.</p>
      )}
    </div>
  );
}
