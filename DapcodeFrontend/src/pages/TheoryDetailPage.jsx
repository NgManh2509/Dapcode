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
      <div className="min-h-screen bg-[#F0F0F0] dark:bg-[#1A1A1A] text-[#262626] dark:text-[#EFF1F6] flex flex-col font-sans transition-colors duration-150">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-700 dark:text-neutral-300" />
          <span className="text-xs text-neutral-500 dark:text-neutral-400">Đang tải bài giảng lý thuyết...</span>
        </div>
      </div>
    );
  }

  if (errorMsg || !theory) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] dark:bg-[#1A1A1A] text-[#262626] dark:text-[#EFF1F6] flex flex-col font-sans transition-colors duration-150">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-4">
          <BookOpen className="h-8 w-8 text-[#EF4743]" />
          <h2 className="text-base font-semibold text-[#262626] dark:text-[#EFF1F6]">Không tìm thấy bài học</h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">{errorMsg || 'Bài học này không tồn tại trong hệ thống.'}</p>
          <Link
            to="/theories"
            className="rounded-lg bg-[#262626] dark:bg-[#EFF1F6] px-4 py-2 text-xs font-medium text-[#F7F8FA] dark:text-[#262626] transition-colors"
          >
            Quay lại thư viện Lý thuyết
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0] dark:bg-[#1A1A1A] text-[#262626] dark:text-[#EFF1F6] flex flex-col font-sans transition-colors duration-150">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar: Table of Contents & Syllabus Navigation (4 cols) */}
          <aside className="lg:col-span-4 rounded-lg border border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#FFFFFF] dark:bg-[#282828] p-4 sticky top-20 max-h-[85vh] overflow-y-auto hidden lg:flex flex-col">
            <div className="flex items-center justify-between border-b border-[#E6E6E6] dark:border-[#3E3E3E] pb-3 mb-3">
              <Link
                to="/theories"
                className="flex items-center space-x-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Tất cả bài học</span>
              </Link>
              <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                {allTheories.length} bài
              </span>
            </div>

            <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <ListTree className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300" />
              <span>Chương trình giảng dạy</span>
            </div>

            <div className="space-y-1 divide-y divide-[#E6E6E6]/60 dark:divide-[#3E3E3E]/60">
              {allTheories.map((item) => {
                const isActive = item.slug === slug;
                return (
                  <Link
                    key={item.slug || item.id}
                    to={`/theories/${item.slug}`}
                    className={`flex items-start space-x-2.5 p-2 rounded-lg text-xs transition-colors ${
                      isActive
                        ? 'bg-[#F7F8FA] text-[#262626] dark:bg-[#333333] dark:text-[#EFF1F6] font-semibold border border-[#E6E6E6] dark:border-[#3E3E3E]'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-[#F7F8FA] dark:hover:bg-[#333333]'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 mt-0.5">
                      #{item.orderIndex || 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate">{item.title}</div>
                      <div className="text-[10px] text-neutral-400 dark:text-neutral-500">{item.category}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </aside>

          {/* Right Main Article Reader (8 cols) */}
          <article className="lg:col-span-8 rounded-lg border border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#FFFFFF] dark:bg-[#282828] p-6 sm:p-8">
            {/* Breadcrumb & Navigation */}
            <div className="flex items-center justify-between border-b border-[#E6E6E6] dark:border-[#3E3E3E] pb-4 mb-6">
              <div className="flex items-center space-x-2 text-xs">
                <Link to="/theories" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200">
                  Lý thuyết
                </Link>
                <span className="text-neutral-300 dark:text-neutral-600">/</span>
                <span className="text-neutral-800 dark:text-neutral-200 font-medium">{theory.category}</span>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  disabled={!prevTheory}
                  onClick={() => prevTheory && navigate(`/theories/${prevTheory.slug}`)}
                  className="flex items-center space-x-1 rounded-lg border border-[#E6E6E6] dark:border-[#3E3E3E] bg-white hover:bg-[#F7F8FA] dark:bg-[#282828] dark:hover:bg-[#333333] px-2.5 py-1 text-xs text-neutral-700 dark:text-neutral-300 disabled:opacity-30 transition-colors cursor-pointer"
                  title={prevTheory?.title}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Bài trước</span>
                </button>
                <button
                  type="button"
                  disabled={!nextTheory}
                  onClick={() => nextTheory && navigate(`/theories/${nextTheory.slug}`)}
                  className="flex items-center space-x-1 rounded-lg border border-[#E6E6E6] dark:border-[#3E3E3E] bg-white hover:bg-[#F7F8FA] dark:bg-[#282828] dark:hover:bg-[#333333] px-2.5 py-1 text-xs text-neutral-700 dark:text-neutral-300 disabled:opacity-30 transition-colors cursor-pointer"
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
                <span className="rounded-md bg-[#F7F8FA] dark:bg-[#333333] px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 border border-[#E6E6E6] dark:border-[#3E3E3E]">
                  {theory.category}
                </span>
                <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">
                  Bài học #{theory.orderIndex || 1}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-[#262626] dark:text-[#EFF1F6] tracking-tight">
                {theory.title}
              </h1>
              {theory.summary && (
                <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 italic border-l-2 border-[#262626] dark:border-[#EFF1F6] pl-3">
                  {theory.summary}
                </p>
              )}
            </div>

            {/* Markdown Article Content */}
            <div className="max-w-none text-neutral-800 dark:text-neutral-200">
              <MarkdownRenderer content={theory.contentMarkdown} />
            </div>

            {/* Practice CTA Footer: Flat Warm Minimalist Panel */}
            <div className="mt-12 rounded-lg border border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#F7F8FA] dark:bg-[#333333] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-[#262626] dark:text-[#EFF1F6] flex items-center space-x-2">
                  <Code2 className="h-4 w-4" />
                  <span>Áp dụng ngay vào thực hành</span>
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                  Luyện tập các bài toán thuộc chủ đề {theory.category} trên NeetCode 150 Roadmap.
                </p>
              </div>
              <Link
                to="/roadmap"
                className="inline-flex items-center space-x-1.5 rounded-lg bg-[#262626] hover:bg-[#3C3C3C] dark:bg-[#EFF1F6] dark:hover:bg-[#E6E6E6] px-4 py-2 text-xs font-medium text-[#F7F8FA] dark:text-[#262626] transition-colors self-start sm:self-auto"
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
