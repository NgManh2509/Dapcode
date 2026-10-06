import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DifficultyBadge from '../components/DifficultyBadge';
import MarkdownRenderer from '../components/MarkdownRenderer';
import CodeEditor, { SUPPORTED_LANGUAGES } from '../components/CodeEditor';
import ConsoleDrawer from '../components/ConsoleDrawer';
import AiTutorDrawer from '../components/AiTutorDrawer';
import SearchModal from '../components/SearchModal';
import AuthModal from '../components/AuthModal';
import StreakModal from '../components/StreakModal';
import DapcodeLogo from '../components/DapcodeLogo';
import { getProblemBySlug, getProblems } from '../api/problems';
import { submitCode, subscribeSubmissionStream } from '../api/submissions';
import { getStarterCode } from '../data/starterTemplates';
import { useTheme } from '../context/ThemeContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  History, 
  Sparkles, 
  Clock, 
  Cpu, 
  Search,
  Flame,
  User,
  ArrowLeft,
  AlertCircle,
  Sun,
  Moon
} from 'lucide-react';

export default function WorkspacePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toggleTheme, isDark } = useTheme();

  // Problem State
  const [problem, setProblem] = useState(null);
  const [allProblems, setAllProblems] = useState([]);
  const [isLoadingProblem, setIsLoadingProblem] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description'); // 'description' | 'submissions'

  // Editor State
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(() => getStarterCode(slug, 'python'));

  // Modals state
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isStreakOpen, setIsStreakOpen] = useState(false);

  // User state
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dapcode_user') || 'null');
    } catch {
      return null;
    }
  });

  // Submission / Sandbox State
  const [submissionState, setSubmissionState] = useState({
    isRunning: false,
    isSubmitting: false,
    progress: null,
    result: null,
    error: null,
  });

  const [authPromptMessage, setAuthPromptMessage] = useState('');

  // Fetch full list of problems for dropdown selector and prev/next navigation
  useEffect(() => {
    getProblems({ size: 250 })
      .then((res) => {
        const items = res?.data?.content || res?.content || res?.data || [];
        if (Array.isArray(items)) {
          setAllProblems(items);
        }
      })
      .catch((err) => {
        console.error('Không thể tải danh sách bài tập:', err);
      });
  }, []);

  // Navigation: Prev & Next problems
  const currentIndex = allProblems.findIndex((p) => p.slug === slug);
  const prevProblem = currentIndex > 0 ? allProblems[currentIndex - 1] : null;
  const nextProblem = currentIndex >= 0 && currentIndex < allProblems.length - 1 ? allProblems[currentIndex + 1] : null;

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load problem details from Spring Boot Backend
  useEffect(() => {
    setIsLoadingProblem(true);
    setFetchError(null);
    setSubmissionState({
      isRunning: false,
      isSubmitting: false,
      progress: null,
      result: null,
      error: null,
    });

    getProblemBySlug(slug)
      .then((res) => {
        const data = res?.data || res;
        if (data && data.slug) {
          setProblem(data);
          const initialCode = data.starterCode?.[language] || getStarterCode(slug, language);
          setCode(initialCode);
        } else {
          setFetchError('Không tìm thấy dữ liệu bài toán từ backend.');
        }
      })
      .catch((err) => {
        console.error('Lỗi khi tải chi tiết bài tập:', err);
        const msg = err.response?.data?.message || err.message || 'Không thể kết nối tới máy chủ backend.';
        setFetchError(msg);
      })
      .finally(() => {
        setIsLoadingProblem(false);
      });
  }, [slug]);

  // Handle language switch
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    const newCode = problem?.starterCode?.[newLang] || getStarterCode(slug, newLang);
    setCode(newCode);
  };

  const handleResetCode = () => {
    const resetCode = problem?.starterCode?.[language] || getStarterCode(slug, language);
    setCode(resetCode);
  };

  const checkAuth = (actionName) => {
    const token = localStorage.getItem('dapcode_token');
    if (!token || !user) {
      setAuthPromptMessage(`Bạn cần đăng nhập tài khoản để ${actionName}, tính chuỗi Streak và nhận điểm XP!`);
      setIsAuthOpen(true);
      return false;
    }
    return true;
  };

  const handleOpenAiTutor = () => {
    if (!checkAuth('sử dụng trợ lý AI Tutor')) return;
    setIsAiTutorOpen(true);
  };

  // Run Code
  const handleRunCode = useCallback(async () => {
    if (!problem) return;
    if (!checkAuth('chạy thử code')) return;
    setSubmissionState({
      isRunning: true,
      isSubmitting: false,
      progress: { message: 'Đang gửi mã nguồn tới Sandbox và kiểm thử các Test Case mẫu...' },
      result: null,
      error: null,
    });

    const langObj = SUPPORTED_LANGUAGES.find((l) => l.key === language) || SUPPORTED_LANGUAGES[0];

    try {
      const res = await submitCode({
        problemSlug: problem.slug,
        languageId: langObj.id,
        sourceCode: code,
      });

      const submissionData = res?.data || res;
      setSubmissionState({
        isRunning: false,
        isSubmitting: false,
        progress: null,
        result: submissionData,
        error: null,
      });

      if (submissionData?.submissionId) {
        subscribeSubmissionStream(submissionData.submissionId, {
          onProgress: (prog) => {
            setSubmissionState((prev) => ({
              ...prev,
              progress: prog,
            }));
          },
          onComplete: (completedRes) => {
            const mergedResult = {
              ...submissionData,
              ...completedRes,
              testCaseResults: (submissionData?.testCaseResults && submissionData.testCaseResults.length > 0)
                ? submissionData.testCaseResults
                : (completedRes?.testCaseResults || []),
            };
            setSubmissionState({
              isRunning: false,
              isSubmitting: false,
              progress: null,
              result: mergedResult,
              error: null,
            });
          },
          onError: () => {
            setSubmissionState((prev) => ({
              ...prev,
              isRunning: false,
              isSubmitting: false,
              progress: null,
              result: prev.result || submissionData,
              error: null,
            }));
          },
        });
      }
    } catch (err) {
      console.error('Sandbox Run API error:', err);
      const errMsg = err.response?.data?.message || err.message || 'Lỗi khi gửi bài tới Sandbox Judge0.';
      setSubmissionState({
        isRunning: false,
        isSubmitting: false,
        progress: null,
        result: null,
        error: errMsg,
      });
    }
  }, [problem, language, code, user]);

  // Submit Code
  const handleSubmitCode = useCallback(async () => {
    if (!problem) return;
    if (!checkAuth('nộp bài chấm điểm')) return;
    setSubmissionState({
      isRunning: false,
      isSubmitting: true,
      progress: { message: 'Đang nộp bài và chấm trên bộ kiểm thử toàn diện...' },
      result: null,
      error: null,
    });

    const langObj = SUPPORTED_LANGUAGES.find((l) => l.key === language) || SUPPORTED_LANGUAGES[0];

    try {
      const res = await submitCode({
        problemSlug: problem.slug,
        languageId: langObj.id,
        sourceCode: code,
      });

      const submissionData = res?.data || res;
      setSubmissionState({
        isRunning: false,
        isSubmitting: false,
        progress: null,
        result: submissionData,
        error: null,
      });

      if (submissionData?.status?.toUpperCase() === 'ACCEPTED') {
        try {
          const completed = new Set(JSON.parse(localStorage.getItem('dapcode_completed') || '[]'));
          completed.add(problem.slug);
          localStorage.setItem('dapcode_completed', JSON.stringify(Array.from(completed)));
        } catch (e) {
          console.error(e);
        }
      }

      if (submissionData?.submissionId) {
        subscribeSubmissionStream(submissionData.submissionId, {
          onProgress: (prog) => {
            setSubmissionState((prev) => ({
              ...prev,
              progress: prog,
            }));
          },
          onComplete: (completedRes) => {
            const mergedResult = {
              ...submissionData,
              ...completedRes,
              testCaseResults: (submissionData?.testCaseResults && submissionData.testCaseResults.length > 0)
                ? submissionData.testCaseResults
                : (completedRes?.testCaseResults || []),
            };
            setSubmissionState({
              isRunning: false,
              isSubmitting: false,
              progress: null,
              result: mergedResult,
              error: null,
            });
          },
          onError: () => {
            setSubmissionState((prev) => ({
              ...prev,
              isRunning: false,
              isSubmitting: false,
              progress: null,
              result: prev.result || submissionData,
              error: null,
            }));
          },
        });
      }
    } catch (err) {
      console.error('Sandbox Submit API error:', err);
      const errMsg = err.response?.data?.message || err.message || 'Lỗi khi gửi bài tới Sandbox Judge0.';
      setSubmissionState({
        isRunning: false,
        isSubmitting: false,
        progress: null,
        result: null,
        error: errMsg,
      });
    }
  }, [problem, language, code, user]);

  if (isLoadingProblem) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#FDFBF7] dark:bg-[#141312] text-stone-600 dark:text-stone-400 font-sans">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-800 dark:border-stone-200 border-t-transparent" />
          <p className="text-xs">Đang tải đề bài từ Database...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !problem) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#FDFBF7] dark:bg-[#141312] text-stone-800 dark:text-stone-200 font-sans p-4 space-y-4">
        <AlertCircle className="h-8 w-8 text-[#B91C1C]" />
        <h2 className="text-base font-semibold text-[#1C1917] dark:text-[#F5F2EB]">Không thể tải bài tập</h2>
        <p className="text-xs text-stone-600 dark:text-stone-400 max-w-md text-center">{fetchError || 'Bài tập không tồn tại trong hệ thống.'}</p>
        <Link
          to="/roadmap"
          className="rounded-lg bg-[#1C1917] dark:bg-[#F5F2EB] px-4 py-2 text-xs font-medium text-[#FAF8F3] dark:text-[#1C1917] transition-colors"
        >
          Quay lại Roadmap
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#FDFBF7] dark:bg-[#141312] text-[#1C1917] dark:text-[#F5F2EB] font-sans overflow-hidden">
      {/* Top Workspace Navigation Bar */}
      <header className="flex h-14 items-center justify-between border-b border-[#E8E4DC] dark:border-[#332F2B] bg-[#FDFBF7]/90 dark:bg-[#141312]/90 backdrop-blur-md px-4 flex-shrink-0">
        {/* Left: Brand Logo, Back, Problem Navigator */}
        <div className="flex items-center space-x-3 min-w-0">
          <Link
            to="/roadmap"
            className="flex items-center space-x-2 text-[#1C1917] dark:text-[#F5F2EB] hover:opacity-80 transition-opacity"
            title="Quay lại Roadmap"
          >
            <DapcodeLogo size="sm" />
            <span className="font-semibold text-sm tracking-tight hidden md:inline">Dapcode</span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700 font-mono hidden sm:inline">
              v1.0
            </span>
          </Link>

          <div className="h-4 w-px bg-[#E8E4DC] dark:bg-[#332F2B] hidden sm:block" />

          {/* Back to List */}
          <Link
            to="/practice"
            className="flex items-center space-x-1 rounded-lg px-2.5 py-1 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-[#FAF8F3] dark:hover:bg-[#24221F] hover:text-[#1C1917] dark:hover:text-[#F5F2EB] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Danh sách</span>
          </Link>

          {/* Prev / Next Problem Switcher */}
          <div className="flex items-center space-x-1">
            <button
              type="button"
              disabled={!prevProblem}
              onClick={() => prevProblem && navigate(`/problems/${prevProblem.slug}`)}
              className="p-1 rounded text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 disabled:opacity-30 transition-colors cursor-pointer"
              title={prevProblem ? `Bài trước: ${prevProblem.title}` : 'Không có bài trước'}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={!nextProblem}
              onClick={() => nextProblem && navigate(`/problems/${nextProblem.slug}`)}
              className="p-1 rounded text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 disabled:opacity-30 transition-colors cursor-pointer"
              title={nextProblem ? `Bài kế tiếp: ${nextProblem.title}` : 'Không có bài kế tiếp'}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="h-4 w-px bg-[#E8E4DC] dark:bg-[#332F2B]" />

          {/* Problem Title & Dropdown Selector */}
          <div className="flex items-center space-x-2 truncate">
            {allProblems.length > 0 ? (
              <select
                value={problem.slug}
                onChange={(e) => navigate(`/problems/${e.target.value}`)}
                className="bg-transparent text-xs sm:text-sm font-semibold text-[#1C1917] dark:text-[#F5F2EB] focus:outline-none cursor-pointer truncate max-w-[200px] sm:max-w-[300px]"
              >
                {allProblems.map((p) => (
                  <option key={p.slug} value={p.slug} className="bg-white dark:bg-[#1C1A18] text-stone-800 dark:text-stone-200">
                    {p.title} ({p.difficulty})
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-xs sm:text-sm font-semibold text-[#1C1917] dark:text-[#F5F2EB] truncate max-w-[200px]">
                {problem.title}
              </span>
            )}
            <DifficultyBadge difficulty={problem.difficulty} size="xs" />
          </div>
        </div>

        {/* Right Tools: Theme Switcher, Search, AI Tutor, Streak, User */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* Theme Switcher Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center justify-center h-7.5 w-7.5 rounded-lg bg-[#FAF8F3] dark:bg-[#24221F] border border-[#E8E4DC] dark:border-[#332F2B] text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            title={isDark ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}
          >
            {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>

          {/* Quick Search Trigger */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center space-x-1.5 rounded-lg bg-[#FAF8F3] dark:bg-[#24221F] border border-[#E8E4DC] dark:border-[#332F2B] px-2.5 py-1 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            title="Tìm kiếm bài tập (⌘K)"
          >
            <Search className="h-3.5 w-3.5" />
            <kbd className="hidden md:inline rounded bg-white dark:bg-[#1C1A18] border border-[#E8E4DC] dark:border-[#332F2B] px-1 text-[10px] text-stone-500 dark:text-stone-400 font-mono">⌘K</kbd>
          </button>

          {/* Socratic AI Tutor Quick Trigger */}
          <button
            type="button"
            onClick={handleOpenAiTutor}
            className="flex items-center space-x-1.5 rounded-lg bg-[#1C1917] hover:bg-[#2D2A26] dark:bg-[#F5F2EB] dark:hover:bg-[#E8E4DC] px-3 py-1 text-xs font-medium text-[#FAF8F3] dark:text-[#1C1917] transition-colors cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">AI Tutor</span>
            <span className="sm:hidden">AI</span>
          </button>

          {/* Daily Streak */}
          <button
            type="button"
            onClick={() => setIsStreakOpen(true)}
            className="flex items-center space-x-1 rounded-lg bg-[#FAF8F3] dark:bg-[#24221F] border border-[#E8E4DC] dark:border-[#332F2B] px-2 py-1 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            title="Xem chuỗi streak"
          >
            <Flame className="h-3.5 w-3.5 text-[#B45309] dark:text-[#FBBF24]" />
            <span className="font-mono text-[11px]">{user?.streakCount ?? user?.streak ?? 1}</span>
          </button>

          {/* User Sign In / Profile */}
          {user ? (
            <div className="flex items-center space-x-1.5 bg-[#FAF8F3] dark:bg-[#24221F] border border-[#E8E4DC] dark:border-[#332F2B] py-1 px-2.5 rounded-lg text-xs">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.username || user.name || 'User'}
                  referrerPolicy="no-referrer"
                  className="h-4.5 w-4.5 rounded-full object-cover border border-[#E8E4DC] dark:border-[#332F2B]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`h-4.5 w-4.5 rounded-full bg-[#1C1917] dark:bg-[#F5F2EB] items-center justify-center text-[9px] font-medium text-white dark:text-[#1C1917] ${user.avatarUrl ? 'hidden' : 'flex'}`}
              >
                {(user.username || user.name || user.email || 'U').charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-[#1C1917] dark:text-[#F5F2EB] hidden md:inline max-w-[90px] truncate text-[11px]">
                {user.username || user.name || user.email?.split('@')[0]}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center space-x-1 rounded-lg bg-[#1C1917] hover:bg-[#2D2A26] dark:bg-[#F5F2EB] dark:hover:bg-[#E8E4DC] px-2.5 py-1 text-xs font-medium text-[#FAF8F3] dark:text-[#1C1917] transition-colors cursor-pointer"
            >
              <User className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Split-Pane Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2.5 p-2.5 overflow-hidden">
        {/* Left Pane: Problem Description & Editorial Tabs (5 Cols on LG) */}
        <div className="lg:col-span-5 flex flex-col rounded-xl border border-[#E8E4DC] dark:border-[#332F2B] bg-[#FFFFFF] dark:bg-[#1C1A18] overflow-hidden h-full">
          {/* Left Panel Tabs Header */}
          <div className="flex h-11 items-center border-b border-[#E8E4DC] dark:border-[#332F2B] bg-[#FAF8F3] dark:bg-[#24221F] px-4 space-x-1">
            <button
              type="button"
              onClick={() => setActiveLeftTab('description')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeLeftTab === 'description'
                  ? 'bg-white dark:bg-[#1C1A18] text-[#1C1917] dark:text-[#F5F2EB] border border-[#E8E4DC] dark:border-[#332F2B]'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Mô tả</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveLeftTab('submissions')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeLeftTab === 'submissions'
                  ? 'bg-white dark:bg-[#1C1A18] text-[#1C1917] dark:text-[#F5F2EB] border border-[#E8E4DC] dark:border-[#332F2B]'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <History className="h-3.5 w-3.5" />
              <span>Lịch sử nộp</span>
            </button>
          </div>

          {/* Left Panel Content: Editorial Readable Style */}
          <div className="flex-1 overflow-y-auto p-5 text-sm">
            {activeLeftTab === 'description' ? (
              <div className="space-y-4">
                {/* Meta Limits & Category Badge */}
                <div className="flex flex-wrap items-center gap-2.5 text-xs text-stone-500 dark:text-stone-400 border-b border-[#E8E4DC] dark:border-[#332F2B] pb-3">
                  <span className="rounded-md bg-[#FAF8F3] dark:bg-[#24221F] border border-[#E8E4DC] dark:border-[#332F2B] px-2 py-0.5 font-medium text-stone-700 dark:text-stone-300">
                    {problem.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5 text-stone-400" />
                    <span>{problem.timeLimitMs || 1000} ms</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Cpu className="h-3.5 w-3.5 text-stone-400" />
                    <span>{((problem.memoryLimitKb || 262144) / 1024).toFixed(0)} MB</span>
                  </div>
                </div>

                {/* Markdown Description */}
                <MarkdownRenderer content={problem.descriptionMarkdown} />
              </div>
            ) : (
              /* Submissions History */
              <div className="space-y-3">
                <div className="text-xs font-medium text-stone-600 dark:text-stone-400 mb-2">Lịch sử bài nộp:</div>
                <div className="rounded-lg border border-[#E8E4DC] dark:border-[#332F2B] bg-[#FAF8F3] dark:bg-[#24221F] p-3 text-xs text-stone-500 dark:text-stone-400">
                  Chưa có lượt nộp bài nào được ghi nhận cho bài toán này.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Monaco Editor + Console Drawer (7 Cols on LG) */}
        <div className="lg:col-span-7 flex flex-col h-full space-y-2.5 overflow-hidden">
          {/* Top 60%: Monaco Editor */}
          <div className="h-[60%] w-full">
            <CodeEditor
              code={code}
              onChange={setCode}
              language={language}
              onLanguageChange={handleLanguageChange}
              onResetCode={handleResetCode}
              onOpenAiTutor={handleOpenAiTutor}
            />
          </div>

          {/* Bottom 40%: Console Drawer */}
          <div className="h-[40%] w-full">
            <ConsoleDrawer
              publicTestCases={problem.publicTestCases || []}
              submissionState={submissionState}
              onRunCode={handleRunCode}
              onSubmitCode={handleSubmitCode}
            />
          </div>
        </div>
      </div>

      {/* Socratic AI Tutor Drawer Flyout */}
      <AiTutorDrawer
        isOpen={isAiTutorOpen}
        onClose={() => setIsAiTutorOpen(false)}
        problemSlug={problem.slug}
        problemTitle={problem.title}
        currentCode={code}
        language={language}
        lastError={submissionState.error || (submissionState.result?.status !== 'ACCEPTED' ? submissionState.result?.status : '')}
      />

      {/* Global Modals in Workspace */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        problems={allProblems}
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(u) => setUser(u)}
        promptMessage={authPromptMessage}
      />
      <StreakModal
        isOpen={isStreakOpen}
        onClose={() => setIsStreakOpen(false)}
        streakCount={user?.streakCount ?? user?.streak ?? 1}
      />
    </div>
  );
}
