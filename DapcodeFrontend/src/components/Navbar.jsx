import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Code2, 
  Flame, 
  Sparkles, 
  BookOpen, 
  Map, 
  CheckCircle2, 
  Search, 
  User, 
  LogOut,
  Sun,
  Moon 
} from 'lucide-react';
import SearchModal from './SearchModal';
import AuthModal from './AuthModal';
import StreakModal from './StreakModal';
import DapcodeLogo from './DapcodeLogo';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isStreakOpen, setIsStreakOpen] = useState(false);

  // User state from localStorage
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dapcode_user') || 'null');
    } catch {
      return null;
    }
  });

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

  const handleLogout = () => {
    localStorage.removeItem('dapcode_user');
    localStorage.removeItem('dapcode_token');
    setUser(null);
  };

  const navLinks = [
    { label: 'Roadmap', path: '/roadmap', icon: Map },
    { label: 'Practice', path: '/practice', icon: CheckCircle2 },
    { label: 'Theories', path: '/theories', icon: BookOpen },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-zinc-800/80 bg-white/95 dark:bg-[#0f0f11]/90 backdrop-blur-md transition-colors shadow-xs">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Brand & Left Navigation */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/roadmap" 
              className="group flex items-center space-x-2.5 transition-transform active:scale-95"
            >
              <DapcodeLogo size="md" />
              <div className="flex items-baseline space-x-1.5">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Dapcode
                </span>
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/30 dark:bg-amber-400/10 dark:text-amber-400 dark:border-amber-400/20 font-mono">
                  v1.0
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-indigo-600 bg-indigo-50 dark:text-white dark:bg-zinc-800/70 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/40'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {/* Theme Toggle Button (Light / Dark) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:border-indigo-400 transition-all cursor-pointer shadow-xs"
              title={isDark ? 'Chuyển sang nền sáng' : 'Chuyển sang nền tối'}
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-amber-400 animate-spin-once" />
              ) : (
                <Moon className="h-4 w-4 text-indigo-600" />
              )}
            </button>

            {/* AI Tutor Feature Badge */}
            <div className="hidden sm:flex items-center space-x-1.5 rounded-full bg-indigo-50 border border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-500/30 px-3 py-1 text-xs text-indigo-600 dark:text-indigo-300">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400 animate-pulse" />
              <span className="font-medium">Socratic AI Active</span>
            </div>

            {/* Daily Streak Trigger */}
            <button
              type="button"
              onClick={() => setIsStreakOpen(true)}
              className="flex items-center space-x-1.5 rounded-md bg-amber-50 dark:bg-zinc-900 border border-amber-200 dark:border-zinc-800 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:border-amber-400 transition-all shadow-xs active:scale-95 cursor-pointer"
              title="Xem chuỗi streak luyện tập"
            >
              <Flame className="h-4 w-4 text-amber-500 fill-amber-500/30" />
              <span>{user?.streak || 1}</span>
            </button>

            {/* Quick Search Button (⌘K) */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex items-center space-x-2 rounded-md bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 px-3 py-1.5 text-xs text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors cursor-pointer"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Tìm kiếm bài tập...</span>
              <kbd className="rounded bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 px-1.5 py-0.5 text-[10px] text-slate-500 dark:text-zinc-400 font-mono">⌘K</kbd>
            </button>

            {/* User Profile / Sign In */}
            {user ? (
              <div className="flex items-center space-x-2 pl-1">
                <div className="flex items-center space-x-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 py-1 px-2.5 rounded-lg text-xs">
                  <div className="h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <span className="font-medium text-slate-800 dark:text-zinc-200 hidden sm:inline">{user.name}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Đăng xuất"
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-rose-400 dark:hover:bg-zinc-800 rounded-md transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center space-x-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-slate-800 dark:border-zinc-700/60 px-3.5 py-1.5 text-xs font-semibold text-white transition-all active:scale-95 shadow-xs cursor-pointer"
              >
                <User className="h-3.5 w-3.5 text-slate-300 dark:text-zinc-400" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Global Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(u) => setUser(u)}
      />
      <StreakModal
        isOpen={isStreakOpen}
        onClose={() => setIsStreakOpen(false)}
        streakCount={user?.streak || 1}
      />
    </>
  );
}
