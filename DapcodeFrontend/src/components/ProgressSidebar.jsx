import React from 'react';
import { Flame, Trophy, Zap, Sparkles } from 'lucide-react';

export default function ProgressSidebar({ problems = [], completedSlugs = new Set() }) {
  const total = problems.length || 1;
  const completedCount = problems.filter(p => completedSlugs.has(p.slug)).length;
  const percent = Math.round((completedCount / total) * 100);

  const easyTotal = problems.filter(p => p.difficulty?.toLowerCase() === 'easy').length;
  const easyCompleted = problems.filter(p => p.difficulty?.toLowerCase() === 'easy' && completedSlugs.has(p.slug)).length;

  const mediumTotal = problems.filter(p => p.difficulty?.toLowerCase() === 'medium').length;
  const mediumCompleted = problems.filter(p => p.difficulty?.toLowerCase() === 'medium' && completedSlugs.has(p.slug)).length;

  const hardTotal = problems.filter(p => p.difficulty?.toLowerCase() === 'hard').length;
  const hardCompleted = problems.filter(p => p.difficulty?.toLowerCase() === 'hard' && completedSlugs.has(p.slug)).length;

  // Circular progress calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="space-y-4">
      {/* Roadmap Progress Card */}
      <div className="rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-[#16171d] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span>Tiến độ Dapcode 150</span>
          </h3>
          <span className="text-xs font-mono text-indigo-700 bg-indigo-50 border border-indigo-200 dark:text-indigo-400 dark:bg-indigo-500/10 px-2 py-0.5 rounded dark:border-indigo-500/20">
            {percent}%
          </span>
        </div>

        <div className="flex items-center justify-between py-2">
          {/* Circular Gauge */}
          <div className="relative flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="text-slate-100 dark:text-zinc-800"
                strokeWidth="7"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="text-indigo-600 dark:text-indigo-500 transition-all duration-700 ease-out"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">{completedCount}</span>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">/ {total}</span>
            </div>
          </div>

          {/* Difficulty breakdown */}
          <div className="space-y-2.5 flex-1 pl-5">
            {/* Easy */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Easy</span>
                <span className="text-slate-500 dark:text-zinc-400 font-mono">{easyCompleted}/{easyTotal}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${easyTotal ? (easyCompleted / easyTotal) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Medium */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-600 dark:text-amber-400 font-medium">Medium</span>
                <span className="text-slate-500 dark:text-zinc-400 font-mono">{mediumCompleted}/{mediumTotal}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${mediumTotal ? (mediumCompleted / mediumTotal) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Hard */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-rose-600 dark:text-rose-400 font-medium">Hard</span>
                <span className="text-slate-500 dark:text-zinc-400 font-mono">{hardCompleted}/{hardTotal}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-300"
                  style={{ width: `${hardTotal ? (hardCompleted / hardTotal) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Socratic AI Tutor Spotlight Card */}
      <div className="rounded-xl border border-indigo-200 dark:border-indigo-500/20 bg-indigo-50/50 dark:bg-gradient-to-b dark:from-indigo-950/30 dark:to-[#16171d] p-4 text-xs text-slate-700 dark:text-zinc-300 shadow-xs">
        <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-400 font-semibold mb-1.5">
          <Sparkles className="h-4 w-4" />
          <span>Socratic AI Tutor</span>
        </div>
        <p className="text-slate-600 dark:text-zinc-400 leading-relaxed mb-3">
          Không bao giờ cung cấp lời giải toàn bộ trực tiếp — AI Tutor hướng dẫn bạn qua tư duy gợi mở (Level 1) hoặc mã giả cấu trúc (Level 2).
        </p>
        <div className="inline-flex items-center space-x-1.5 text-indigo-700 dark:text-indigo-400 font-medium bg-indigo-100/70 dark:bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-200 dark:border-indigo-500/20">
          <Zap className="h-3.5 w-3.5" />
          <span>Hỗ trợ mọi bài tập trong Workspace</span>
        </div>
      </div>

      {/* Daily Streak Card */}
      <div className="rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-[#16171d] p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
            <Flame className="h-5 w-5 text-amber-500 fill-amber-500/40" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">Daily Streak</div>
            <div className="text-xs text-slate-500 dark:text-zinc-400">Giải 1 bài mỗi ngày để giữ lửa</div>
          </div>
        </div>
        <div className="text-lg font-mono font-bold text-amber-600 dark:text-amber-400">
          0 <span className="text-xs font-normal text-slate-400 dark:text-zinc-500">ngày</span>
        </div>
      </div>
    </div>
  );
}

