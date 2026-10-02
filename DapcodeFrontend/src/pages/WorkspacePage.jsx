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
import { getProblemBySlug, getProblems } from '../api/problems';
import { submitCode, subscribeSubmissionStream } from '../api/submissions';
import { DEFAULT_STARTER_CODE, getStarterCode } from '../data/starterTemplates';
import { useTheme } from '../context/ThemeContext';
import { 
  Code2,
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
  const { theme, toggleTheme, isDark } = useTheme();

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
    progress: null, // { currentTest, totalTests, message }
    result: null,   // SubmissionResponse
    error: null,
  });

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

  // Navigation: Prev & Next problems from live database
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

  // Load problem details directly from Spring Boot Backend
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
          setCode(getStarterCode(slug, language));
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


  // Handle language switch and starter code
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(getStarterCode(slug, newLang));
  };

  const handleResetCode = () => {
    setCode(getStarterCode(slug, language));
  };


  const [authPromptMessage, setAuthPromptMessage] = useState('');

  // Authentication check helper (Phương án 2: Yêu cầu đăng nhập trước khi nộp bài)
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

  // Run Code (Sample tests via Judge0 Sandbox)
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
  }, [problem, language, code]);

  // Submit Code (Chấm bộ test ẩn toàn diện qua Spring Boot + Sandbox)
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
  }, [problem, language, code]);

  if (isLoadingProblem) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-[#0b0d13] text-slate-500 dark:text-zinc-400 font-sans">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-xs">Đang tải đề bài từ Database...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !problem) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-50 dark:bg-[#0b0d13] text-slate-800 dark:text-zinc-300 font-sans p-4 space-y-4">
        <AlertCircle className="h-10 w-10 text-rose-500" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Không thể tải bài tập</h2>
        <p className="text-xs text-slate-600 dark:text-zinc-400 max-w-md text-center">{fetchError || 'Bài tập không tồn tại trong hệ thống.'}</p>
        <Link
          to="/roadmap"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          Quay lại Roadmap
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-slate-100 dark:bg-[#0b0d13] text-slate-900 dark:text-zinc-100 font-sans overflow-hidden">
      {/* Top Main Workspace Navigation Bar */}
      <header className="flex h-13 items-center justify-between border-b border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-[#161722] px-4 flex-shrink-0">
        {/* Left: Brand Logo, Back, Problem Navigator */}
        <div className="flex items-center space-x-3 min-w-0">
          <Link
            to="/roadmap"
            className="flex items-center space-x-2 text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title="Quay lại Roadmap"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-sm">
              <Code2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight hidden md:inline">Dapcode</span>
          </Link>

          <div className="h-4 w-px bg-slate-200 dark:bg-zinc-800 hidden sm:block" />

          {/* Back to List */}
          <Link
            to="/practice"
            className="flex items-center space-x-1 rounded-md px-2 py-1 text-xs font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-colors"
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
              className="p-1 rounded text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title={prevProblem ? `Bài trước: ${prevProblem.title}` : 'Không có bài trước'}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={!nextProblem}
              onClick={() => nextProblem && navigate(`/problems/${nextProblem.slug}`)}
              className="p-1 rounded text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title={nextProblem ? `Bài kế tiếp: ${nextProblem.title}` : 'Không có bài kế tiếp'}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-zinc-800" />

          {/* Problem Title & Dropdown Selector */}
          <div className="flex items-center space-x-2 truncate">
            {allProblems.length > 0 ? (
              <select
                value={problem.slug}
                onChange={(e) => navigate(`/problems/${e.target.value}`)}
                className="bg-transparent text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer truncate max-w-[200px] sm:max-w-[300px]"
              >
                {allProblems.map((p) => (
                  <option key={p.slug} value={p.slug} className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200">
                    {p.title} ({p.difficulty})
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                {problem.title}
              </span>
            )}
            <DifficultyBadge difficulty={problem.difficulty} size="xs" />
          </div>
        </div>

        {/* Right Tools: Theme Switcher, Search, AI Tutor, Streak, User */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Theme Switcher Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center justify-center h-7.5 w-7.5 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title={isDark ? "Chuyển sang chế độ Sáng" : "Chuyển sang chế độ Tối"}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>

          {/* Quick Search Trigger */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center space-x-1.5 rounded-md bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 px-2.5 py-1 text-xs text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors cursor-pointer"
            title="Tìm kiếm bài tập (⌘K)"
          >
            <Search className="h-3.5 w-3.5" />
            <kbd className="hidden md:inline rounded bg-slate-200 dark:bg-zinc-800 px-1 text-[10px] text-slate-500 dark:text-zinc-400 font-mono">⌘K</kbd>
          </button>

          {/* Socratic AI Tutor Quick Trigger */}
          <button
            type="button"
            onClick={handleOpenAiTutor}
            className="flex items-center space-x-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-600/20 dark:hover:bg-indigo-600/30 border border-indigo-200 dark:border-indigo-500/40 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Xin gợi ý (AI Tutor)</span>
            <span className="sm:hidden">AI</span>
          </button>

          {/* Daily Streak */}
          <button
            type="button"
            onClick={() => setIsStreakOpen(true)}
            className="flex items-center space-x-1 rounded-md bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 px-2 py-1 text-xs font-medium text-amber-600 dark:text-amber-400 hover:border-amber-500/40 transition-colors cursor-pointer"
            title="Xem chuỗi streak"
          >
            <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500/30" />
            <span>{user?.streak || 1}</span>
          </button>

          {/* User Sign In */}
          {user ? (
            <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 py-1 px-2 rounded-lg text-xs">
              <div className="h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                {user.name?.charAt(0) || 'U'}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center space-x-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-slate-300 dark:border-zinc-700 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-white transition-colors cursor-pointer"
            >
              <User className="h-3.5 w-3.5 text-slate-500 dark:text-zinc-400" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Split-Pane Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 p-2 overflow-hidden">
        {/* Left Pane: Problem Description & Tabs (5 Cols on LG) */}
        <div className="lg:col-span-5 flex flex-col rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-[#16171d] overflow-hidden shadow-sm h-full">
          {/* Left Panel Tabs Header */}
          <div className="flex h-11 items-center border-b border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-[#121319] px-4 space-x-1">
            <button
              type="button"
              onClick={() => setActiveLeftTab('description')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                activeLeftTab === 'description'
                  ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white border border-slate-200 dark:border-transparent shadow-xs'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Mô tả</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveLeftTab('submissions')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                activeLeftTab === 'submissions'
                  ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white border border-slate-200 dark:border-transparent shadow-xs'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
            >
              <History className="h-3.5 w-3.5" />
              <span>Lịch sử nộp</span>
            </button>
          </div>

          {/* Left Panel Content */}
          <div className="flex-1 overflow-y-auto p-5 text-sm">
            {activeLeftTab === 'description' ? (
              <div className="space-y-4">
                {/* Meta Limits & Category */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-zinc-400 border-b border-slate-200 dark:border-zinc-800/60 pb-3">
                  <span className="rounded bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-transparent px-2 py-0.5 font-medium text-slate-700 dark:text-zinc-300">
                    {problem.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-400" />
                    <span>{problem.timeLimitMs || 1000} ms</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Cpu className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-400" />
                    <span>{((problem.memoryLimitKb || 262144) / 1024).toFixed(0)} MB</span>
                  </div>
                </div>

                {/* Markdown Description from Backend */}
                <MarkdownRenderer content={problem.descriptionMarkdown} />
              </div>
            ) : (
              /* Submissions History */
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-2">Lịch sử bài nộp:</div>
                <div className="rounded-lg border border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-[#121319] p-3 text-xs text-slate-500 dark:text-zinc-400">
                  Chưa có lượt nộp bài nào được ghi nhận cho bài toán này.
                </div>
              </div>
            )}
          </div>
        </div>


        {/* Right Pane: Monaco Editor + Console Drawer (7 Cols on LG) */}
        <div className="lg:col-span-7 flex flex-col h-full space-y-2 overflow-hidden">
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
        streakCount={user?.streak || 1}
      />
    </div>
  );
}
