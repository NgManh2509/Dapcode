import React, { useState, useEffect } from 'react';
import { ShieldAlert, X, AlertTriangle, Mail } from 'lucide-react';

export default function BannedModal() {
  const [banInfo, setBanInfo] = useState(null);

  useEffect(() => {
    const checkStoredBan = () => {
      try {
        const raw = sessionStorage.getItem('dapcode_ban_info');
        if (raw) {
          const parsed = JSON.parse(raw);
          sessionStorage.removeItem('dapcode_ban_info');
          setBanInfo({
            reason: parsed?.reason || 'Vi phạm quy định và điều khoản sử dụng của hệ thống.',
            email: parsed?.email || null,
          });
        }
      } catch {
        sessionStorage.removeItem('dapcode_ban_info');
      }
    };

    checkStoredBan();

    const handleBannedEvent = (e) => {
      const detail = e?.detail || {};
      setBanInfo({
        reason: detail.reason || 'Vi phạm quy định và điều khoản sử dụng của hệ thống.',
        email: detail.email || null,
      });
    };

    window.addEventListener('dapcode-user-banned', handleBannedEvent);
    return () => window.removeEventListener('dapcode-user-banned', handleBannedEvent);
  }, []);

  if (!banInfo) return null;

  const handleClose = () => {
    setBanInfo(null);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 dark:bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[#FECACA] dark:border-[#991B1B]/60 bg-[#FFFFFF] dark:bg-[#282828] p-6 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-[#F7F8FA] dark:hover:bg-[#333333] transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FDEDED] dark:bg-[#7F1D1D]/30 border border-[#FECACA] dark:border-[#991B1B]/50 text-[#EF4743] dark:text-[#FF6B68]">
            <ShieldAlert className="h-7 w-7" />
          </div>

          <h2 className="text-lg font-bold text-[#262626] dark:text-[#EFF1F6]">
            Tài khoản của bạn đã bị khóa
          </h2>

          {banInfo.email && (
            <p className="mt-1 text-xs font-mono text-neutral-500 dark:text-neutral-400">
              {banInfo.email}
            </p>
          )}

          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Hệ thống đã từ chối yêu cầu đăng nhập vì tài khoản này hiện đang bị vô hiệu hóa bởi Quản trị viên.
          </p>
        </div>

        <div className="mt-4 rounded-xl border border-[#FECACA] dark:border-[#991B1B]/50 bg-[#FDEDED]/70 dark:bg-[#7F1D1D]/20 p-3.5">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#EF4743] dark:text-[#FF6B68] mb-1.5">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span>Nguyên nhân khóa tài khoản:</span>
          </div>
          <p className="text-sm font-medium text-[#262626] dark:text-[#EFF1F6] break-words">
            {banInfo.reason}
          </p>
        </div>

        <div className="mt-4 flex items-center space-x-2 rounded-xl bg-[#F7F8FA] dark:bg-[#333333] px-3.5 py-2.5 text-xs text-neutral-500 dark:text-neutral-400">
          <Mail className="h-4 w-4 shrink-0 text-neutral-400" />
          <span>Nếu bạn cho rằng đây là sự nhầm lẫn, vui lòng liên hệ Quản trị viên để được hỗ trợ mở khóa.</span>
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="mt-5 w-full rounded-xl bg-[#EF4743] hover:bg-[#D93834] py-2.5 px-4 text-xs font-semibold text-white transition-colors cursor-pointer"
        >
          Đã hiểu
        </button>
      </div>
    </div>
  );
}
