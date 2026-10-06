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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl rounded-2xl border border-[#E8E4DC] dark:border-[#332F2B] bg-[#FFFFFF] dark:bg-[#1C1A18] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E8E4DC] dark:border-[#332F2B] bg-[#FAF8F3] dark:bg-[#24221F]">
          <Search className="h-4 w-4 text-stone-400 mr-3 flex-shrink-0" />
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
            className="flex-1 bg-transparent text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none"
          />
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-stone-400 mr-2" />}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-stone-400 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-[#FAF8F3] dark:hover:bg-[#24221F] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[#E8E4DC]/60 dark:divide-[#332F2B]/60">
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
                    isSelected 
                      ? 'bg-[#FAF8F3] dark:bg-[#24221F] text-[#1C1917] dark:text-[#F5F2EB] border border-[#E8E4DC] dark:border-[#332F2B]' 
                      : 'text-stone-700 dark:text-stone-300 hover:bg-[#FAF8F3] dark:hover:bg-[#24221F] border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="text-xs font-medium text-stone-900 dark:text-stone-100 truncate">
                      {problem.title}
                    </span>
                    <span className="text-[11px] text-stone-400 dark:text-stone-500 hidden sm:inline">
                      {problem.category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <DifficultyBadge difficulty={problem.difficulty} size="xs" />
                    {isSelected && (
                      <CornerDownLeft className="h-3.5 w-3.5 text-stone-500 dark:text-stone-400" />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-stone-400 dark:text-stone-500">
              {isLoading ? 'Đang tải dữ liệu bài tập từ database...' : `Không tìm thấy bài tập nào với từ khóa "${query}".`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
