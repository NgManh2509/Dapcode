import React from 'react';
import { X, Flame, Calendar, Award } from 'lucide-react';

export default function StreakModal({ isOpen, onClose, streakCount = 1 }) {
  if (!isOpen) return null;

  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const todayIdx = (new Date().getDay() + 6) % 7; // Monday = 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-sm rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#161722] p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Flame */}
        <div className="text-center mb-5">
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 shadow-md shadow-amber-500/10">
            <Flame className="h-8 w-8 text-amber-500 fill-amber-500/40 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
            {streakCount} <span className="text-sm font-sans font-medium text-amber-600 dark:text-amber-400">ngày liên tục</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
            Giải ít nhất 1 bài mỗi ngày để tích lũy kiến thức và duy trì phong độ phỏng vấn.
          </p>
        </div>

        {/* Weekly Calendar */}
        <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#111218] p-3 mb-4">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-zinc-400 mb-2.5">
            <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-500" />
            <span>Tuần này</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {daysOfWeek.map((day, idx) => {
              const isToday = idx === todayIdx;
              const isPast = idx < todayIdx;
              return (
                <div key={day} className="flex flex-col items-center space-y-1">
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500">{day}</span>
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-all ${
                      isToday
                        ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                        : isPast
                        ? 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-400'
                        : 'border border-dashed border-slate-200 dark:border-zinc-800 text-slate-300 dark:text-zinc-600'
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
        <div className="flex items-center space-x-3 rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-900/60 p-3 text-xs text-slate-700 dark:text-zinc-300">
          <Award className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">Mục tiêu tiếp theo: 7 ngày</div>
            <div className="text-[11px] text-slate-500 dark:text-zinc-500">Mở khóa huy hiệu &quot;Algorithm Apprentice&quot;</div>
          </div>
        </div>
      </div>
    </div>
  );
}

