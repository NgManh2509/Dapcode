import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Loader2, CheckCircle2, Shuffle, ChevronDown, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import ProgressSidebar from '../components/ProgressSidebar';
import DifficultyBadge from '../components/DifficultyBadge';
import RoadmapGraph from '../components/RoadmapGraph';
import RoadmapTopicDrawer from '../components/RoadmapTopicDrawer';
import { getProblems } from '../api/problems';

const PAGE_SIZE = 50;

const selectCls =
  'appearance-none rounded-lg bg-[#F0F0F0] dark:bg-[#333333] pl-3 pr-8 py-1.5 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-[#E6E6E6] dark:hover:bg-[#3E3E3E] focus:outline-none cursor-pointer transition-colors';

export default function ProblemsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isGraph = location.pathname === '/roadmap';

  const [allProblems, setAllProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedTopic, setSelectedTopic] = useState('ALL');
  const [page, setPage] = useState(1);
  const [selectedNode, setSelectedNode] = useState(null);

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

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getProblems({ size: 250 })
      .then((res) => {
        if (!isMounted) return;
        const items = res?.data?.content || res?.content || res?.data || [];
        if (Array.isArray(items)) setAllProblems(items);
      })
      .catch((err) => console.error('Không thể kết nối tới backend:', err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedDifficulty, selectedStatus, selectedTopic]);

  const topics = useMemo(() => {
    const counts = {};
    allProblems.forEach((p) => {
      const c = p.category || 'General';
      counts[c] = (counts[c] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [allProblems]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allProblems.filter((p) => {
      const matchQuery = !q || p.title?.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q);
      const matchDiff = selectedDifficulty === 'ALL' || p.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase();
      const matchTopic = selectedTopic === 'ALL' || (p.category || 'General') === selectedTopic;
      const solved = completedSlugs.has(p.slug);
      const matchStatus =
        selectedStatus === 'ALL' || (selectedStatus === 'SOLVED' ? solved : !solved);
      return matchQuery && matchDiff && matchTopic && matchStatus;
    });
  }, [allProblems, searchQuery, selectedDifficulty, selectedTopic, selectedStatus, completedSlugs]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const indexOf = (p) => allProblems.findIndex((x) => x.slug === p.slug) + 1;

  const pickRandom = () => {
    if (!filtered.length) return;
    const p = filtered[Math.floor(Math.random() * filtered.length)];
    navigate(`/problems/${p.slug}`);
  };

  const hasFilter =
    searchQuery || selectedDifficulty !== 'ALL' || selectedStatus !== 'ALL' || selectedTopic !== 'ALL';

  return (
    <div className="min-h-screen bg-[#F0F0F0] dark:bg-[#1A1A1A] text-[#262626] dark:text-[#EFF1F6] flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-[1300px] px-4 py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-3">
            <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
            <span className="text-sm text-neutral-500 dark:text-neutral-400">Đang tải dữ liệu...</span>
          </div>
        ) : isGraph ? (
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-xl font-semibold">Dapcode 150 Roadmap</h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Lộ trình học theo chủ đề — bấm vào một nút để xem danh sách bài tập.
                </p>
              </div>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                {completedSlugs.size}/{allProblems.length} Solved
              </span>
            </div>
            <RoadmapGraph
              problems={allProblems}
              completedSlugs={completedSlugs}
              onSelectNode={(node) => setSelectedNode(node)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
            <div className="min-w-0 space-y-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setSelectedTopic('ALL')}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm transition-colors cursor-pointer ${
                    selectedTopic === 'ALL'
                      ? 'bg-[#262626] text-white dark:bg-[#EFF1F6] dark:text-[#262626]'
                      : 'bg-white dark:bg-[#282828] text-neutral-600 dark:text-neutral-300 hover:bg-[#E6E6E6] dark:hover:bg-[#333333]'
                  }`}
                >
                  All Topics
                </button>
                {topics.map(([name, count]) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelectedTopic(name === selectedTopic ? 'ALL' : name)}
                    className={`shrink-0 flex items-center space-x-1.5 rounded-full px-3.5 py-1.5 text-sm transition-colors cursor-pointer ${
                      selectedTopic === name
                        ? 'bg-[#262626] text-white dark:bg-[#EFF1F6] dark:text-[#262626]'
                        : 'bg-white dark:bg-[#282828] text-neutral-600 dark:text-neutral-300 hover:bg-[#E6E6E6] dark:hover:bg-[#333333]'
                    }`}
                  >
                    <span>{name}</span>
                    <span className="text-xs opacity-60">{count}</span>
                  </button>
                ))}
              </div>

              <div className="rounded-lg bg-white dark:bg-[#282828]">
                <div className="flex flex-wrap items-center gap-2 p-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search questions"
                      className="w-56 rounded-lg bg-[#F0F0F0] dark:bg-[#333333] py-1.5 pl-9 pr-3 text-sm placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                    />
                  </div>

                  <div className="relative">
                    <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)} className={selectCls}>
                      <option value="ALL">Difficulty</option>
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                  </div>

                  <div className="relative">
                    <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className={selectCls}>
                      <option value="ALL">Status</option>
                      <option value="TODO">Todo</option>
                      <option value="SOLVED">Solved</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                  </div>

                  {hasFilter && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedDifficulty('ALL');
                        setSelectedStatus('ALL');
                        setSelectedTopic('ALL');
                      }}
                      className="flex items-center space-x-1 text-sm text-neutral-500 hover:text-[#262626] dark:hover:text-[#EFF1F6] cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Reset</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={pickRandom}
                    className="ml-auto flex items-center space-x-1.5 rounded-lg bg-[#F0F0F0] dark:bg-[#333333] px-3 py-1.5 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-[#E6E6E6] dark:hover:bg-[#3E3E3E] cursor-pointer transition-colors"
                  >
                    <Shuffle className="h-4 w-4" />
                    <span>Pick One</span>
                  </button>
                </div>

                <div className="px-3 pb-1 text-sm text-neutral-500 dark:text-neutral-400">
                  <span className="text-[#2CBB5D] font-medium">{completedSlugs.size}</span>
                  <span> / {allProblems.length} Solved</span>
                </div>

                <table className="w-full text-left mt-1">
                  <thead>
                    <tr className="text-xs text-neutral-500 dark:text-neutral-400 border-b border-[#E6E6E6] dark:border-[#3E3E3E]">
                      <th className="px-4 py-2 w-14 font-normal">Status</th>
                      <th className="px-2 py-2 font-normal">Title</th>
                      <th className="px-2 py-2 w-44 font-normal hidden md:table-cell">Topic</th>
                      <th className="px-4 py-2 w-28 font-normal text-right">Difficulty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.map((p) => {
                      const solved = completedSlugs.has(p.slug);
                      return (
                        <tr
                          key={p.slug || p.id}
                          className="odd:bg-[#F7F8FA] dark:odd:bg-[#333333]/60 hover:bg-[#EFEFEF] dark:hover:bg-[#3E3E3E] transition-colors"
                        >
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => toggleComplete(p.slug)}
                              className="cursor-pointer"
                              title={solved ? 'Solved' : 'Mark as solved'}
                            >
                              {solved ? (
                                <CheckCircle2 className="h-[18px] w-[18px] text-[#2CBB5D]" />
                              ) : (
                                <span className="block h-[18px] w-[18px]" />
                              )}
                            </button>
                          </td>
                          <td className="px-2 py-3 text-sm">
                            <Link
                              to={`/problems/${p.slug}`}
                              className="text-[#262626] dark:text-[#EFF1F6] hover:text-[#FFA116] dark:hover:text-[#FFA116] transition-colors"
                            >
                              <span className="text-neutral-500 dark:text-neutral-400 mr-1">{indexOf(p)}.</span>
                              {p.title}
                            </Link>
                          </td>
                          <td className="px-2 py-3 text-sm text-neutral-500 dark:text-neutral-400 hidden md:table-cell">
                            {p.category}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <DifficultyBadge difficulty={p.difficulty} variant="text" />
                          </td>
                        </tr>
                      );
                    })}
                    {pageItems.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-16 text-center text-sm text-neutral-500 dark:text-neutral-400">
                          Không tìm thấy bài tập phù hợp.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-1 p-3 border-t border-[#E6E6E6] dark:border-[#3E3E3E]">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setPage(n)}
                        className={`h-8 min-w-8 rounded-md px-2 text-sm cursor-pointer transition-colors ${
                          n === page
                            ? 'bg-[#262626] text-white dark:bg-[#EFF1F6] dark:text-[#262626]'
                            : 'text-neutral-600 dark:text-neutral-300 hover:bg-[#F0F0F0] dark:hover:bg-[#333333]'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <aside className="lg:sticky lg:top-[66px]">
              <ProgressSidebar problems={allProblems} completedSlugs={completedSlugs} />
            </aside>
          </div>
        )}
      </main>

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
