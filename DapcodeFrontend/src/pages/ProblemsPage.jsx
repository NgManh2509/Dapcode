import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import CategoryAccordion from '../components/CategoryAccordion';
import ProgressSidebar from '../components/ProgressSidebar';
import DifficultyBadge from '../components/DifficultyBadge';
import RoadmapGraph from '../components/RoadmapGraph';
import RoadmapTopicDrawer from '../components/RoadmapTopicDrawer';
import { getProblems } from '../api/problems';
import { Search, Layers, ListFilter, GitFork, CheckCircle2, Loader2 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function ProblemsPage({ initialView = 'graph' }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [allProblems, setAllProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [viewMode, setViewMode] = useState(() => {
    if (location.pathname === '/practice' || location.pathname === '/problems') return 'accordion';
    if (location.pathname === '/roadmap') return 'graph';
    return initialView;
  });

  // Sync viewMode whenever route changes
  useEffect(() => {
    if (location.pathname === '/practice' || location.pathname === '/problems') {
      setViewMode((prev) => (prev === 'graph' ? 'accordion' : prev));
    } else if (location.pathname === '/roadmap') {
      setViewMode('graph');
    }
  }, [location.pathname]);

  const handleSwitchView = (mode) => {
    setViewMode(mode);
    if (mode === 'graph' && location.pathname !== '/roadmap') {
      navigate('/roadmap');
    } else if ((mode === 'accordion' || mode === 'table') && location.pathname === '/roadmap') {
      navigate('/practice');
    }
  };

  // Selected topic node for the roadmap drawer
  const [selectedNode, setSelectedNode] = useState(null);

  // Persisted completed problems in localStorage
  const [completedSlugs, setCompletedSlugs] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('dapcode_completed') || '[]'));
    } catch {
      return new Set();
    }
  });

  const toggleComplete = (slug) => {
    setCompletedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      localStorage.setItem('dapcode_completed', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  // Fetch problems directly from Spring Boot Backend
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getProblems({ size: 250 })
      .then((res) => {
        if (!isMounted) return;
        const items = res?.data?.content || res?.content || res?.data || [];
        if (Array.isArray(items)) {
          setAllProblems(items);

          // Group problems into categories dynamically from database
          const grouped = {};
          items.forEach((p) => {
            const cat = p.category || 'General';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(p);
          });

          const catList = Object.keys(grouped).map((catName) => ({
            name: catName,
            problems: grouped[catName],
          }));

          setCategories(catList);
        }
      })
      .catch((err) => {
        console.error('Không thể kết nối tới Spring Boot Backend:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered categories and problems
  const filteredCategories = useMemo(() => {
    return categories
      .map((cat) => {
        const filteredProblems = cat.problems.filter((p) => {
          const matchQuery =
            !searchQuery ||
            p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.slug?.toLowerCase().includes(searchQuery.toLowerCase());
          const matchDiff =
            selectedDifficulty === 'ALL' ||
            p.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase();
          return matchQuery && matchDiff;
        });

        return {
          ...cat,
          problems: filteredProblems,
        };
      })
      .filter((cat) => cat.problems.length > 0);
  }, [categories, searchQuery, selectedDifficulty]);

  const filteredFlatProblems = useMemo(() => {
    return allProblems.filter((p) => {
      const matchQuery =
        !searchQuery ||
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDiff =
        selectedDifficulty === 'ALL' ||
        p.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase();
      return matchQuery && matchDiff;
    });
  }, [allProblems, searchQuery, selectedDifficulty]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#141312] text-[#1C1917] dark:text-[#F5F2EB] flex flex-col font-sans transition-colors duration-150">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-8">
        {/* Page Hero Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1C1917] dark:text-[#F5F2EB] flex items-center space-x-2.5">
                <span>{viewMode === 'graph' ? 'Dapcode 150 Roadmap' : 'Luyện tập 150 Bài Toán'}</span>
                {!isLoading && (
                  <span className="text-xs font-mono font-medium text-[#15803D] bg-[#F0FDF4] border-[#BBF7D0] dark:text-[#4ADE80] dark:bg-[#14532D]/20 px-2 py-0.5 rounded-md border dark:border-[#166534]/40">
                    Live ({allProblems.length} bài)
                  </span>
                )}
              </h1>
              <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                {viewMode === 'graph'
                  ? 'Sơ đồ cây cấu trúc dữ liệu & giải thuật tương tác — đồng bộ trực tiếp từ Database hệ thống.'
                  : 'Danh sách bài tập phân loại theo chủ đề và độ khó, tích hợp trình chấm trực tuyến và AI Tutor.'}
              </p>
            </div>

            {/* View Mode Switcher: Graph Tree / Accordion / Table */}
            <div className="flex items-center space-x-1 rounded-lg border border-[#E8E4DC] dark:border-[#332F2B] bg-[#FAF8F3] dark:bg-[#24221F] p-1 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => handleSwitchView('graph')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'graph'
                    ? 'bg-white dark:bg-[#1C1A18] text-[#1C1917] dark:text-[#F5F2EB] border border-[#E8E4DC] dark:border-[#332F2B]'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <GitFork className="h-3.5 w-3.5" />
                <span>Sơ đồ cây</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchView('accordion')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'accordion'
                    ? 'bg-white dark:bg-[#1C1A18] text-[#1C1917] dark:text-[#F5F2EB] border border-[#E8E4DC] dark:border-[#332F2B]'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Chủ đề</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchView('table')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-[#1C1A18] text-[#1C1917] dark:text-[#F5F2EB] border border-[#E8E4DC] dark:border-[#332F2B]'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <ListFilter className="h-3.5 w-3.5" />
                <span>Danh sách</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar (when in accordion or table mode) */}
          {viewMode !== 'graph' && (
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm bài tập (vd: Two Sum, Anagram...)"
                  className="w-full rounded-xl border border-[#E8E4DC] dark:border-[#332F2B] bg-white dark:bg-[#1C1A18] py-2 pl-10 pr-4 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-stone-500"
                />
              </div>

              {/* Difficulty Filter Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
                {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      selectedDifficulty === diff
                        ? 'bg-[#1C1917] text-white dark:bg-[#F5F2EB] dark:text-[#1C1917]'
                        : 'bg-white dark:bg-[#1C1A18] text-stone-600 dark:text-stone-400 hover:bg-[#FAF8F3] dark:hover:bg-[#24221F] border border-[#E8E4DC] dark:border-[#332F2B]'
                    }`}
                  >
                    {diff === 'ALL' ? 'Tất cả độ khó' : diff.charAt(0) + diff.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <Loader2 className="h-6 w-6 animate-spin text-stone-700 dark:text-stone-300" />
            <span className="text-xs text-stone-500 dark:text-stone-400">Đang đồng bộ bài tập từ Database backend...</span>
          </div>
        ) : viewMode === 'graph' ? (
          /* NeetCode Interactive Tree Graph View */
          <div className="space-y-6">
            <RoadmapGraph
              problems={allProblems}
              completedSlugs={completedSlugs}
              onSelectNode={(node) => setSelectedNode(node)}
            />
          </div>
        ) : (
          /* Accordion / Table View with Sidebar */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Problems */}
            <div className="lg:col-span-8">
              {viewMode === 'accordion' ? (
                filteredCategories.length > 0 ? (
                  filteredCategories.map((cat, index) => (
                    <CategoryAccordion
                      key={cat.name}
                      category={cat}
                      completedSlugs={completedSlugs}
                      onToggleComplete={toggleComplete}
                      defaultOpen={index === 0}
                    />
                  ))
                ) : (
                  <div className="rounded-xl border border-[#E8E4DC] dark:border-[#332F2B] bg-[#FFFFFF] dark:bg-[#1C1A18] p-12 text-center text-stone-500 dark:text-stone-400">
                    <p className="text-sm">Không tìm thấy bài tập phù hợp với bộ lọc hiện tại.</p>
                  </div>
                )
              ) : (
                /* Flat Table View */
                <div className="overflow-hidden rounded-xl border border-[#E8E4DC] dark:border-[#332F2B] bg-[#FFFFFF] dark:bg-[#1C1A18]">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-[#E8E4DC] dark:border-[#332F2B] bg-[#FAF8F3] dark:bg-[#24221F] text-stone-600 dark:text-stone-400 uppercase font-semibold">
                      <tr>
                        <th className="px-5 py-3 w-12 text-center">Status</th>
                        <th className="px-5 py-3">Tiêu đề bài toán</th>
                        <th className="px-5 py-3 w-32">Danh mục</th>
                        <th className="px-5 py-3 w-24 text-right">Độ khó</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E4DC]/60 dark:divide-[#332F2B]/60">
                      {filteredFlatProblems.map((p) => {
                        const isCompleted = completedSlugs.has(p.slug);
                        return (
                          <tr
                            key={p.slug || p.id}
                            className={`hover:bg-[#FAF8F3] dark:hover:bg-[#24221F] transition-colors ${
                              isCompleted ? 'bg-[#F0FDF4]/40 dark:bg-[#14532D]/10' : ''
                            }`}
                          >
                            <td className="px-5 py-3 text-center">
                              <button
                                type="button"
                                onClick={() => toggleComplete(p.slug)}
                                className={`inline-flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                                  isCompleted
                                    ? 'border-[#15803D] bg-[#15803D] text-white'
                                    : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-[#1C1A18] text-transparent'
                                }`}
                              >
                                <CheckCircle2 className="h-3 w-3" />
                              </button>
                            </td>
                            <td className="px-5 py-3">
                              <Link
                                to={`/problems/${p.slug}`}
                                className="font-medium text-stone-800 dark:text-stone-200 hover:text-stone-950 dark:hover:text-white transition-colors"
                              >
                                {p.title}
                              </Link>
                            </td>
                            <td className="px-5 py-3 text-stone-500 dark:text-stone-400">
                              {p.category}
                            </td>
                            <td className="px-5 py-3 text-right">
                              <DifficultyBadge difficulty={p.difficulty} size="xs" />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right Column: Progress Sidebar */}
            <div className="lg:col-span-4 sticky top-20">
              <ProgressSidebar
                problems={allProblems}
                completedSlugs={completedSlugs}
              />
            </div>
          </div>
        )}
      </main>

      {/* Topic Drawer when clicking any node in the graph */}
      <RoadmapTopicDrawer
        node={selectedNode}
        isOpen={Boolean(selectedNode)}
        onClose={() => setSelectedNode(null)}
        problems={allProblems}
        completedSlugs={completedSlugs}
        onToggleComplete={toggleComplete}
      />
    </div>
  );
}
