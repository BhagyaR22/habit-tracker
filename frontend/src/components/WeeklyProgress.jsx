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

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

export default function WeeklyProgress({ habits, logs }) {
  const weeklyData = useMemo(() => {
    const days = lastNDays(7);

    return days.map((day) => {
      const key = dateKey(day);

      const completed = habits.filter((habit) =>
        logs.some(
          (log) =>
            log.habit_id === habit.id &&
            log.log_date === key &&
            log.completed
        )
      ).length;

      const total = habits.length;

      const percentage =
        total === 0 ? 0 : Math.round((completed / total) * 100);

      return {
        date: key,
        day: day.toLocaleDateString('en-US', {
          weekday: 'short',
        }),
        completed,
        total,
        percentage,
      };
    });
  }, [habits, logs]);

  const totalActivities = habits.length * 7;

  const completedActivities = weeklyData.reduce(
    (sum, day) => sum + day.completed,
    0
  );

  const overallPercentage =
    totalActivities === 0
      ? 0
      : Math.round((completedActivities / totalActivities) * 100);

  return (
    <section className="mb-8 p-5 rounded-lg bg-white dark:bg-white/10 text-ink dark:text-cream transition-colors duration-300">
      <h2 className="text-xl mb-4">Weekly Progress</h2>

      <div className="flex flex-wrap items-center gap-8 mb-5">
        <div>
          <p className="text-sm text-ink/60 dark:text-cream/60">
            Completed
          </p>
          <p className="text-xl">{completedActivities}</p>
        </div>

        <div>
          <p className="text-sm text-ink/60 dark:text-cream/60">
            Activities
          </p>
          <p className="text-xl">{totalActivities}</p>
        </div>

        <div>
          <p className="text-sm text-ink/60 dark:text-cream/60">
            Progress
          </p>
          <p className="text-xl">{overallPercentage}%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {weeklyData.map((day) => (
          <div key={day.date}>
            <div className="flex justify-between text-xs mb-1">
              <span>{day.day}</span>
              <span>{day.percentage}%</span>
            </div>

            <div className="h-2 bg-ink/10 dark:bg-cream/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-clay rounded-full"
                style={{ width: `${day.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}