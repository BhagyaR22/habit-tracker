import React, { useMemo } from 'react';

const DAY_MS = 24 * 60 * 60 * 1000;

function lastNDays(n) {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i--) {
    days.push(new Date(today.getTime() - i * DAY_MS));
  }
  return days;
}

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function calculateCurrentStreak(habitId, logs) {
  const completedDates = new Set(
    logs
      .filter(log => log.habit_id === habitId && log.completed)
      .map(log => log.log_date)
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  while (true) {
    const dateString = today.toISOString().split("T")[0];

    if (!completedDates.has(dateString)) {
      break;
    }

    streak++;

    today.setDate(today.getDate() - 1);
  }

  return streak;
}

export default function HabitMatrix({ habits, logs, onToggle, onDelete }) {
  const days = useMemo(() => lastNDays(7), []);

  // logs: [{ habit_id, log_date, completed }]
  const completedSet = useMemo(() => {
    const set = new Set();
    logs.forEach((l) => {
      if (l.completed) set.add(`${l.habit_id}_${l.log_date}`);
    });
    return set;
  }, [logs]);

  if (habits.length === 0) {
    return (
      <p className="text-ink/60 text-sm py-8 text-center">
        No habits yet — add one above to start your matrix.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="text-left py-2 pr-3 font-medium text-ink/60">Habit</th>
            {days.map((d) => (
  <th key={toDateKey(d)} className="py-2 px-2 font-medium text-ink/60 text-center w-12">
    {d.toLocaleDateString(undefined, { weekday: 'short' })[0]}
  </th>
))}
<th className="py-2 px-3 font-medium text-ink/60 text-center">Progress</th>
<th className="py-2 px-3 font-medium text-ink/60 text-center">Streak</th>
<th className="w-8"></th>
          </tr>
        </thead>
        <tbody>
          {habits.map((habit) => {
  const streak = calculateCurrentStreak(habit.id, logs);

  return (
    <tr key={habit.id} className="border-t border-ink/10">
              <td className="py-3 pr-3">{habit.name}</td>
              {days.map((d) => {
                const key = toDateKey(d);
                const done = completedSet.has(`${habit.id}_${key}`);
                return (
                  <td key={key} className="text-center">
                    <button
                      onClick={() => onToggle(habit.id, key, !done)}
                      aria-label={`${habit.name} on ${key}`}
                      className={`w-6 h-6 rounded-md border transition-colors ${
                        done
                          ? 'bg-moss border-moss'
                          : 'bg-white border-ink/20 hover:border-moss'
                      }`}
                    />
                  </td>
                );
              })}
                            <td className="text-center">
                {Math.round(
                  (days.filter((d) =>
                    completedSet.has(`${habit.id}_${toDateKey(d)}`)
                  ).length / days.length) * 100
                )}%
              </td>

              <td className="text-center">
  🔥 {streak}
</td>

              <td className="text-center">
                <button
                  onClick={() => onDelete(habit.id)}
                  className="text-ink/30 hover:text-clay text-xs"
                  aria-label={`Delete ${habit.name}`}
                >
                  ✕
                </button>
              </td>
            </tr>
          );
          })}
        </tbody>
      </table>
    </div>
  );
}
