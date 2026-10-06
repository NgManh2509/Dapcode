import React from 'react';
import { Link } from 'react-router-dom';
import { X, Check, ExternalLink, Trophy } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 dark:bg-black/60 backdrop-blur-xs transition-opacity">
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-[#E8E4DC] dark:border-[#332F2B] bg-[#FFFFFF] dark:bg-[#1C1A18]">
        {/* Drawer Header */}
        <div className="flex h-14 items-center justify-between border-b border-[#E8E4DC] dark:border-[#332F2B] bg-[#FAF8F3] dark:bg-[#24221F] px-5">
          <div>
            <h2 className="text-sm font-semibold text-[#1C1917] dark:text-[#F5F2EB] tracking-tight flex items-center space-x-2">
              <span>{node.name}</span>
            </h2>
            <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
              Đã giải <strong className="text-[#15803D] dark:text-[#4ADE80] font-mono">{completedCount}</strong> / {total} bài ({percent}%)
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-[#FAF8F3] dark:hover:bg-[#24221F] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-[#FAF8F3] dark:bg-[#24221F] border-b border-[#E8E4DC] dark:border-[#332F2B]">
          <div
            className="h-full bg-stone-800 dark:bg-stone-200 transition-all duration-300"
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
                  className={`group flex items-center justify-between rounded-xl border border-[#E8E4DC] dark:border-[#332F2B] bg-[#FAF8F3] dark:bg-[#24221F] p-3 transition-colors hover:border-stone-400 dark:hover:border-stone-500 ${
                    isCompleted ? 'bg-[#F0FDF4]/30 border-[#BBF7D0] dark:bg-[#14532D]/10 dark:border-[#166534]' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => onToggleComplete(problem.slug)}
                      className={`flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded border transition-colors cursor-pointer ${
                        isCompleted
                          ? 'border-[#15803D] bg-[#15803D] text-white'
                          : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-[#1C1A18] hover:border-stone-400 text-transparent'
                      }`}
                    >
                      <Check className="h-3 w-3" />
                    </button>

                    {/* Title */}
                    <Link
                      to={`/problems/${problem.slug}`}
                      className="truncate text-xs font-medium text-stone-800 dark:text-stone-200 hover:text-[#1C1917] dark:hover:text-white transition-colors"
                    >
                      {problem.title}
                    </Link>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0 pl-2">
                    <DifficultyBadge difficulty={problem.difficulty} size="xs" />
                    <Link
                      to={`/problems/${problem.slug}`}
                      className="p-1 text-stone-400 hover:text-stone-700 dark:text-stone-500 dark:hover:text-stone-300 transition-colors"
                      title="Mở workspace"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-stone-400 dark:text-stone-500">
              Đang đồng bộ dữ liệu cho nhóm chủ đề này...
            </div>
          )}
        </div>

        {/* Footer Summary */}
        <div className="border-t border-[#E8E4DC] dark:border-[#332F2B] bg-[#FAF8F3] dark:bg-[#24221F] p-4 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center space-x-1.5">
            <Trophy className="h-3.5 w-3.5 text-[#B45309] dark:text-[#FBBF24]" />
            <span>NeetCode 150 Standard</span>
          </div>
          <span className="font-mono text-stone-500 dark:text-stone-400">{topicProblems.length} bài tập</span>
        </div>
      </div>
    </div>
  );
}
