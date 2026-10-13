import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Loader2,
  ArrowLeft,
  User,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Sparkles,
  KeyRound,
} from 'lucide-react';
import { getCurrentUser, loginAdmin } from '../api/auth';
import DapcodeLogo from './DapcodeLogo';

export default function AdminRoute({ children }) {
  const [state, setState] = useState('checking'); // 'checking' | 'ok' | 'denied'
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const checkAdminAuth = () => {
    let localUser = null;
    try {
      localUser = JSON.parse(localStorage.getItem('dapcode_user') || 'null');
    } catch {
      localUser = null;
    }
    setCurrentUser(localUser);

    const token = localStorage.getItem('dapcode_token');
    if (!token && !localUser) {
      setState('denied');
      return;
    }

    getCurrentUser()
      .then((res) => {
        const u = res?.data || res;
        if (u) {
          const merged = { ...localUser, ...u };
          localStorage.setItem('dapcode_user', JSON.stringify(merged));
          setCurrentUser(merged);
        }
        if (u?.role === 'ROLE_ADMIN') {
          setState('ok');
        } else {
          setState('denied');
        }
      })
      .catch(() => {
        if (localUser?.role === 'ROLE_ADMIN') {
          setState('ok');
        } else {
          setState('denied');
        }
      });
  };

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const handlePasswordLogin = async (e) => {
    if (e) e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await loginAdmin(username.trim(), password.trim());
      const data = res?.data || res;

      if (data && data.token) {
        localStorage.setItem('dapcode_token', data.token);
        const userObj = data.user || {
          username: username.trim(),
          email: 'admin@dapcode.io',
          role: 'ROLE_ADMIN',
        };
        localStorage.setItem('dapcode_user', JSON.stringify(userObj));
        setCurrentUser(userObj);
        setIsLoading(false);
        setState('ok');
        return;
      }
      throw new Error('Không nhận được token xác thực quản trị viên.');
    } catch (err) {
      console.error('Lỗi đăng nhập admin:', err);
      // Fallback dev mock login if server returned error or backend offline
      if (
        (username === 'admin' || username === 'dapcode_admin') &&
        (password === 'admin123' || password === 'admin')
      ) {
        const adminUser = {
          id: '0529d450-19bc-4762-931b-28c7daf3d6ec',
          username: 'dapcode_admin',
          name: 'LiệtCode Admin',
          email: 'admin@lietcode.io',
          role: 'ROLE_ADMIN',
          avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=dapcode_admin',
          streak: 30,
          xp: 9999,
        };
        localStorage.setItem('dapcode_user', JSON.stringify(adminUser));
        localStorage.setItem('dapcode_token', 'demo_admin_jwt_token');
        setCurrentUser(adminUser);
        setIsLoading(false);
        setState('ok');
        return;
      }

      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Tài khoản hoặc mật khẩu không chính xác. Bạn có thể thử tài khoản mặc định: admin / admin123';
      setErrorMessage(msg);
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('admin123');
    setErrorMessage('');
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setErrorMessage('');
    sessionStorage.setItem('dapcode_auth_return', window.location.pathname);
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const handleAdminDemoLogin = () => {
    setIsLoading(true);
    setErrorMessage('');
    const adminUser = {
      id: '0529d450-19bc-4762-931b-28c7daf3d6ec',
      username: 'dapcode_admin',
      name: 'LiệtCode Admin',
      email: 'admin@lietcode.io',
      role: 'ROLE_ADMIN',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=dapcode_admin',
      streak: 30,
      xp: 9999,
    };
    localStorage.setItem('dapcode_user', JSON.stringify(adminUser));
    localStorage.setItem('dapcode_token', 'demo_admin_jwt_token');
    setCurrentUser(adminUser);
    setIsLoading(false);
    setState('ok');
  };

  const handleLogoutOtherAccount = () => {
    localStorage.removeItem('dapcode_user');
    localStorage.removeItem('dapcode_token');
    setCurrentUser(null);
    setErrorMessage('');
    setState('denied');
  };

  if (state === 'checking') {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F0F0F0] dark:bg-[#1A1A1A]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#FFA116]" />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Đang xác thực quyền Quản trị viên...
          </p>
        </div>
      </div>
    );
  }

  // Once authenticated with ROLE_ADMIN, render the full admin menu and layout
  if (state === 'ok') {
    return children;
  }

  // Giao diện Modal Đăng Nhập Quản Trị Viên riêng biệt tại URL Admin
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0F0F0F] p-4 text-[#262626] dark:text-[#EFF1F6]">
      {/* Background ambient pattern & glowing spotlight */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#FFA116_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#FFA116]/10 blur-[120px]" />

      {/* Admin Login Modal Container */}
      <div className="relative w-full max-w-md rounded-2xl border border-[#3E3E3E] bg-[#1E1E1E] p-7 shadow-2xl backdrop-blur-md">
        {/* Header Branding */}
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-13 w-13 items-center justify-center rounded-2xl border border-[#FFA116]/30 bg-[#FFA116]/15 text-[#FFA116] shadow-inner">
            <Shield className="h-7 w-7" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <DapcodeLogo size="sm" />
            <span className="text-lg font-bold tracking-tight text-white">LiệtCode</span>
            <span className="rounded-md border border-[#FFA116]/30 bg-[#FFA116]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FFA116]">
              Admin Portal
            </span>
          </div>
          <h2 className="mt-2 text-base font-semibold text-white">
            Đăng nhập Quản trị viên
          </h2>
          <p className="mt-1 text-xs text-neutral-400">
            Khu vực quản lý bài tập, bài học lý thuyết, test case và danh sách học viên.
          </p>
        </div>

        {/* Warning if logged in as regular student */}
        {currentUser && currentUser.role !== 'ROLE_ADMIN' && (
          <div className="mt-4 rounded-xl border border-[#EF4743]/30 bg-[#EF4743]/10 p-3 text-xs text-[#FF6B68]">
            <div className="flex items-start gap-2">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <div>
                  Đang đăng nhập với: <strong>{currentUser.username || currentUser.email}</strong>
                </div>
                <div className="mt-0.5 text-[11px] opacity-90">
                  Tài khoản này có vai trò học viên (<code className="font-mono">ROLE_USER</code>) và không thể vào trang Quản trị.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogoutOtherAccount}
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#EF4743]/40 bg-black/30 py-1.5 text-xs font-medium text-[#FF8583] hover:bg-black/50 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Đăng xuất tài khoản này để đăng nhập Admin</span>
            </button>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="mt-4 rounded-xl border border-[#EF4743]/30 bg-[#EF4743]/10 p-3 text-xs text-[#FF6B68] flex items-start gap-2">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Username & Password Form */}
        <form onSubmit={handlePasswordLogin} className="mt-5 space-y-3">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Tài khoản / Email Quản trị
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin hoặc admin@dapcode.io"
                className="w-full rounded-xl border border-[#3E3E3E] bg-[#2A2A2A] py-2.5 pl-9 pr-3 text-xs text-white placeholder-neutral-500 focus:border-[#FFA116] focus:outline-none focus:ring-1 focus:ring-[#FFA116]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-neutral-300">
                Mật khẩu
              </label>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[11px] text-[#FFA116] hover:underline cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="h-3 w-3" />
                <span>Điền mẫu (admin / admin123)</span>
              </button>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#3E3E3E] bg-[#2A2A2A] py-2.5 pl-9 pr-9 text-xs text-white placeholder-neutral-500 focus:border-[#FFA116] focus:outline-none focus:ring-1 focus:ring-[#FFA116]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-500 hover:text-neutral-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFA116] hover:bg-[#FFA116]/90 py-2.5 px-4 text-xs font-bold text-black shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-black" />
            ) : (
              <KeyRound className="h-4 w-4 text-black" />
            )}
            <span>Đăng nhập vào Menu Admin</span>
          </button>
        </form>

        {/* Separator */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="w-full border-t border-[#3E3E3E]" />
          <span className="bg-[#1E1E1E] px-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
            hoặc phương thức khác
          </span>
        </div>

        {/* Google OAuth & Quick Dev Mode */}
        <div className="space-y-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#3E3E3E] bg-[#262626] hover:bg-[#333333] py-2 px-4 text-xs font-medium text-neutral-200 transition-colors cursor-pointer"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Đăng nhập Google (Tài khoản đã phân quyền Admin)</span>
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleAdminDemoLogin}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#FFA116]/30 bg-[#FFA116]/10 hover:bg-[#FFA116]/20 py-2 px-4 text-xs font-medium text-[#FFA116] transition-colors cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Đăng nhập nhanh Admin (Dev Mock)</span>
          </button>
        </div>

        {/* Back to student page link */}
        <div className="mt-5 border-t border-[#3E3E3E] pt-3 text-center">
          <Link
            to="/roadmap"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Quay lại trang học viên (Roadmap)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
