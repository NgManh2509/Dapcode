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
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#FFFFFF] dark:bg-[#282828]">
        {/* Drawer Header */}
        <div className="flex h-14 items-center justify-between border-b border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#F7F8FA] dark:bg-[#333333] px-5">
          <div>
            <h2 className="text-sm font-semibold text-[#262626] dark:text-[#EFF1F6] tracking-tight flex items-center space-x-2">
              <span>{node.name}</span>
            </h2>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              Đã giải <strong className="text-[#2CBB5D] dark:text-[#2CBB5D] font-mono">{completedCount}</strong> / {total} bài ({percent}%)
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-[#F7F8FA] dark:hover:bg-[#333333] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-[#F7F8FA] dark:bg-[#333333] border-b border-[#E6E6E6] dark:border-[#3E3E3E]">
          <div
            className="h-full bg-neutral-800 dark:bg-neutral-200 transition-all duration-300"
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
                  className={`group flex items-center justify-between rounded-xl border border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#F7F8FA] dark:bg-[#333333] p-3 transition-colors hover:border-neutral-400 dark:hover:border-neutral-500 ${
                    isCompleted ? 'bg-[#E8F7EE]/30 border-[#B7E4C7] dark:bg-[#14532D]/10 dark:border-[#166534]' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => onToggleComplete(problem.slug)}
                      className={`flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded border transition-colors cursor-pointer ${
                        isCompleted
                          ? 'border-[#2CBB5D] bg-[#2CBB5D] text-white'
                          : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#282828] hover:border-neutral-400 text-transparent'
                      }`}
                    >
                      <Check className="h-3 w-3" />
                    </button>

                    {/* Title */}
                    <Link
                      to={`/problems/${problem.slug}`}
                      className="truncate text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:text-[#262626] dark:hover:text-white transition-colors"
                    >
                      {problem.title}
                    </Link>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0 pl-2">
                    <DifficultyBadge difficulty={problem.difficulty} size="xs" />
                    <Link
                      to={`/problems/${problem.slug}`}
                      className="p-1 text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors"
                      title="Mở workspace"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-neutral-400 dark:text-neutral-500">
              Đang đồng bộ dữ liệu cho nhóm chủ đề này...
            </div>
          )}
        </div>

        {/* Footer Summary */}
        <div className="border-t border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#F7F8FA] dark:bg-[#333333] p-4 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center space-x-1.5">
            <Trophy className="h-3.5 w-3.5 text-[#FFA116] dark:text-[#FFC01E]" />
            <span>NeetCode 150 Standard</span>
          </div>
          <span className="font-mono text-neutral-500 dark:text-neutral-400">{topicProblems.length} bài tập</span>
        </div>
      </div>
    </div>
  );
}
