import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { getCurrentUser } from '../api/auth';

export default function AdminRoute({ children }) {
  const [state, setState] = useState('checking');

  useEffect(() => {
    let localUser = null;
    try {
      localUser = JSON.parse(localStorage.getItem('dapcode_user') || 'null');
    } catch {
      localUser = null;
    }

    if (!localStorage.getItem('dapcode_token') && !localUser) {
      setState('denied');
      return;
    }

    getCurrentUser()
      .then((res) => {
        const u = res?.data || res;
        if (u) {
          localStorage.setItem('dapcode_user', JSON.stringify({ ...localUser, ...u }));
        }
        setState(u?.role === 'ROLE_ADMIN' ? 'ok' : 'denied');
      })
      .catch(() => {
        if (localUser?.role === 'ROLE_ADMIN') {
          setState('ok');
        } else {
          setState('denied');
        }
      });
  }, []);

  if (state === 'checking') {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F0F0F0] dark:bg-[#1A1A1A]">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
      </div>
    );
  }

  if (state === 'denied') return <Navigate to="/roadmap" replace />;
  return children;
}
