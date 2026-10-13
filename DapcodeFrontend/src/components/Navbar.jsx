import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Flame, Sun, Moon, LogOut, User, Shield } from 'lucide-react';
import SearchModal from './SearchModal';
import AuthModal from './AuthModal';
import StreakModal from './StreakModal';
import DapcodeLogo from './DapcodeLogo';
import { useTheme } from '../context/ThemeContext';

const NAV_LINKS = [
  { label: 'Roadmap', path: '/roadmap' },
  { label: 'Problems', path: '/practice', alt: '/problems' },
  { label: 'Theories', path: '/theories' },
];

export default function Navbar() {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isStreakOpen, setIsStreakOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dapcode_user') || 'null');
    } catch {
      return null;
    }
  });

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

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('dapcode_user');
    localStorage.removeItem('dapcode_token');
    setUser(null);
    setIsMenuOpen(false);
  };

  const displayName = user?.username || user?.name || user?.email?.split('@')[0] || 'User';
  const displayStreak = user?.streakCount ?? user?.streak ?? 0;
  const initialLetter = displayName.charAt(0).toUpperCase();

  const iconBtn =
    'flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-[#F0F0F0] dark:hover:bg-[#333333] hover:text-[#262626] dark:hover:text-[#EFF1F6] transition-colors cursor-pointer';

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#E6E6E6] dark:border-[#3E3E3E] bg-white dark:bg-[#282828]">
        <div className="mx-auto flex h-[50px] max-w-[1300px] items-center justify-between px-4">
          <div className="flex items-center space-x-6">
            <Link to="/roadmap" className="flex items-center space-x-2">
              <DapcodeLogo size="sm" />
              <span className="text-base font-bold tracking-tight text-[#262626] dark:text-[#EFF1F6] hidden sm:inline">
                LiệtCode
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              {NAV_LINKS.map((item) => {
                const isActive = location.pathname === item.path || location.pathname === item.alt;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                      isActive
                        ? 'text-[#262626] dark:text-[#EFF1F6] font-medium'
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-[#262626] dark:hover:text-[#EFF1F6]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-1">
            <button type="button" onClick={() => setIsSearchOpen(true)} className={iconBtn} title="Tìm kiếm (Ctrl+K)">
              <Search className="h-[18px] w-[18px]" />
            </button>

            <button
              type="button"
              onClick={() => setIsStreakOpen(true)}
              className="flex h-8 items-center space-x-1 rounded-md px-2 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-[#F0F0F0] dark:hover:bg-[#333333] transition-colors cursor-pointer"
              title="Chuỗi streak"
            >
              <Flame className="h-[18px] w-[18px] text-[#FFA116]" />
              <span className="font-medium">{displayStreak}</span>
            </button>

            <button type="button" onClick={toggleTheme} className={iconBtn} title={isDark ? 'Chế độ sáng' : 'Chế độ tối'}>
              {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </button>

            {user ? (
              <div className="relative ml-2" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen((v) => !v)}
                  className="flex h-8 w-8 items-center justify-center rounded-full overflow-hidden bg-[#FFA116] text-white text-sm font-semibold cursor-pointer"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={displayName}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initialLetter
                  )}
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg border border-[#E6E6E6] dark:border-[#3E3E3E] bg-white dark:bg-[#282828] shadow-lg py-1">
                    <div className="px-4 py-3 border-b border-[#E6E6E6] dark:border-[#3E3E3E]">
                      <div className="text-sm font-medium text-[#262626] dark:text-[#EFF1F6] truncate">{displayName}</div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{user.email}</div>
                    </div>
                    <div className="flex items-center justify-between px-4 py-2 text-xs text-neutral-500 dark:text-neutral-400">
                      <span>XP</span>
                      <span className="font-medium text-[#262626] dark:text-[#EFF1F6]">{user.xp ?? 0}</span>
                    </div>
                    {user.role === 'ROLE_ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-[#FFA116] hover:bg-[#FFA116]/10 cursor-pointer font-medium"
                      >
                        <Shield className="h-4 w-4" />
                        <span>Trang Quản trị (Admin)</span>
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-[#F7F8FA] dark:hover:bg-[#333333] cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
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
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLoginSuccess={(u) => setUser(u)} />
      <StreakModal isOpen={isStreakOpen} onClose={() => setIsStreakOpen(false)} streakCount={displayStreak} />
    </>
  );
}
