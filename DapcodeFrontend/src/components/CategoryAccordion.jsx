import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight, 
  Check, 
  Star, 
  ExternalLink 
} from 'lucide-react';
import DifficultyBadge from './DifficultyBadge';

export default function CategoryAccordion({ 
  category, 
  completedSlugs = new Set(), 
  onToggleComplete,
  defaultOpen = false 
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [starredSlugs, setStarredSlugs] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('dapcode_starred') || '[]'));
    } catch {
      return new Set();
    }
  });

  const toggleStar = (e, slug) => {
    e.preventDefault();
    e.stopPropagation();
    setStarredSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      localStorage.setItem('dapcode_starred', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const total = category.problems?.length || 0;
  const completedCount = category.problems?.filter((p) => completedSlugs.has(p.slug)).length || 0;
  const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <div className="mb-3 overflow-hidden rounded-xl border border-[#E8E4DC] dark:border-[#332F2B] bg-[#FFFFFF] dark:bg-[#1C1A18] transition-colors">
      {/* Category Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-[#FAF8F3] dark:hover:bg-[#24221F] cursor-pointer"
      >
        <div className="flex items-center space-x-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#FAF8F3] dark:bg-[#24221F] border border-[#E8E4DC] dark:border-[#332F2B] text-stone-500 dark:text-stone-400">
            {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </div>
          <span className="text-sm font-semibold tracking-tight text-[#1C1917] dark:text-[#F5F2EB]">
            {category.name}
          </span>
        </div>

        {/* Progress status */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex w-24 h-1.5 rounded-full bg-[#FAF8F3] dark:bg-[#24221F] border border-[#E8E4DC] dark:border-[#332F2B] overflow-hidden">
            <div 
              className="h-full bg-stone-800 dark:bg-stone-200 transition-all duration-300 rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-xs font-mono font-medium text-stone-500 dark:text-stone-400">
            {completedCount} / {total}
          </span>
        </div>
      </button>

      {/* Problems Table when expanded */}
      {isOpen && (
        <div className="border-t border-[#E8E4DC] dark:border-[#332F2B] divide-y divide-[#E8E4DC]/60 dark:divide-[#332F2B]/60">
          {category.problems?.map((problem) => {
            const isCompleted = completedSlugs.has(problem.slug);
            const isStarred = starredSlugs.has(problem.slug);

            return (
              <div
                key={problem.slug || problem.id}
                className={`group flex items-center justify-between px-5 py-3 transition-colors hover:bg-[#FAF8F3] dark:hover:bg-[#24221F] ${
                  isCompleted ? 'bg-[#F0FDF4]/30 dark:bg-[#14532D]/10' : ''
                }`}
              >
                {/* Left: Checkbox + Star + Title */}
                <div className="flex items-center space-x-3 min-w-0">
                  {/* Complete checkbox */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (onToggleComplete) onToggleComplete(problem.slug);
                    }}
                    className={`flex h-4.5 w-4.5 items-center justify-center rounded border transition-colors cursor-pointer ${
                      isCompleted
                        ? 'border-[#15803D] bg-[#15803D] text-white'
                        : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-[#1C1A18] hover:border-stone-400 text-transparent'
                    }`}
                  >
                    <Check className="h-3 w-3" />
                  </button>

                  {/* Star Bookmark */}
                  <button
                    type="button"
                    onClick={(e) => toggleStar(e, problem.slug)}
                    className="text-stone-300 dark:text-stone-600 hover:text-[#B45309] transition-colors cursor-pointer"
                  >
                    <Star
                      className={`h-3.5 w-3.5 ${
                        isStarred
                          ? 'text-[#B45309] fill-[#B45309]'
                          : 'text-stone-300 dark:text-stone-600 hover:text-[#B45309]'
                      }`}
                    />
                  </button>

                  {/* Problem Title Link */}
                  <Link
                    to={`/problems/${problem.slug}`}
                    className="truncate text-xs font-medium text-stone-800 dark:text-stone-200 hover:text-[#1C1917] dark:hover:text-white transition-colors"
                  >
                    {problem.title}
                  </Link>
                </div>

                {/* Right: Difficulty + Action */}
                <div className="flex items-center space-x-2.5 flex-shrink-0">
                  <DifficultyBadge difficulty={problem.difficulty} size="xs" />

                  <Link
                    to={`/problems/${problem.slug}`}
                    className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 text-xs text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-opacity"
                    title="Mở không gian lập trình"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
