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
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#141312] text-[#1C1917] dark:text-[#F5F2EB] flex flex-col font-sans transition-colors duration-150">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-8">
        {/* Header Hero */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1C1917] dark:text-[#F5F2EB] flex items-center space-x-2.5">
                <BookOpen className="h-6 w-6 text-stone-700 dark:text-stone-300" />
                <span>Thư viện Lý thuyết DSA (Dapcode Theories)</span>
                {!isLoading && (
                  <span className="text-xs font-mono font-medium text-[#15803D] bg-[#F0FDF4] border-[#BBF7D0] dark:text-[#4ADE80] dark:bg-[#14532D]/20 px-2.5 py-0.5 rounded-md border dark:border-[#166534]/40">
                    {theories.length} bài học
                  </span>
                )}
              </h1>
              <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                Hệ thống giáo trình lý thuyết cấu trúc dữ liệu & giải thuật tinh gọn, giải thích bản chất kèm độ phức tạp không thời gian.
              </p>
            </div>
          </div>

          {/* Search & Categories Bar */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm bài học lý thuyết (vd: Dynamic Array, Stack, Binary Search...)"
                className="w-full rounded-xl border border-[#E8E4DC] dark:border-[#332F2B] bg-white dark:bg-[#1C1A18] py-2 pl-10 pr-4 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-stone-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedCategory === 'ALL'
                    ? 'bg-[#1C1917] text-white dark:bg-[#F5F2EB] dark:text-[#1C1917]'
                    : 'bg-white dark:bg-[#1C1A18] text-stone-600 dark:text-stone-400 hover:bg-[#FAF8F3] dark:hover:bg-[#24221F] border border-[#E8E4DC] dark:border-[#332F2B]'
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
                      ? 'bg-[#1C1917] text-white dark:bg-[#F5F2EB] dark:text-[#1C1917]'
                      : 'bg-white dark:bg-[#1C1A18] text-stone-600 dark:text-stone-400 hover:bg-[#FAF8F3] dark:hover:bg-[#24221F] border border-[#E8E4DC] dark:border-[#332F2B]'
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
            <Loader2 className="h-6 w-6 animate-spin text-stone-700 dark:text-stone-300" />
            <span className="text-xs text-stone-500 dark:text-stone-400">Đang tải danh sách bài học lý thuyết từ cơ sở dữ liệu...</span>
          </div>
        ) : filteredTheories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTheories.map((theory) => (
              <Link
                key={theory.slug || theory.id}
                to={`/theories/${theory.slug}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#E8E4DC] dark:border-[#332F2B] bg-[#FFFFFF] dark:bg-[#1C1A18] p-5 transition-colors hover:border-stone-500 dark:hover:border-stone-400"
              >
                <div>
                  {/* Category Pill */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-md bg-[#FAF8F3] dark:bg-[#24221F] px-2.5 py-1 text-[11px] font-medium text-stone-700 dark:text-stone-300 border border-[#E8E4DC] dark:border-[#332F2B]">
                      {theory.category}
                    </span>
                    <span className="text-[11px] font-mono text-stone-400 dark:text-stone-500">
                      Bài #{theory.orderIndex || 1}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-[#1C1917] dark:text-[#F5F2EB] tracking-tight group-hover:text-stone-900 dark:group-hover:text-white transition-colors mb-2">
                    {theory.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed mb-4">
                    {theory.summary || 'Tìm hiểu cấu trúc, nguyên lý hoạt động và cài đặt chi tiết.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E8E4DC] dark:border-[#332F2B] text-xs font-medium text-stone-600 dark:text-stone-400 group-hover:text-[#1C1917] dark:group-hover:text-white">
                  <span>Xem chi tiết</span>
                  <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-[#E8E4DC] dark:border-[#332F2B] bg-[#FFFFFF] dark:bg-[#1C1A18] p-12 text-center text-stone-500 dark:text-stone-400">
            <p className="text-sm">Không tìm thấy bài học lý thuyết phù hợp với từ khóa.</p>
          </div>
        )}
      </main>
    </div>
  );
}
