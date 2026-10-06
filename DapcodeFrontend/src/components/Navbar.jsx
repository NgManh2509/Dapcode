import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  BookOpen, 
  Map, 
  CheckCircle2, 
  Search, 
  User, 
  LogOut,
  Sun,
  Moon,
  Flame
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

  const displayName = user?.username || user?.name || user?.email?.split('@')[0] || 'User';
  const displayStreak = user?.streakCount ?? user?.streak ?? 1;
  const initialLetter = displayName.charAt(0).toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#E8E4DC] dark:border-[#332F2B] bg-[#FDFBF7]/90 dark:bg-[#141312]/90 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Brand & Left Navigation */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/roadmap" 
              className="group flex items-center space-x-2.5 transition-transform active:scale-95"
            >
              <DapcodeLogo size="sm" />
              <div className="flex items-baseline space-x-1.5">
                <span className="text-base font-semibold tracking-tight text-[#1C1917] dark:text-[#F5F2EB]">
                  Dapcode
                </span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700 font-mono">
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
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'text-[#1C1917] bg-[#FAF8F3] dark:text-[#F5F2EB] dark:bg-[#24221F] font-semibold border border-[#E8E4DC] dark:border-[#332F2B]'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-[#FAF8F3] dark:text-stone-400 dark:hover:text-stone-200 dark:hover:bg-[#24221F]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Theme Toggle Button (Light / Dark) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-[#E8E4DC] dark:border-[#332F2B] bg-[#FAF8F3] dark:bg-[#24221F] text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title={isDark ? 'Chuyển sang nền sáng' : 'Chuyển sang nền tối'}
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-stone-300" />
              ) : (
                <Moon className="h-4 w-4 text-stone-700" />
              )}
            </button>

            {/* AI Tutor Feature Badge */}
            <div className="hidden sm:flex items-center space-x-1.5 rounded-lg bg-[#FAF8F3] border border-[#E8E4DC] dark:bg-[#24221F] dark:border-[#332F2B] px-2.5 py-1 text-xs text-stone-700 dark:text-stone-300">
              <Sparkles className="h-3.5 w-3.5 text-stone-500 dark:text-stone-400" />
              <span className="font-medium text-[11px]">Socratic AI</span>
            </div>

            {/* Daily Streak Trigger */}
            <button
              type="button"
              onClick={() => setIsStreakOpen(true)}
              className="flex items-center space-x-1.5 rounded-lg bg-[#FAF8F3] dark:bg-[#24221F] border border-[#E8E4DC] dark:border-[#332F2B] px-2.5 py-1 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title="Xem chuỗi streak luyện tập"
            >
              <Flame className="h-3.5 w-3.5 text-[#B45309] dark:text-[#FBBF24]" />
              <span className="font-mono text-[11px]">{displayStreak}</span>
            </button>

            {/* Quick Search Button (⌘K) */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex items-center space-x-2 rounded-lg bg-[#FAF8F3] dark:bg-[#24221F] border border-[#E8E4DC] dark:border-[#332F2B] px-3 py-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="text-[11px]">Tìm kiếm...</span>
              <kbd className="rounded bg-white dark:bg-[#1C1A18] border border-[#E8E4DC] dark:border-[#332F2B] px-1 py-0.2 text-[10px] text-stone-500 dark:text-stone-400 font-mono">⌘K</kbd>
            </button>

            {/* User Profile / Sign In */}
            {user ? (
              <div className="flex items-center space-x-1.5 pl-1">
                <div className="flex items-center space-x-2 bg-[#FAF8F3] dark:bg-[#24221F] border border-[#E8E4DC] dark:border-[#332F2B] py-1 px-2.5 rounded-lg text-xs">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={displayName}
                      referrerPolicy="no-referrer"
                      className="h-5 w-5 rounded-full object-cover border border-[#E8E4DC] dark:border-[#332F2B]"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className={`h-5 w-5 rounded-full bg-[#1C1917] dark:bg-[#F5F2EB] items-center justify-center text-[10px] font-medium text-white dark:text-[#1C1917] ${
                      user.avatarUrl ? 'hidden' : 'flex'
                    }`}
                  >
                    {initialLetter}
                  </div>
                  <span className="font-medium text-[#1C1917] dark:text-[#F5F2EB] hidden sm:inline max-w-[120px] truncate text-[11px]">
                    {displayName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Đăng xuất"
                  className="p-1.5 text-stone-500 hover:text-[#B91C1C] hover:bg-[#FAF8F3] dark:text-stone-400 dark:hover:text-[#F87171] dark:hover:bg-[#24221F] rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center space-x-1.5 rounded-lg bg-[#1C1917] hover:bg-[#2D2A26] dark:bg-[#F5F2EB] dark:hover:bg-[#E8E4DC] px-3.5 py-1.5 text-xs font-medium text-[#FAF8F3] dark:text-[#1C1917] transition-colors cursor-pointer"
              >
                <User className="h-3.5 w-3.5" />
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
        streakCount={displayStreak}
      />
    </>
  );
}
