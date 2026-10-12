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
    <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF] dark:bg-[#1A1A1A] p-4 text-[#262626] dark:text-[#EFF1F6]">
      <div className="w-full max-w-md rounded-lg border border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#FFFFFF] dark:bg-[#282828] p-8 text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 text-neutral-700 dark:text-neutral-300 animate-spin" />
            <h2 className="text-sm font-semibold">Đang xác thực tài khoản Google...</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Vui lòng đợi giây lát trong khi Dapcode đồng bộ tài khoản của bạn.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F7EE] dark:bg-[#14532D]/20 text-[#2CBB5D] dark:text-[#2CBB5D] border border-[#B7E4C7] dark:border-[#166534]/40">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h2 className="text-sm font-semibold">Đăng nhập thành công!</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Đang chuyển hướng về trang học tập...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FDEDED] dark:bg-[#7F1D1D]/20 text-[#EF4743] dark:text-[#FF6B68] border border-[#FECACA] dark:border-[#991B1B]/40">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="text-sm font-semibold text-[#EF4743] dark:text-[#FF6B68]">
              Đăng nhập thất bại
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{errorMessage}</p>
            <button
              onClick={() => navigate('/roadmap', { replace: true })}
              className="mt-2 rounded-lg bg-[#262626] hover:bg-[#3C3C3C] dark:bg-[#EFF1F6] dark:hover:bg-[#E6E6E6] px-4 py-2 text-xs font-medium text-[#F7F8FA] dark:text-[#262626] transition-colors"
            >
              Quay lại trang chủ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
