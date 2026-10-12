import React from 'react';
import { Flame } from 'lucide-react';

export default function ProgressSidebar({ problems = [], completedSlugs = new Set() }) {
  const total = problems.length;
  const solved = problems.filter((p) => completedSlugs.has(p.slug)).length;

  const stat = (level) => {
    const list = problems.filter((p) => p.difficulty?.toLowerCase() === level);
    return { total: list.length, done: list.filter((p) => completedSlugs.has(p.slug)).length };
  };

  const rows = [
    { label: 'Easy', color: '#00B8A3', ...stat('easy') },
    { label: 'Med.', color: '#FFB800', ...stat('medium') },
    { label: 'Hard', color: '#FF375F', ...stat('hard') },
  ];

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (total ? solved / total : 0) * circumference;

  let streak = 0;
  try {
    const u = JSON.parse(localStorage.getItem('dapcode_user') || 'null');
    streak = u?.streakCount ?? u?.streak ?? 0;
  } catch {
    streak = 0;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-white dark:bg-[#282828] p-4">
        <div className="flex items-center gap-5">
          <div className="relative flex shrink-0 items-center justify-center">
            <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={radius} fill="none" strokeWidth="5" className="stroke-[#E6E6E6] dark:stroke-[#3E3E3E]" />
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                strokeWidth="5"
                strokeLinecap="round"
                stroke="#FFA116"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center leading-tight">
              <span className="text-2xl font-semibold text-[#262626] dark:text-[#EFF1F6]">{solved}</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">/ {total}</span>
              <span className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">Solved</span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            {rows.map((r) => (
              <div key={r.label} className="rounded-md bg-[#F7F8FA] dark:bg-[#333333] px-3 py-1.5">
                <div className="text-xs font-medium" style={{ color: r.color }}>
                  {r.label}
                </div>
                <div className="text-xs text-neutral-600 dark:text-neutral-300">
                  <span className="font-medium text-[#262626] dark:text-[#EFF1F6]">{r.done}</span>/{r.total}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-white dark:bg-[#282828] px-4 py-3">
        <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-300">
          <Flame className="h-5 w-5 text-[#FFA116]" />
          <span>Daily Streak</span>
        </div>
        <span className="text-sm font-semibold text-[#262626] dark:text-[#EFF1F6]">
          {streak} <span className="text-xs font-normal text-neutral-500">days</span>
        </span>
      </div>
    </div>
  );
}
