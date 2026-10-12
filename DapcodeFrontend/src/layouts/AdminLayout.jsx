import React from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileCode2,
  FlaskConical,
  BookOpen,
  Users,
  ArrowLeft,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react';
import DapcodeLogo from '../components/DapcodeLogo';
import { ToastProvider } from '../components/admin/AdminUi';
import { useTheme } from '../context/ThemeContext';

const NAV = [
  { to: '/admin', label: 'Tổng quan', icon: LayoutDashboard, end: true },
  { to: '/admin/problems', label: 'Bài tập', icon: FileCode2 },
  { to: '/admin/testcases', label: 'Test case', icon: FlaskConical },
  { to: '/admin/theories', label: 'Bài giảng', icon: BookOpen },
  { to: '/admin/users', label: 'Học viên', icon: Users },
];

export default function AdminLayout() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  let me = null;
  try {
    me = JSON.parse(localStorage.getItem('dapcode_user') || 'null');
  } catch {
    me = null;
  }
  const name = me?.username || me?.name || me?.email?.split('@')[0] || 'Admin';

  const logout = () => {
    localStorage.removeItem('dapcode_user');
    localStorage.removeItem('dapcode_token');
    navigate('/roadmap');
  };

  const linkCls = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
      isActive
        ? 'bg-[#F0F0F0] font-medium text-[#262626] dark:bg-[#333333] dark:text-[#EFF1F6]'
        : 'text-neutral-500 hover:bg-[#F7F8FA] hover:text-[#262626] dark:text-neutral-400 dark:hover:bg-[#303030] dark:hover:text-[#EFF1F6]'
    }`;

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-[#F0F0F0] text-[#262626] dark:bg-[#1A1A1A] dark:text-[#EFF1F6]">
        <aside className="sticky top-0 flex h-screen w-14 shrink-0 flex-col border-r border-[#E6E6E6] bg-white dark:border-[#3E3E3E] dark:bg-[#282828] md:w-60">
          <Link to="/admin" className="flex h-[50px] items-center gap-2 border-b border-[#E6E6E6] px-3 dark:border-[#3E3E3E]">
            <DapcodeLogo size="sm" />
            <div className="hidden items-baseline gap-1.5 md:flex">
              <span className="text-base font-semibold tracking-tight">Dapcode</span>
              <span className="rounded bg-[#FFA116]/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[#FFA116]">
                Admin
              </span>
            </div>
          </Link>

          <nav className="flex-1 space-y-1 p-2">
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.to} to={item.to} end={item.end} className={linkCls} title={item.label}>
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  <span className="hidden md:inline">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="space-y-1 border-t border-[#E6E6E6] p-2 dark:border-[#3E3E3E]">
            <Link to="/roadmap" className={linkCls({ isActive: false })} title="Về trang học viên">
              <ArrowLeft className="h-[18px] w-[18px] shrink-0" />
              <span className="hidden md:inline">Trang học viên</span>
            </Link>
            <button type="button" onClick={toggleTheme} className={`${linkCls({ isActive: false })} w-full cursor-pointer`}>
              {isDark ? <Sun className="h-[18px] w-[18px] shrink-0" /> : <Moon className="h-[18px] w-[18px] shrink-0" />}
              <span className="hidden md:inline">{isDark ? 'Chế độ sáng' : 'Chế độ tối'}</span>
            </button>
            <div className="flex items-center gap-2 rounded-lg px-3 py-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#FFA116] text-xs font-semibold text-white">
                {me?.avatarUrl ? (
                  <img src={me.avatarUrl} alt={name} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                ) : (
                  name.charAt(0).toUpperCase()
                )}
              </div>
              <span className="hidden flex-1 truncate text-sm md:inline">{name}</span>
              <button type="button" onClick={logout} title="Đăng xuất" className="hidden cursor-pointer text-neutral-400 hover:text-[#EF4743] md:inline">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-6">
          <div className="mx-auto max-w-[1200px]">
            <Outlet />
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
