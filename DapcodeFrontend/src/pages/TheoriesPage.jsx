import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getTheories, getTheoryCategories } from '../api/theories';
import { 
  BookOpen, 
  Search, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Clock, 
  Loader2,
  FileText 
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0d13] text-slate-800 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-8">
        {/* Header Hero */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center space-x-2.5">
                <BookOpen className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                <span>Thư viện Lý thuyết DSA (Dapcode Theories)</span>
                {!isLoading && (
                  <span className="text-xs font-mono font-medium text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-full border dark:border-emerald-500/20">
                    {theories.length} bài học
                  </span>
                )}
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
                Hệ thống giáo trình lý thuyết cấu trúc dữ liệu & giải thuật tinh gọn, giải thích bản chất kèm độ phức tạp không thời gian.
              </p>
            </div>
          </div>

          {/* Search & Categories Bar */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm bài học lý thuyết (vd: Dynamic Array, Stack, Binary Search...)"
                className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#16171d] py-2 pl-10 pr-4 text-xs text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-xs"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  selectedCategory === 'ALL'
                    ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/20'
                    : 'bg-white dark:bg-[#16171d] text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-200 border border-slate-200 dark:border-zinc-800'
                }`}
              >
                Tất cả ({theories.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/20'
                      : 'bg-white dark:bg-[#16171d] text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-200 border border-slate-200 dark:border-zinc-800'
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
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-500" />
            <span className="text-xs text-slate-500 dark:text-zinc-400">Đang tải danh sách bài học lý thuyết từ cơ sở dữ liệu...</span>
          </div>
        ) : filteredTheories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTheories.map((theory) => (
              <Link
                key={theory.slug || theory.id}
                to={`/theories/${theory.slug}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-[#161722] p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:shadow-md hover:shadow-indigo-500/5"
              >
                <div>
                  {/* Category Pill */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-md bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                      {theory.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500">
                      Bài #{theory.orderIndex || 1}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                    {theory.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-3 leading-relaxed mb-4">
                    {theory.summary || 'Tìm hiểu cấu trúc, nguyên lý hoạt động và cài đặt chi tiết.'}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-zinc-800/80 pt-3 text-xs text-slate-500 dark:text-zinc-400">
                  <div className="flex items-center space-x-1.5 text-indigo-600 dark:text-indigo-400 font-medium group-hover:translate-x-1 transition-transform">
                    <span>Đọc bài giảng</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex items-center space-x-1 text-slate-400 dark:text-zinc-500 text-[11px]">
                    <Clock className="h-3.5 w-3.5" />
                    <span>5 - 10 phút đọc</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#161722] p-12 text-center text-slate-500 dark:text-zinc-400">
            <FileText className="mx-auto h-8 w-8 text-slate-400 dark:text-zinc-600 mb-3" />
            <p className="text-sm">Không tìm thấy bài học lý thuyết nào phù hợp với từ khóa.</p>
          </div>
        )}
      </main>
    </div>
  );
}

