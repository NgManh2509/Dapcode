import React, { useState } from 'react';
import { X, Sparkles, User, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import api from '../api/client';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, promptMessage }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setErrorMsg(null);
    sessionStorage.setItem('dapcode_auth_return', window.location.pathname);
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const handleQuickDemoLogin = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.post('/auth/demo');
      const data = res?.data || res;
      if (data && data.token) {
        localStorage.setItem('dapcode_token', data.token);
        const userData = data.user || {
          name: 'LiệtCode Master',
          email: 'demo@lietcode.io',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          streak: 3,
          xp: 120,
        };
        localStorage.setItem('dapcode_user', JSON.stringify(userData));
        if (onLoginSuccess) onLoginSuccess(userData);
        onClose();
        return;
      }
    } catch {
      // Fallback local test session
      const demoUser = {
        name: 'LiệtCode Master',
        email: 'demo@lietcode.io',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        streak: 3,
        xp: 120,
      };
      localStorage.setItem('dapcode_user', JSON.stringify(demoUser));
      localStorage.setItem('dapcode_token', 'demo_jwt_token');
      if (onLoginSuccess) onLoginSuccess(demoUser);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminDemoLogin = () => {
    setIsLoading(true);
    const adminUser = {
      id: '00000000-0000-0000-0000-000000000001',
      username: 'lietcode_admin',
      name: 'LiệtCode Admin',
      email: 'admin@lietcode.io',
      role: 'ROLE_ADMIN',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=dapcode_admin',
      streak: 30,
      xp: 9999,
    };
    localStorage.setItem('dapcode_user', JSON.stringify(adminUser));
    localStorage.setItem('dapcode_token', 'demo_admin_jwt_token');
    if (onLoginSuccess) onLoginSuccess(adminUser);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-sm rounded-2xl border border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#FFFFFF] dark:bg-[#282828] p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-neutral-400 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-[#F7F8FA] dark:hover:bg-[#333333] transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Brand Header */}
        <div className="text-center mb-5">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#262626] dark:bg-[#EFF1F6] text-white dark:text-[#262626]">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-[#262626] dark:text-[#EFF1F6] tracking-tight">
            Đăng nhập vào LiệtCode
          </h2>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Lưu chuỗi streak, lịch sử nộp bài và nhận phản hồi AI Tutor không giới hạn.
          </p>
        </div>

        {/* Action Prompt Banner if opened from submit/run/ai */}
        {promptMessage && (
          <div className="mb-4 rounded-xl border border-[#FFD98A] dark:border-[#B36B00]/40 bg-[#FFF6E5] dark:bg-[#78350F]/20 p-3 text-xs text-[#FFA116] dark:text-[#FFC01E] flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{promptMessage}</span>
          </div>
        )}

        {/* Error Banner if login fails */}
        {errorMsg && (
          <div className="mb-4 rounded-xl border border-[#FECACA] dark:border-[#991B1B]/40 bg-[#FDEDED] dark:bg-[#7F1D1D]/20 p-3 text-xs text-[#EF4743] dark:text-[#FF6B68] flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Google Login Button */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center space-x-3 rounded-xl border border-[#E6E6E6] dark:border-[#3E3E3E] bg-white hover:bg-[#F7F8FA] dark:bg-[#333333] dark:hover:bg-neutral-800 py-2.5 px-4 text-xs font-medium text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-neutral-500" />
            ) : (
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
            )}
            <span>Tiếp tục với Google</span>
          </button>

          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-[#E6E6E6] dark:border-[#3E3E3E] w-full" />
            <span className="bg-white dark:bg-[#282828] px-2 text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-medium">
              hoặc
            </span>
          </div>

          {/* Quick Demo Login */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleQuickDemoLogin}
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#262626] hover:bg-[#3C3C3C] dark:bg-[#EFF1F6] dark:hover:bg-[#E6E6E6] disabled:opacity-50 py-2.5 px-4 text-xs font-medium text-[#F7F8FA] dark:text-[#262626] transition-colors cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-white dark:text-[#262626]" />
            ) : (
              <User className="h-4 w-4" />
            )}
            <span>Đăng nhập nhanh (Guest / Demo)</span>
          </button>

          {/* Quick Admin Login for Dev/Testing */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleAdminDemoLogin}
            className="flex w-full items-center justify-center space-x-2 rounded-xl border border-[#FFA116]/40 bg-[#FFA116]/10 hover:bg-[#FFA116]/20 py-2.5 px-4 text-xs font-semibold text-[#FFA116] transition-colors cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4 text-[#FFA116]" />
            <span>Đăng nhập quyền Admin (Dev / Test)</span>
          </button>
        </div>

        <div className="mt-5 flex items-center justify-center space-x-1.5 text-[11px] text-neutral-400 dark:text-neutral-500">
          <ShieldCheck className="h-3.5 w-3.5 text-[#2CBB5D] dark:text-[#2CBB5D]" />
          <span>Bảo mật an toàn qua JWT & Spring Security</span>
        </div>
      </div>
    </div>
  );
}
