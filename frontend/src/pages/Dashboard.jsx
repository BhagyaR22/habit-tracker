import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import HabitForm from "../components/HabitForm.jsx";
import HabitMatrix from "../components/HabitMatrix.jsx";
import WeeklyProgress from "../components/WeeklyProgress.jsx";

// Preview-only mock data so the UI renders without a backend running.
// Swap this back to loading from `api.js` once the Express/MySQL backend
// is ready — see the previous version of this file (git history / README)
// for the fetch-based version with loading/error states.
function todayKey(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().slice(0, 10);
}

const initialHabits = [
  { id: 1, name: 'Read 20 minutes' },
  { id: 2, name: 'Workout' },
  { id: 3, name: 'Drink 2L water' }
];

const initialLogs = [
  { habit_id: 1, log_date: todayKey(0), completed: true },
  { habit_id: 1, log_date: todayKey(1), completed: true },
  { habit_id: 2, log_date: todayKey(1), completed: true },
  { habit_id: 2, log_date: todayKey(3), completed: true },
  { habit_id: 3, log_date: todayKey(0), completed: true },
  { habit_id: 3, log_date: todayKey(2), completed: true }
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [habits, setHabits] = useState(initialHabits);
  const [logs, setLogs] = useState(initialLogs);
  const [nextId, setNextId] = useState(4);

  function handleAddHabit(name) {
    setHabits((prev) => [...prev, { id: nextId, name }]);
    setNextId((id) => id + 1);
  }

  function handleDeleteHabit(id) {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setLogs((prev) => prev.filter((l) => l.habit_id !== id));
  }

  function handleToggle(habitId, dateKey, completed) {
    setLogs((prev) => {
      const others = prev.filter((l) => !(l.habit_id === habitId && l.log_date === dateKey));
      return [...others, { habit_id: habitId, log_date: dateKey, completed }];
    });
  }

  return (
    <div className="min-h-screen px-4 py-10 max-w-3xl mx-auto text-ink dark:text-cream">
  <header className="flex items-center justify-between mb-10">
    <div>
      <h1 className="text-3xl text-ink dark:text-cream">
        Your habits
      </h1>

      <p className="text-ink/60 dark:text-cream/60 text-sm">
        Hi {user?.name} — last 7 days (habit data is still sample data)
      </p>
    </div>

    <button
      onClick={logout}
      className="text-sm text-ink/60 dark:text-cream/60 hover:text-clay"
    >
      Log out
    </button>
  </header>

      <div className="mb-6">
        <HabitForm onAdd={handleAddHabit} />
      </div>

      {habits.length > 0 && (
  <WeeklyProgress
    habits={habits}
    logs={logs}
  />
)}

      <HabitMatrix
        habits={habits}
        logs={logs}
        onToggle={handleToggle}
        onDelete={handleDeleteHabit}
      />
    </div>
  );
}

function computeCompletionRate(habits, logs) {
  const total = habits.length * 7;
  const done = logs.filter((l) => l.completed).length;
  if (total === 0) return 0;
  return Math.round((done / total) * 100);
}
