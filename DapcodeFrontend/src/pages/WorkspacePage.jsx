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
  List,
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
      <div className="flex h-screen w-screen items-center justify-center bg-[#FFFFFF] dark:bg-[#1A1A1A] text-neutral-600 dark:text-neutral-400 font-sans">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-800 dark:border-neutral-200 border-t-transparent" />
          <p className="text-xs">Đang tải đề bài từ Database...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !problem) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#FFFFFF] dark:bg-[#1A1A1A] text-neutral-800 dark:text-neutral-200 font-sans p-4 space-y-4">
        <AlertCircle className="h-8 w-8 text-[#EF4743]" />
        <h2 className="text-base font-semibold text-[#262626] dark:text-[#EFF1F6]">Không thể tải bài tập</h2>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-md text-center">{fetchError || 'Bài tập không tồn tại trong hệ thống.'}</p>
        <Link
          to="/roadmap"
          className="rounded-lg bg-[#262626] dark:bg-[#EFF1F6] px-4 py-2 text-xs font-medium text-[#F7F8FA] dark:text-[#262626] transition-colors"
        >
          Quay lại Roadmap
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#F0F0F0] dark:bg-[#1A1A1A] text-[#262626] dark:text-[#EFF1F6] overflow-hidden">
      <header className="flex h-[50px] items-center justify-between border-b border-[#E6E6E6] dark:border-[#3E3E3E] bg-white dark:bg-[#282828] px-3 flex-shrink-0">
        <div className="flex items-center space-x-2 min-w-0">
          <Link to="/roadmap" className="flex items-center space-x-2 pr-2" title="LiệtCode Roadmap">
            <DapcodeLogo size="sm" />
          </Link>

          <Link
            to="/practice"
            className="flex items-center space-x-1.5 rounded-md px-2.5 py-1.5 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-[#F0F0F0] dark:hover:bg-[#333333] transition-colors"
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Problem List</span>
          </Link>

          <div className="flex items-center">
            <button
              type="button"
              disabled={!prevProblem}
              onClick={() => prevProblem && navigate(`/problems/${prevProblem.slug}`)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-[#F0F0F0] dark:hover:bg-[#333333] disabled:opacity-30 transition-colors cursor-pointer"
              title={prevProblem ? `Previous: ${prevProblem.title}` : 'No previous problem'}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={!nextProblem}
              onClick={() => nextProblem && navigate(`/problems/${nextProblem.slug}`)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-[#F0F0F0] dark:hover:bg-[#333333] disabled:opacity-30 transition-colors cursor-pointer"
              title={nextProblem ? `Next: ${nextProblem.title}` : 'No next problem'}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={handleOpenAiTutor}
            className="flex h-8 items-center space-x-1.5 rounded-md bg-[#FFA116]/15 px-3 text-sm font-medium text-[#FFA116] hover:bg-[#FFA116]/25 transition-colors cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">AI Tutor</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-[#F0F0F0] dark:hover:bg-[#333333] transition-colors cursor-pointer"
            title="Tìm kiếm (Ctrl+K)"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>

          <button
            type="button"
            onClick={() => setIsStreakOpen(true)}
            className="flex h-8 items-center space-x-1 rounded-md px-2 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-[#F0F0F0] dark:hover:bg-[#333333] transition-colors cursor-pointer"
            title="Chuỗi streak"
          >
            <Flame className="h-[18px] w-[18px] text-[#FFA116]" />
            <span className="font-medium">{user?.streakCount ?? user?.streak ?? 0}</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-[#F0F0F0] dark:hover:bg-[#333333] transition-colors cursor-pointer"
            title={isDark ? 'Chế độ sáng' : 'Chế độ tối'}
          >
            {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>

          {user ? (
            <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full overflow-hidden bg-[#FFA116] text-white text-sm font-semibold">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.username || 'User'}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              ) : (
                (user.username || user.name || user.email || 'U').charAt(0).toUpperCase()
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthOpen(true)}
              className="ml-1 flex h-8 items-center space-x-1.5 rounded-md px-3 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-[#F0F0F0] dark:hover:bg-[#333333] transition-colors cursor-pointer"
            >
              <User className="h-4 w-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Split-Pane Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 p-2 overflow-hidden">
        <div className="lg:col-span-5 flex flex-col rounded-lg bg-[#FFFFFF] dark:bg-[#282828] overflow-hidden h-full">
          <div className="flex h-10 items-center border-b border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#F7F8FA] dark:bg-[#333333] px-2 space-x-1">
            <button
              type="button"
              onClick={() => setActiveLeftTab('description')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer ${
                activeLeftTab === 'description'
                  ? 'text-[#262626] dark:text-[#EFF1F6] font-medium bg-white dark:bg-[#282828]'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Mô tả</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveLeftTab('submissions')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer ${
                activeLeftTab === 'submissions'
                  ? 'text-[#262626] dark:text-[#EFF1F6] font-medium bg-white dark:bg-[#282828]'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
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
                <h1 className="text-xl font-semibold text-[#262626] dark:text-[#EFF1F6]">
                  {currentIndex >= 0 ? `${currentIndex + 1}. ` : ''}
                  {problem.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <DifficultyBadge difficulty={problem.difficulty} />
                  <span className="rounded-full bg-[#F0F0F0] dark:bg-[#333333] px-3 py-1 font-medium text-neutral-600 dark:text-neutral-300">
                    {problem.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5 text-neutral-400" />
                    <span>{problem.timeLimitMs || 1000} ms</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Cpu className="h-3.5 w-3.5 text-neutral-400" />
                    <span>{((problem.memoryLimitKb || 262144) / 1024).toFixed(0)} MB</span>
                  </div>
                </div>

                {/* Markdown Description */}
                <MarkdownRenderer content={problem.descriptionMarkdown} />
              </div>
            ) : (
              /* Submissions History */
              <div className="space-y-3">
                <div className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2">Lịch sử bài nộp:</div>
                <div className="rounded-lg border border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#F7F8FA] dark:bg-[#333333] p-3 text-xs text-neutral-500 dark:text-neutral-400">
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
