import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api.js';
import HabitForm from '../components/HabitForm.jsx';
import HabitMatrix from '../components/HabitMatrix.jsx';
import WeeklyProgress from '../components/WeeklyProgress.jsx';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [savedHabits, savedLogs] = await Promise.all([api.getHabits(), api.getLogs()]);
      setHabits(savedHabits);
      setLogs(savedLogs);
    } catch (err) {
      setError(err.message || 'Could not load your habits.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleAddHabit(name) {
    setError('');
    try {
      const habit = await api.createHabit({ name });
      setHabits((current) => [...current, habit]);
    } catch (err) {
      setError(err.message || 'Could not save the habit.');
      throw err;
    }
  }

  async function handleDeleteHabit(id) {
    setError('');
    try {
      await api.deleteHabit(id);
      setHabits((current) => current.filter((habit) => habit.id !== id));
      setLogs((current) => current.filter((log) => log.habit_id !== id));
    } catch (err) { setError(err.message || 'Could not delete the habit.'); }
  }

  async function handleToggle(habitId, dateKey, completed) {
    setError('');
    const previous = logs;
    setLogs((current) => [
      ...current.filter((log) => !(log.habit_id === habitId && log.log_date === dateKey)),
      ...(completed ? [{ habit_id: habitId, log_date: dateKey, completed: true }] : [])
    ]);
    try {
      await api.toggleLog({ habit_id: habitId, log_date: dateKey, completed });
    } catch (err) {
      setLogs(previous);
      setError(err.message || 'Could not save that completion.');
    }
  }

  return (
    <div className="min-h-screen px-4 py-10 max-w-3xl mx-auto text-ink dark:text-cream">
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl text-ink dark:text-cream">Your habits</h1>
          <p className="text-ink/60 dark:text-cream/60 text-sm">Hi {user?.name} — last 7 days</p>
        </div>
        <button onClick={logout} className="text-sm text-ink/60 dark:text-cream/60 hover:text-clay">Log out</button>
      </header>

      <div className="mb-6"><HabitForm onAdd={handleAddHabit} /></div>
      {error && <p role="alert" className="mb-4 text-sm text-clay">{error}</p>}
      {loading ? <p className="py-8 text-center text-ink/60 dark:text-cream/60">Loading your saved habits…</p> : <>
        {habits.length > 0 && <WeeklyProgress habits={habits} logs={logs} />}
        <HabitMatrix habits={habits} logs={logs} onToggle={handleToggle} onDelete={handleDeleteHabit} />
      </>}
    </div>
  );
}
