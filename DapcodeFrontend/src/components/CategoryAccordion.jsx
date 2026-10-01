import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight, 
  Check, 
  Star, 
  Sparkles, 
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
  const completedCount = category.problems?.filter(p => completedSlugs.has(p.slug)).length || 0;
  const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <div className="mb-3 overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-[#16171d] shadow-xs transition-all hover:border-slate-300 dark:hover:border-zinc-700/70">
      {/* Category Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800/30"
      >
        <div className="flex items-center space-x-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400">
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </div>
          <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
            {category.name}
          </span>
        </div>

        {/* Progress status */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex w-24 h-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-xs font-mono font-medium text-slate-500 dark:text-zinc-400">
            {completedCount} / {total}
          </span>
        </div>
      </button>

      {/* Problems Table when expanded */}
      {isOpen && (
        <div className="border-t border-slate-200 dark:border-zinc-800/70 divide-y divide-slate-100 dark:divide-zinc-800/40">
          {category.problems?.map((problem, index) => {
            const isCompleted = completedSlugs.has(problem.slug);
            const isStarred = starredSlugs.has(problem.slug);

            return (
              <div
                key={problem.slug || problem.id}
                className={`group flex items-center justify-between px-5 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800/40 ${
                  isCompleted ? 'bg-emerald-50/60 dark:bg-emerald-950/10' : ''
                }`}
              >
                {/* Left: Checkbox + Star + Title */}
                <div className="flex items-center space-x-3.5 min-w-0">
                  {/* Complete checkbox */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (onToggleComplete) onToggleComplete(problem.slug);
                    }}
                    className={`flex h-5 w-5 items-center justify-center rounded border transition-all ${
                      isCompleted
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 hover:border-slate-400 dark:hover:border-zinc-500 text-transparent'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>

                  {/* Star Bookmark */}
                  <button
                    type="button"
                    onClick={(e) => toggleStar(e, problem.slug)}
                    className="text-slate-300 dark:text-zinc-600 hover:text-amber-400 transition-colors"
                  >
                    <Star
                      className={`h-4 w-4 ${
                        isStarred
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300 dark:text-zinc-600 hover:text-amber-400'
                      }`}
                    />
                  </button>

                  {/* Problem Title Link */}
                  <Link
                    to={`/problems/${problem.slug}`}
                    className="truncate text-sm font-medium text-slate-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                  >
                    {problem.title}
                  </Link>
                </div>

                {/* Right: Difficulty + AI Hint Badge + Action */}
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <DifficultyBadge difficulty={problem.difficulty} size="xs" />

                  <Link
                    to={`/problems/${problem.slug}`}
                    className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 text-xs text-slate-400 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white transition-opacity"
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

