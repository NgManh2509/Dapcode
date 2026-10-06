import React from 'react';

export default function DifficultyBadge({ difficulty = 'Easy', size = 'sm' }) {
  const diff = String(difficulty).toLowerCase();

  const config = {
    easy: {
      label: 'Easy',
      classes: 'text-[#15803D] bg-[#F0FDF4] border-[#BBF7D0] dark:text-[#4ADE80] dark:bg-[#14532D]/20 dark:border-[#166534]/50',
    },
    medium: {
      label: 'Medium',
      classes: 'text-[#B45309] bg-[#FFFBEB] border-[#FDE68A] dark:text-[#FBBF24] dark:bg-[#78350F]/20 dark:border-[#92400E]/50',
    },
    hard: {
      label: 'Hard',
      classes: 'text-[#B91C1C] bg-[#FEF2F2] border-[#FECACA] dark:text-[#F87171] dark:bg-[#7F1D1D]/20 dark:border-[#991B1B]/50',
    },
  }[diff] || {
    label: difficulty,
    classes: 'text-stone-700 bg-stone-100 border-stone-200 dark:text-stone-300 dark:bg-stone-800 dark:border-stone-700',
  };

  const sizeClasses = size === 'xs' 
    ? 'text-[11px] px-2 py-0.5' 
    : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border tracking-tight ${sizeClasses} ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
