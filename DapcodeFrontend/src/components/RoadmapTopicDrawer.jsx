import React from 'react';
import { Link } from 'react-router-dom';
import { X, Check, Star, ExternalLink, Trophy } from 'lucide-react';
import DifficultyBadge from './DifficultyBadge';

export default function RoadmapTopicDrawer({
  node,
  isOpen,
  onClose,
  problems = [],
  completedSlugs = new Set(),
  onToggleComplete,
}) {
  if (!isOpen || !node) return null;

  const topicProblems = problems.filter(
    (p) => p.category?.toLowerCase() === node.name?.toLowerCase() ||
           p.category?.toLowerCase() === node.categoryKey?.toLowerCase()
  );

  const completedCount = topicProblems.filter((p) => completedSlugs.has(p.slug)).length;
  const total = topicProblems.length || node.total || 0;
  const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 dark:bg-black/60 backdrop-blur-xs transition-opacity">
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121319] shadow-2xl">
        {/* Drawer Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-[#16171d] px-5">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
              <span>{node.name}</span>
            </h2>
            <div className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Đã giải <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{completedCount}</strong> / {total} bài ({percent}%)
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-slate-100 dark:bg-zinc-800">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Drawer Body Problem List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {topicProblems.length > 0 ? (
            topicProblems.map((problem) => {
              const isCompleted = completedSlugs.has(problem.slug);

              return (
                <div
                  key={problem.slug || problem.id}
                  className={`group flex items-center justify-between rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-slate-50/70 dark:bg-[#16171d] p-3.5 transition-all hover:border-slate-300 dark:hover:border-zinc-700/80 hover:bg-slate-100/70 dark:hover:bg-zinc-800/40 ${
                    isCompleted ? 'bg-emerald-50/60 border-emerald-300 dark:bg-emerald-950/10 dark:border-emerald-500/30' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => onToggleComplete(problem.slug)}
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition-all ${
                        isCompleted
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-slate-400 text-transparent'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>

                    {/* Title */}
                    <Link
                      to={`/problems/${problem.slug}`}
                      className="truncate text-xs font-semibold text-slate-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                    >
                      {problem.title}
                    </Link>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0 pl-2">
                    <DifficultyBadge difficulty={problem.difficulty} size="xs" />
                    <Link
                      to={`/problems/${problem.slug}`}
                      className="p-1 text-slate-400 dark:text-zinc-500 group-hover:text-slate-700 dark:group-hover:text-zinc-200 transition-colors"
                      title="Mở workspace"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 dark:text-zinc-500">
              Đang đồng bộ dữ liệu cho nhóm chủ đề này...
            </div>
          )}
        </div>

        {/* Footer Summary */}
        <div className="border-t border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-[#16171d] p-4 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
          <div className="flex items-center space-x-1.5">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span>NeetCode 150 Standard</span>
          </div>
          <span className="font-mono text-slate-500 dark:text-zinc-500">{topicProblems.length} bài tập</span>
        </div>
      </div>
    </div>
  );
}

