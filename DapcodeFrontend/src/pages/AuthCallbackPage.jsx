import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginWithGoogle, getCurrentUser } from '../api/auth';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 0. Check Spring Boot Backend JWT: ?token=...
        const searchParams = new URLSearchParams(location.search);
        const jwtToken = searchParams.get('token');
        if (jwtToken) {
          localStorage.setItem('dapcode_token', jwtToken);
          try {
            const userRes = await getCurrentUser();
            let userData = userRes?.data || userRes;
            if (userData && userData.data && typeof userData.data === 'object') {
              userData = userData.data;
            }
            if (userData) {
              if (!userData.name && userData.username) userData.name = userData.username;
              localStorage.setItem('dapcode_user', JSON.stringify(userData));
            }
          } catch (e) {
            console.warn('Không thể tải profile ngay:', e);
          }
          setStatus('success');
          const returnUrl = sessionStorage.getItem('dapcode_auth_return') || '/roadmap';
          sessionStorage.removeItem('dapcode_auth_return');
          setTimeout(() => {
            navigate(returnUrl, { replace: true });
            window.location.reload();
          }, 600);
          return;
        }

        let idToken = null;

        // 1. Check URL Hash: #id_token=...
        if (location.hash) {
          const hashParams = new URLSearchParams(location.hash.replace(/^#/, ''));
          idToken = hashParams.get('id_token');
        }

        // 2. Check Query Params: ?id_token=...
        if (!idToken && searchParams.has('id_token')) {
          idToken = searchParams.get('id_token');
        }

        if (!idToken) {
          throw new Error('Không tìm thấy Google ID Token trong URL phản hồi.');
        }

        // Send idToken to Spring Boot Backend
        const res = await loginWithGoogle(idToken);
        const data = (res && res.data && res.data.token) ? res.data : (res?.data || res);

        if (data && data.token) {
          localStorage.setItem('dapcode_token', data.token);
          if (data.user) {
            const userObj = { ...data.user };
            if (!userObj.name && userObj.username) userObj.name = userObj.username;
            localStorage.setItem('dapcode_user', JSON.stringify(userObj));
          }
          setStatus('success');
          
          const returnUrl = sessionStorage.getItem('dapcode_auth_return') || '/roadmap';
          sessionStorage.removeItem('dapcode_auth_return');
          setTimeout(() => {
            navigate(returnUrl, { replace: true });
            window.location.reload();
          }, 800);
        } else {
          throw new Error('Phản hồi từ máy chủ không hợp lệ.');
        }
      } catch (err) {
        console.error('Lỗi xác thực OAuth:', err);
        setStatus('error');
        setErrorMessage(
          err.response?.data?.message || err.message || 'Xác thực Google thất bại. Vui lòng thử lại.'
        );
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0d0e15] p-4 text-slate-800 dark:text-white">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#161722] p-8 shadow-xl text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
            <h2 className="text-base font-semibold">Đang xác thực tài khoản Google...</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Vui lòng đợi giây lát trong khi Dapcode đồng bộ tài khoản của bạn.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h2 className="text-base font-semibold">Đăng nhập thành công!</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Đang chuyển hướng về trang học tập...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="text-base font-semibold text-rose-600 dark:text-rose-400">
              Đăng nhập thất bại
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">{errorMessage}</p>
            <button
              onClick={() => navigate('/roadmap', { replace: true })}
              className="mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors"
            >
              Quay lại trang chủ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
