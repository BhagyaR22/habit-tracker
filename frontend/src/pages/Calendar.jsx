import React, { useState } from "react";

function todayKey(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().slice(0, 10);
}

// Temporary sample data
const habits = [
  { id: 1, name: "Read 20 minutes" },
  { id: 2, name: "Workout" },
  { id: 3, name: "Drink 2L water" },
];

const logs = [
  { habit_id: 1, log_date: todayKey(0), completed: true },
  { habit_id: 1, log_date: todayKey(1), completed: true },
  { habit_id: 2, log_date: todayKey(1), completed: true },
  { habit_id: 2, log_date: todayKey(3), completed: true },
  { habit_id: 3, log_date: todayKey(0), completed: true },
  { habit_id: 3, log_date: todayKey(2), completed: true },
];

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function getActivityCount(dateKey) {
  return logs.filter(
    (log) => log.log_date === dateKey && log.completed
  ).length;
}

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Convert Sunday-based index to Monday-based index
  const startingDay = firstDay === 0 ? 6 : firstDay - 1;

  const days = [];

  for (let i = 0; i < startingDay; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  function goToPreviousMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function goToNextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  return (
    <div className="min-h-screen px-4 py-10 max-w-4xl mx-auto text-ink dark:text-cream">

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl">Monthly Activity</h1>

        <p className="text-ink/60 dark:text-cream/60 text-sm mt-1">
          Track your habit activity throughout the month.
        </p>
      </header>

      {/* Calendar Card */}
      <div className="border border-ink/10 dark:border-cream/10 rounded-xl p-5">

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">

          <button
            onClick={goToPreviousMonth}
            className="w-9 h-9 rounded-lg border border-ink/10 dark:border-cream/10 hover:border-moss transition-colors"
          >
            ←
          </button>

          <h2 className="text-xl font-medium">
            {monthName} {year}
          </h2>

          <button
            onClick={goToNextMonth}
            className="w-9 h-9 rounded-lg border border-ink/10 dark:border-cream/10 hover:border-moss transition-colors"
          >
            →
          </button>

        </div>

        {/* Weekday Names */}
        <div className="grid grid-cols-7 mb-2">

          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
            (day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-ink/60 dark:text-cream/60 py-2"
              >
                {day}
              </div>
            )
          )}

        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">

          {days.map((day, index) => {

            if (day === null) {
              return (
                <div
                  key={index}
                  className="min-h-24 border border-ink/5 dark:border-cream/5"
                />
              );
            }

            const date = new Date(year, month, day);
            const dateKey = toDateKey(date);
            const activityCount = getActivityCount(dateKey);

            const isToday =
              dateKey === toDateKey(new Date());

            return (
              <div
                key={dateKey}
                className={`min-h-24 border border-ink/5 dark:border-cream/5 p-2 ${
                  isToday ? "bg-moss/10 dark:bg-moss/20" : ""
                }`}
              >

                <div
                  className={`text-sm ${
                    isToday
                      ? "font-semibold text-moss"
                      : "text-ink dark:text-cream"
                  }`}
                >
                  {day}
                </div>

                {/* Activity indicator */}
                <div className="mt-3 flex justify-center">

                  {activityCount > 0 ? (
                    <div className="flex items-center gap-1">

                      {Array.from(
                        { length: activityCount },
                        (_, i) => (
                          <span
                            key={i}
                            className="w-2 h-2 rounded-full bg-moss"
                          />
                        )
                      )}

                    </div>
                  ) : (
                    <span className="text-ink/20 dark:text-cream/20 text-xs">
                      —
                    </span>
                  )}

                </div>

              </div>
            );
          })}

        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 mt-6 text-sm text-ink/60 dark:text-cream/60">

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-moss" />
            Completed activity
          </div>

          <div>
            — No activity
          </div>

        </div>

      </div>
    </div>
  );
}

export default Calendar;