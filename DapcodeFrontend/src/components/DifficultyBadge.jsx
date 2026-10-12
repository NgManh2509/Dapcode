import React from 'react';

export default function DifficultyBadge({ difficulty = 'Easy', size = 'sm', variant = 'pill' }) {
  const diff = String(difficulty).toLowerCase();

  const config = {
    easy: { label: 'Easy', text: 'text-[#00B8A3]', pill: 'bg-[#00B8A3]/10' },
    medium: { label: 'Medium', text: 'text-[#FFB800]', pill: 'bg-[#FFB800]/10' },
    hard: { label: 'Hard', text: 'text-[#FF375F]', pill: 'bg-[#FF375F]/10' },
  }[diff] || {
    label: difficulty,
    text: 'text-neutral-500 dark:text-neutral-400',
    pill: 'bg-neutral-500/10',
  };

  if (variant === 'text') {
    return <span className={`text-sm font-normal ${config.text}`}>{config.label}</span>;
  }

  const sizeClasses = size === 'xs' ? 'text-xs px-2.5 py-0.5' : 'text-xs px-3 py-1';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses} ${config.text} ${config.pill}`}
    >
      {config.label}
    </span>
  );
}
