import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getTheories, getTheoryCategories } from '../api/theories';
import { 
  BookOpen, 
  Search, 
  ArrowRight, 
  Loader2 
} from 'lucide-react';

export default function TheoriesPage() {
  const [theories, setTheories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([getTheories(), getTheoryCategories()])
      .then(([theoriesRes, catRes]) => {
        if (!isMounted) return;
        const list = theoriesRes?.data || theoriesRes || [];
        const cats = catRes?.data || catRes || [];
        if (Array.isArray(list)) setTheories(list);
        if (Array.isArray(cats)) setCategories(cats);
      })
      .catch((err) => {
        console.error('Lỗi khi tải dữ liệu lý thuyết DSA:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTheories = useMemo(() => {
    return theories.filter((t) => {
      const matchCat = selectedCategory === 'ALL' || t.category === selectedCategory;
      const matchQuery =
        !searchQuery ||
        t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [theories, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F0F0F0] dark:bg-[#1A1A1A] text-[#262626] dark:text-[#EFF1F6] flex flex-col font-sans transition-colors duration-150">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-8">
        {/* Header Hero */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#262626] dark:text-[#EFF1F6] flex items-center space-x-2.5">
                <BookOpen className="h-6 w-6 text-neutral-700 dark:text-neutral-300" />
                <span>Theories</span>
                {!isLoading && (
                  <span className="text-xs font-mono font-medium text-[#2CBB5D] bg-[#E8F7EE] border-[#B7E4C7] dark:text-[#2CBB5D] dark:bg-[#14532D]/20 px-2.5 py-0.5 rounded-md border dark:border-[#166534]/40">
                    {theories.length} bài học
                  </span>
                )}
              </h1>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                Hệ thống giáo trình lý thuyết cấu trúc dữ liệu & giải thuật tinh gọn, giải thích bản chất kèm độ phức tạp không thời gian.
              </p>
            </div>
          </div>

          {/* Search & Categories Bar */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm bài học lý thuyết (vd: Dynamic Array, Stack, Binary Search...)"
                className="w-full rounded-lg border border-[#E6E6E6] dark:border-[#3E3E3E] bg-white dark:bg-[#282828] py-2 pl-10 pr-4 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedCategory === 'ALL'
                    ? 'bg-[#262626] text-white dark:bg-[#EFF1F6] dark:text-[#262626]'
                    : 'bg-white dark:bg-[#282828] text-neutral-600 dark:text-neutral-400 hover:bg-[#F7F8FA] dark:hover:bg-[#333333] border border-[#E6E6E6] dark:border-[#3E3E3E]'
                }`}
              >
                Tất cả ({theories.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#262626] text-white dark:bg-[#EFF1F6] dark:text-[#262626]'
                      : 'bg-white dark:bg-[#282828] text-neutral-600 dark:text-neutral-400 hover:bg-[#F7F8FA] dark:hover:bg-[#333333] border border-[#E6E6E6] dark:border-[#3E3E3E]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Theories Content Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <Loader2 className="h-6 w-6 animate-spin text-neutral-700 dark:text-neutral-300" />
            <span className="text-xs text-neutral-500 dark:text-neutral-400">Đang tải danh sách bài học lý thuyết từ cơ sở dữ liệu...</span>
          </div>
        ) : filteredTheories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTheories.map((theory) => (
              <Link
                key={theory.slug || theory.id}
                to={`/theories/${theory.slug}`}
                className="group relative flex flex-col justify-between rounded-lg border border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#FFFFFF] dark:bg-[#282828] p-5 transition-colors hover:border-neutral-500 dark:hover:border-neutral-400"
              >
                <div>
                  {/* Category Pill */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-md bg-[#F7F8FA] dark:bg-[#333333] px-2.5 py-1 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 border border-[#E6E6E6] dark:border-[#3E3E3E]">
                      {theory.category}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
                      Bài #{theory.orderIndex || 1}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-[#262626] dark:text-[#EFF1F6] tracking-tight group-hover:text-neutral-900 dark:group-hover:text-white transition-colors mb-2">
                    {theory.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed mb-4">
                    {theory.summary || 'Tìm hiểu cấu trúc, nguyên lý hoạt động và cài đặt chi tiết.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E6E6E6] dark:border-[#3E3E3E] text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-[#262626] dark:group-hover:text-white">
                  <span>Xem chi tiết</span>
                  <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#FFFFFF] dark:bg-[#282828] p-12 text-center text-neutral-500 dark:text-neutral-400">
            <p className="text-sm">Không tìm thấy bài học lý thuyết phù hợp với từ khóa.</p>
          </div>
        )}
      </main>
    </div>
  );
}
