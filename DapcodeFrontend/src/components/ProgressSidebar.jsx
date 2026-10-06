import React from 'react';
import { Flame, Trophy, Zap, Sparkles } from 'lucide-react';

export default function ProgressSidebar({ problems = [], completedSlugs = new Set() }) {
  const total = problems.length || 1;
  const completedCount = problems.filter((p) => completedSlugs.has(p.slug)).length;
  const percent = Math.round((completedCount / total) * 100);

  const easyTotal = problems.filter((p) => p.difficulty?.toLowerCase() === 'easy').length;
  const easyCompleted = problems.filter((p) => p.difficulty?.toLowerCase() === 'easy' && completedSlugs.has(p.slug)).length;

  const mediumTotal = problems.filter((p) => p.difficulty?.toLowerCase() === 'medium').length;
  const mediumCompleted = problems.filter((p) => p.difficulty?.toLowerCase() === 'medium' && completedSlugs.has(p.slug)).length;

  const hardTotal = problems.filter((p) => p.difficulty?.toLowerCase() === 'hard').length;
  const hardCompleted = problems.filter((p) => p.difficulty?.toLowerCase() === 'hard' && completedSlugs.has(p.slug)).length;

  // Circular progress calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="space-y-4">
      {/* Roadmap Progress Card */}
      <div className="rounded-xl border border-[#E8E4DC] dark:border-[#332F2B] bg-[#FFFFFF] dark:bg-[#1C1A18] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-[#1C1917] dark:text-[#F5F2EB] tracking-tight flex items-center space-x-2">
            <Trophy className="h-4 w-4 text-[#B45309] dark:text-[#FBBF24]" />
            <span>Tiến độ Dapcode 150</span>
          </h3>
          <span className="text-[11px] font-mono text-stone-700 dark:text-stone-300 bg-[#FAF8F3] dark:bg-[#24221F] border border-[#E8E4DC] dark:border-[#332F2B] px-2 py-0.5 rounded-md">
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
                className="stroke-[#E8E4DC] dark:stroke-[#332F2B]"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-[#1C1917] dark:stroke-[#F5F2EB] transition-all duration-700 ease-out"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-lg font-bold font-mono text-[#1C1917] dark:text-[#F5F2EB]">{completedCount}</span>
              <span className="text-[10px] text-stone-400 dark:text-stone-500 font-mono">/ {total}</span>
            </div>
          </div>

          {/* Difficulty breakdown */}
          <div className="space-y-2.5 flex-1 pl-5">
            {/* Easy */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#15803D] dark:text-[#4ADE80] font-medium text-[11px]">Easy</span>
                <span className="text-stone-500 dark:text-stone-400 font-mono text-[11px]">{easyCompleted}/{easyTotal}</span>
              </div>
              <div className="w-full h-1.5 bg-[#FAF8F3] dark:bg-[#24221F] border border-[#E8E4DC] dark:border-[#332F2B] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#15803D] dark:bg-[#4ADE80] rounded-full transition-all duration-300"
                  style={{ width: `${easyTotal ? (easyCompleted / easyTotal) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Medium */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#B45309] dark:text-[#FBBF24] font-medium text-[11px]">Medium</span>
                <span className="text-stone-500 dark:text-stone-400 font-mono text-[11px]">{mediumCompleted}/{mediumTotal}</span>
              </div>
              <div className="w-full h-1.5 bg-[#FAF8F3] dark:bg-[#24221F] border border-[#E8E4DC] dark:border-[#332F2B] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#B45309] dark:bg-[#FBBF24] rounded-full transition-all duration-300"
                  style={{ width: `${mediumTotal ? (mediumCompleted / mediumTotal) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Hard */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#B91C1C] dark:text-[#F87171] font-medium text-[11px]">Hard</span>
                <span className="text-stone-500 dark:text-stone-400 font-mono text-[11px]">{hardCompleted}/{hardTotal}</span>
              </div>
              <div className="w-full h-1.5 bg-[#FAF8F3] dark:bg-[#24221F] border border-[#E8E4DC] dark:border-[#332F2B] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#B91C1C] dark:bg-[#F87171] rounded-full transition-all duration-300"
                  style={{ width: `${hardTotal ? (hardCompleted / hardTotal) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Socratic AI Tutor Spotlight Card */}
      <div className="rounded-xl border border-[#E8E4DC] dark:border-[#332F2B] bg-[#FAF8F3] dark:bg-[#24221F] p-4 text-xs text-stone-700 dark:text-stone-300">
        <div className="flex items-center space-x-1.5 text-[#1C1917] dark:text-[#F5F2EB] font-semibold mb-1.5">
          <Sparkles className="h-4 w-4" />
          <span>Socratic AI Tutor</span>
        </div>
        <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-3 text-[11px]">
          Không bao giờ cung cấp lời giải toàn bộ trực tiếp — AI Tutor định hướng qua gợi ý tư duy (Level 1) hoặc mã giả cấu trúc (Level 2).
        </p>
        <div className="inline-flex items-center space-x-1.5 text-stone-800 dark:text-stone-200 font-medium bg-white dark:bg-[#1C1A18] px-2.5 py-1 rounded-lg border border-[#E8E4DC] dark:border-[#332F2B] text-[11px]">
          <Zap className="h-3.5 w-3.5" />
          <span>Hỗ trợ mọi bài tập trong Workspace</span>
        </div>
      </div>

      {/* Daily Streak Card */}
      <div className="rounded-xl border border-[#E8E4DC] dark:border-[#332F2B] bg-[#FFFFFF] dark:bg-[#1C1A18] p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FAF8F3] dark:bg-[#24221F] border border-[#E8E4DC] dark:border-[#332F2B]">
            <Flame className="h-4.5 w-4.5 text-[#B45309] dark:text-[#FBBF24]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#1C1917] dark:text-[#F5F2EB]">Daily Streak</div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400">Giải 1 bài mỗi ngày để giữ lửa</div>
          </div>
        </div>
        <div className="text-base font-mono font-bold text-[#B45309] dark:text-[#FBBF24]">
          1 <span className="text-[10px] font-normal text-stone-400">ngày</span>
        </div>
      </div>
    </div>
  );
}
