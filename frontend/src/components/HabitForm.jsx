import React, { useState } from 'react';

export default function HabitForm({ onAdd }) {
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await onAdd(name.trim());
      setName('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder="e.g. Read 20 minutes"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 border border-ink/20 dark:border-sage/30 rounded-md px-3 py-2 bg-white dark:bg-white/10 text-ink dark:text-cream placeholder:text-ink/40 dark:placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-moss"
      />

      <button
        type="submit"
        disabled={submitting}
        className="bg-ink dark:bg-moss text-cream rounded-md px-4 py-2 text-sm font-medium hover:bg-ink/90 dark:hover:bg-moss/90 transition-colors disabled:opacity-60"
      >
        Add habit
      </button>
    </form>
  );
}