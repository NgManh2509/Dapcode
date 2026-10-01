import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { getTheoryBySlug, getTheories } from '../api/theories';
import { 
  ArrowLeft, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Code2, 
  Clock, 
  Loader2, 
  ListTree,
  ExternalLink 
} from 'lucide-react';

export default function TheoryDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [theory, setTheory] = useState(null);
  const [allTheories, setAllTheories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Load current theory
  useEffect(() => {
    setIsLoading(true);
    setErrorMsg(null);

    getTheoryBySlug(slug)
      .then((res) => {
        const data = res?.data || res;
        if (data && data.slug) {
          setTheory(data);
        } else {
          setErrorMsg('Không tìm thấy nội dung bài giảng.');
        }
      })
      .catch((err) => {
        console.error('Lỗi khi tải chi tiết lý thuyết:', err);
        setErrorMsg('Không thể kết nối tới máy chủ backend.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [slug]);

  // Load all theories for navigation sidebar
  useEffect(() => {
    getTheories()
      .then((res) => {
        const list = res?.data || res || [];
        if (Array.isArray(list)) {
          setAllTheories(list);
        }
      })
      .catch((err) => {
        console.error('Lỗi khi tải danh sách bài học:', err);
      });
  }, []);

  // Prev and next theory navigation
  const currentIndex = allTheories.findIndex((t) => t.slug === slug);
  const prevTheory = currentIndex > 0 ? allTheories[currentIndex - 1] : null;
  const nextTheory = currentIndex >= 0 && currentIndex < allTheories.length - 1 ? allTheories[currentIndex + 1] : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0d13] text-slate-800 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-500" />
          <span className="text-xs text-slate-500 dark:text-zinc-400">Đang tải bài giảng lý thuyết...</span>
        </div>
      </div>
    );
  }

  if (errorMsg || !theory) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0d13] text-slate-800 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-4">
          <BookOpen className="h-10 w-10 text-rose-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Không tìm thấy bài học</h2>
          <p className="text-xs text-slate-600 dark:text-zinc-400">{errorMsg || 'Bài học này không tồn tại trong hệ thống.'}</p>
          <Link
            to="/theories"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            Quay lại thư viện Lý thuyết
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0d13] text-slate-800 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar: Table of Contents & Syllabus Navigation (4 cols) */}
          <aside className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-[#161722] p-4 shadow-xs sticky top-20 max-h-[85vh] overflow-y-auto hidden lg:flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800/80 pb-3 mb-3">
              <Link
                to="/theories"
                className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Tất cả bài học</span>
              </Link>
              <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                {allTheories.length} bài
              </span>
            </div>

            <div className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <ListTree className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Chương trình giảng dạy</span>
            </div>

            <div className="space-y-1 divide-y divide-slate-100 dark:divide-zinc-800/40">
              {allTheories.map((item) => {
                const isActive = item.slug === slug;
                return (
                  <Link
                    key={item.slug || item.id}
                    to={`/theories/${item.slug}`}
                    className={`flex items-start space-x-2.5 p-2 rounded-xl text-xs transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 dark:bg-indigo-600/20 dark:text-indigo-300 dark:border-indigo-500/30'
                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800/40'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 mt-0.5">
                      #{item.orderIndex || 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate">{item.title}</div>
                      <div className="text-[10px] text-slate-400 dark:text-zinc-500">{item.category}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </aside>

          {/* Right Main Article Reader (8 cols) */}
          <article className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-[#161722] p-6 sm:p-8 shadow-xs">
            {/* Breadcrumb & Navigation */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800/80 pb-4 mb-6">
              <div className="flex items-center space-x-2 text-xs">
                <Link to="/theories" className="text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200">
                  Lý thuyết
                </Link>
                <span className="text-slate-300 dark:text-zinc-600">/</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{theory.category}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  disabled={!prevTheory}
                  onClick={() => prevTheory && navigate(`/theories/${prevTheory.slug}`)}
                  className="flex items-center space-x-1 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 px-2.5 py-1 text-xs text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-zinc-800/80 transition-colors cursor-pointer shadow-xs"
                  title={prevTheory?.title}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Bài trước</span>
                </button>
                <button
                  type="button"
                  disabled={!nextTheory}
                  onClick={() => nextTheory && navigate(`/theories/${nextTheory.slug}`)}
                  className="flex items-center space-x-1 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 px-2.5 py-1 text-xs text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-zinc-800/80 transition-colors cursor-pointer shadow-xs"
                  title={nextTheory?.title}
                >
                  <span className="hidden sm:inline">Bài tiếp</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Article Title & Meta */}
            <div className="mb-8">
              <div className="flex items-center space-x-2.5 mb-2">
                <span className="rounded-md bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                  {theory.category}
                </span>
                <span className="text-xs text-slate-400 dark:text-zinc-500 font-mono">
                  Bài học #{theory.orderIndex || 1}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {theory.title}
              </h1>
              {theory.summary && (
                <p className="mt-3 text-sm text-slate-600 dark:text-zinc-400 italic border-l-2 border-indigo-500 pl-3">
                  {theory.summary}
                </p>
              )}
            </div>

            {/* Markdown Article Content */}
            <div className="max-w-none text-slate-800 dark:text-zinc-200">
              <MarkdownRenderer content={theory.contentMarkdown} />
            </div>

            {/* Practice CTA Footer */}
            <div className="mt-12 rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/50 dark:bg-gradient-to-r dark:from-indigo-950/30 dark:to-[#121319] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Code2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Áp dụng ngay vào thực hành</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1">
                  Luyện tập các bài toán thuộc chủ đề {theory.category} trên NeetCode 150 Roadmap.
                </p>
              </div>
              <Link
                to="/roadmap"
                className="inline-flex items-center space-x-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all self-start sm:self-auto"
              >
                <span>Mở Roadmap</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}

