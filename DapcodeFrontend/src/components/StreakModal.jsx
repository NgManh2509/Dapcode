import React from 'react';
import { X, Flame, Calendar, Award } from 'lucide-react';

export default function StreakModal({ isOpen, onClose, streakCount = 1 }) {
  if (!isOpen) return null;

  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const todayIdx = (new Date().getDay() + 6) % 7; // Monday = 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-sm rounded-2xl border border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#FFFFFF] dark:bg-[#282828] p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-neutral-400 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-[#F7F8FA] dark:hover:bg-[#333333] transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Flame */}
        <div className="text-center mb-5">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7F8FA] dark:bg-[#333333] border border-[#E6E6E6] dark:border-[#3E3E3E]">
            <Flame className="h-6 w-6 text-[#FFA116] dark:text-[#FFC01E]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#262626] dark:text-[#EFF1F6] tracking-tight">
            {streakCount} <span className="text-sm font-sans font-medium text-[#FFA116] dark:text-[#FFC01E]">ngày liên tục</span>
          </div>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Giải ít nhất 1 bài mỗi ngày để tích lũy kiến thức và duy trì phong độ phỏng vấn.
          </p>
        </div>

        {/* Weekly Calendar */}
        <div className="rounded-xl border border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#F7F8FA] dark:bg-[#333333] p-3.5 mb-4">
          <div className="flex items-center space-x-1.5 text-xs text-neutral-500 dark:text-neutral-400 mb-2.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>Tuần này</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {daysOfWeek.map((day, idx) => {
              const isToday = idx === todayIdx;
              const isPast = idx < todayIdx;
              return (
                <div key={day} className="flex flex-col items-center space-y-1">
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500">{day}</span>
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-medium font-mono transition-colors ${
                      isToday
                        ? 'bg-[#262626] text-white dark:bg-[#EFF1F6] dark:text-[#262626]'
                        : isPast
                        ? 'bg-white dark:bg-[#282828] border border-[#E6E6E6] dark:border-[#3E3E3E] text-neutral-700 dark:text-neutral-300'
                        : 'border border-dashed border-[#E6E6E6] dark:border-[#3E3E3E] text-neutral-300 dark:text-neutral-600'
                    }`}
                  >
                    {isToday ? '🔥' : isPast ? '✓' : '•'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestone badge */}
        <div className="flex items-center space-x-3 rounded-xl border border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#F7F8FA] dark:bg-[#333333] p-3 text-xs text-neutral-700 dark:text-neutral-300">
          <Award className="h-5 w-5 text-neutral-700 dark:text-neutral-300 flex-shrink-0" />
          <div>
            <div className="font-semibold text-[#262626] dark:text-[#EFF1F6]">Mục tiêu tiếp theo: 7 ngày</div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Mở khóa huy hiệu &quot;Algorithm Apprentice&quot;</div>
          </div>
        </div>
      </div>
    </div>
  );
}
