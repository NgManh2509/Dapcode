import React from 'react';
import { X, Flame, Calendar, Award } from 'lucide-react';

export default function StreakModal({ isOpen, onClose, streakCount = 1 }) {
  if (!isOpen) return null;

  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const todayIdx = (new Date().getDay() + 6) % 7; // Monday = 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-sm rounded-2xl border border-[#E8E4DC] dark:border-[#332F2B] bg-[#FFFFFF] dark:bg-[#1C1A18] p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-stone-400 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-[#FAF8F3] dark:hover:bg-[#24221F] transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Flame */}
        <div className="text-center mb-5">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAF8F3] dark:bg-[#24221F] border border-[#E8E4DC] dark:border-[#332F2B]">
            <Flame className="h-6 w-6 text-[#B45309] dark:text-[#FBBF24]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#1C1917] dark:text-[#F5F2EB] tracking-tight">
            {streakCount} <span className="text-sm font-sans font-medium text-[#B45309] dark:text-[#FBBF24]">ngày liên tục</span>
          </div>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
            Giải ít nhất 1 bài mỗi ngày để tích lũy kiến thức và duy trì phong độ phỏng vấn.
          </p>
        </div>

        {/* Weekly Calendar */}
        <div className="rounded-xl border border-[#E8E4DC] dark:border-[#332F2B] bg-[#FAF8F3] dark:bg-[#24221F] p-3.5 mb-4">
          <div className="flex items-center space-x-1.5 text-xs text-stone-500 dark:text-stone-400 mb-2.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>Tuần này</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {daysOfWeek.map((day, idx) => {
              const isToday = idx === todayIdx;
              const isPast = idx < todayIdx;
              return (
                <div key={day} className="flex flex-col items-center space-y-1">
                  <span className="text-[10px] text-stone-400 dark:text-stone-500">{day}</span>
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-medium font-mono transition-colors ${
                      isToday
                        ? 'bg-[#1C1917] text-white dark:bg-[#F5F2EB] dark:text-[#1C1917]'
                        : isPast
                        ? 'bg-white dark:bg-[#1C1A18] border border-[#E8E4DC] dark:border-[#332F2B] text-stone-700 dark:text-stone-300'
                        : 'border border-dashed border-[#E8E4DC] dark:border-[#332F2B] text-stone-300 dark:text-stone-600'
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
        <div className="flex items-center space-x-3 rounded-xl border border-[#E8E4DC] dark:border-[#332F2B] bg-[#FAF8F3] dark:bg-[#24221F] p-3 text-xs text-stone-700 dark:text-stone-300">
          <Award className="h-5 w-5 text-stone-700 dark:text-stone-300 flex-shrink-0" />
          <div>
            <div className="font-semibold text-[#1C1917] dark:text-[#F5F2EB]">Mục tiêu tiếp theo: 7 ngày</div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400">Mở khóa huy hiệu &quot;Algorithm Apprentice&quot;</div>
          </div>
        </div>
      </div>
    </div>
  );
}
