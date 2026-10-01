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
  }); // 'graph' | 'accordion' | 'table'

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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0d13] text-slate-800 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-8">
        {/* Page Hero Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center space-x-2.5">
                <span>{viewMode === 'graph' ? 'Dapcode 150 Roadmap' : 'Luyện tập 150 Bài Toán'}</span>
                {!isLoading && (
                  <span className="text-xs font-mono font-medium text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border dark:border-emerald-500/20">
                    Live ({allProblems.length} bài)
                  </span>
                )}
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
                {viewMode === 'graph'
                  ? 'Sơ đồ cấu trúc dữ liệu & giải thuật tương tác — dữ liệu đồng bộ trực tiếp từ Database hệ thống.'
                  : 'Danh sách bài tập phân loại theo chủ đề và độ khó, tích hợp trình chấm trực tuyến và AI Tutor.'}
              </p>
            </div>

            {/* View Mode Switcher: Graph Tree / Accordion / Table */}
            <div className="flex items-center space-x-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#16171d] p-1 self-start sm:self-auto shadow-xs">
              <button
                type="button"
                onClick={() => handleSwitchView('graph')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  viewMode === 'graph'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                <GitFork className="h-3.5 w-3.5" />
                <span>Sơ đồ cây</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchView('accordion')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  viewMode === 'accordion'
                    ? 'bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Chủ đề</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchView('table')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  viewMode === 'table'
                    ? 'bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
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
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm bài tập (vd: Two Sum, Anagram...)"
                  className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#16171d] py-2 pl-10 pr-4 text-xs text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-xs"
                />
              </div>

              {/* Difficulty Filter Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
                {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      selectedDifficulty === diff
                        ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/20'
                        : 'bg-white dark:bg-[#16171d] text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-200 border border-slate-200 dark:border-zinc-800'
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
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-500" />
            <span className="text-xs text-slate-500 dark:text-zinc-400">Đang đồng bộ bài tập từ Database backend...</span>
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
                  <div className="rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-[#16171d] p-12 text-center text-slate-500 dark:text-zinc-500">
                    <p className="text-sm">Không tìm thấy bài tập phù hợp với bộ lọc hiện tại.</p>
                  </div>
                )
              ) : (
                /* Flat Table View */
                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-[#16171d] shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#121319] text-slate-600 dark:text-zinc-400 uppercase font-semibold">
                      <tr>
                        <th className="px-5 py-3.5 w-12 text-center">Status</th>
                        <th className="px-5 py-3.5">Tiêu đề bài toán</th>
                        <th className="px-5 py-3.5 w-32">Danh mục</th>
                        <th className="px-5 py-3.5 w-24 text-right">Độ khó</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
                      {filteredFlatProblems.map((p) => {
                        const isCompleted = completedSlugs.has(p.slug);
                        return (
                          <tr
                            key={p.slug || p.id}
                            className={`hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors ${
                              isCompleted ? 'bg-emerald-50/60 dark:bg-emerald-950/10' : ''
                            }`}
                          >
                            <td className="px-5 py-3 text-center">
                              <button
                                type="button"
                                onClick={() => toggleComplete(p.slug)}
                                className={`inline-flex h-4 w-4 items-center justify-center rounded border ${
                                  isCompleted
                                    ? 'border-emerald-500 bg-emerald-500 text-white'
                                    : 'border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-transparent'
                                }`}
                              >
                                <CheckCircle2 className="h-3 w-3" />
                              </button>
                            </td>
                            <td className="px-5 py-3">
                              <Link
                                to={`/problems/${p.slug}`}
                                className="font-medium text-slate-800 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                              >
                                {p.title}
                              </Link>
                            </td>
                            <td className="px-5 py-3 text-slate-500 dark:text-zinc-400">
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

