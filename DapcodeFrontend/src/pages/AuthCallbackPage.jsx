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

        if (location.hash) {
          const hashParams = new URLSearchParams(location.hash.replace(/^#/, ''));
          idToken = hashParams.get('id_token');
        }

        if (!idToken && searchParams.has('id_token')) {
          idToken = searchParams.get('id_token');
        }

        if (!idToken) {
          throw new Error('Không tìm thấy Google ID Token trong URL phản hồi.');
        }

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
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] dark:bg-[#141312] p-4 text-[#1C1917] dark:text-[#F5F2EB]">
      <div className="w-full max-w-md rounded-2xl border border-[#E8E4DC] dark:border-[#332F2B] bg-[#FFFFFF] dark:bg-[#1C1A18] p-8 text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 text-stone-700 dark:text-stone-300 animate-spin" />
            <h2 className="text-sm font-semibold">Đang xác thực tài khoản Google...</h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Vui lòng đợi giây lát trong khi Dapcode đồng bộ tài khoản của bạn.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F0FDF4] dark:bg-[#14532D]/20 text-[#15803D] dark:text-[#4ADE80] border border-[#BBF7D0] dark:border-[#166534]/40">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h2 className="text-sm font-semibold">Đăng nhập thành công!</h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Đang chuyển hướng về trang học tập...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF2F2] dark:bg-[#7F1D1D]/20 text-[#B91C1C] dark:text-[#F87171] border border-[#FECACA] dark:border-[#991B1B]/40">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="text-sm font-semibold text-[#B91C1C] dark:text-[#F87171]">
              Đăng nhập thất bại
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">{errorMessage}</p>
            <button
              onClick={() => navigate('/roadmap', { replace: true })}
              className="mt-2 rounded-xl bg-[#1C1917] hover:bg-[#2D2A26] dark:bg-[#F5F2EB] dark:hover:bg-[#E8E4DC] px-4 py-2 text-xs font-medium text-[#FAF8F3] dark:text-[#1C1917] transition-colors"
            >
              Quay lại trang chủ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
