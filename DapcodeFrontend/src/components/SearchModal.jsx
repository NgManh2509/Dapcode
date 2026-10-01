import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, CornerDownLeft, Loader2 } from 'lucide-react';
import DifficultyBadge from './DifficultyBadge';
import { getProblems } from '../api/problems';

export default function SearchModal({ isOpen, onClose, problems: initialProblems }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [problems, setProblems] = useState(initialProblems || []);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // If no problems were provided via prop, fetch real problems from backend
  useEffect(() => {
    if (isOpen) {
      if (!initialProblems || initialProblems.length === 0) {
        setIsLoading(true);
        getProblems({ size: 250 })
          .then((res) => {
            const list = res?.data?.content || res?.content || res?.data || [];
            if (Array.isArray(list)) {
              setProblems(list);
            }
          })
          .catch((err) => {
            console.error('Lỗi khi tải danh sách bài tập:', err);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        setProblems(initialProblems);
      }
    }
  }, [isOpen, initialProblems]);

  // Filter problems based on query
  const filteredProblems = query.trim() === ''
    ? problems.slice(0, 10)
    : problems.filter(
        (p) =>
          p.title?.toLowerCase().includes(query.toLowerCase()) ||
          p.category?.toLowerCase().includes(query.toLowerCase()) ||
          p.slug?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 12);

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle global Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Keyboard navigation inside modal
  const handleInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredProblems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredProblems.length) % Math.max(1, filteredProblems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filteredProblems[selectedIndex];
      if (target) {
        onClose();
        navigate(`/problems/${target.slug}`);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#161722] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-[#12131a]">
          <Search className="h-4 w-4 text-slate-400 dark:text-zinc-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Tìm kiếm bài tập theo tên, danh mục hoặc slug..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none"
          />
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-slate-400 dark:text-zinc-400 mr-2" />}
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-zinc-800/40">
          {filteredProblems.length > 0 ? (
            filteredProblems.map((problem, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={problem.slug || problem.id}
                  onClick={() => {
                    onClose();
                    navigate(`/problems/${problem.slug}`);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected ? 'bg-indigo-50 text-indigo-900 dark:bg-indigo-600/20 dark:text-white' : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="text-xs font-semibold text-slate-900 dark:text-zinc-100 truncate">
                      {problem.title}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-zinc-500 hidden sm:inline">
                      {problem.category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <DifficultyBadge difficulty={problem.difficulty} size="xs" />
                    {isSelected && (
                      <CornerDownLeft className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-slate-400 dark:text-zinc-500">
              {isLoading ? 'Đang tải dữ liệu bài tập từ database...' : `Không tìm thấy bài tập nào với từ khóa "${query}".`}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-[#12131a] px-4 py-2 text-[11px] text-slate-500 dark:text-zinc-500">
          <div className="flex items-center space-x-3">
            <span><kbd className="rounded bg-slate-200 dark:bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-700 dark:text-zinc-400">↑↓</kbd> để di chuyển</span>
            <span><kbd className="rounded bg-slate-200 dark:bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-700 dark:text-zinc-400">↵</kbd> để chọn</span>
            <span><kbd className="rounded bg-slate-200 dark:bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-700 dark:text-zinc-400">esc</kbd> để đóng</span>
          </div>
          <span className="text-indigo-600 dark:text-indigo-400 font-medium">Dapcode Database</span>
        </div>
      </div>
    </div>
  );
}

