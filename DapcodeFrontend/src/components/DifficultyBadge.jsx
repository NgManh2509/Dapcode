import React from 'react';

export default function DifficultyBadge({ difficulty = 'Easy', size = 'sm' }) {
  const diff = String(difficulty).toLowerCase();

  const config = {
    easy: {
      label: 'Easy',
      classes: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20 font-medium',
    },
    medium: {
      label: 'Medium',
      classes: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20 font-medium',
    },
    hard: {
      label: 'Hard',
      classes: 'text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/20 font-medium',
    },
  }[diff] || {
    label: difficulty,
    classes: 'text-slate-600 bg-slate-100 border-slate-200 dark:text-zinc-400 dark:bg-zinc-500/10 dark:border-zinc-500/20 font-medium',
  };

  const sizeClasses = size === 'xs' 
    ? 'text-xs px-2 py-0.5' 
    : 'text-xs px-2.5 py-1 font-medium';

  return (
    <span
      className={`inline-flex items-center rounded-md border tracking-wide ${sizeClasses} ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
