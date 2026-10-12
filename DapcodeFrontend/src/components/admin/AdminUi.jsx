import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, Loader2, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export const inputCls =
  'w-full rounded-lg border border-transparent bg-[#F0F0F0] dark:bg-[#333333] px-3 py-2 text-sm text-[#262626] dark:text-[#EFF1F6] placeholder-neutral-400 focus:outline-none focus:border-[#FFA116]';

export const btnPrimary =
  'inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#FFA116] px-3.5 py-2 text-sm font-medium text-white hover:bg-[#E8920F] disabled:opacity-50 transition-colors cursor-pointer';

export const btnGhost =
  'inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#F0F0F0] dark:bg-[#333333] px-3.5 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-[#E6E6E6] dark:hover:bg-[#3E3E3E] disabled:opacity-50 transition-colors cursor-pointer';

export const btnDanger =
  'inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#EF4743] px-3.5 py-2 text-sm font-medium text-white hover:bg-[#D93B37] disabled:opacity-50 transition-colors cursor-pointer';

export const iconBtn =
  'inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-[#F0F0F0] dark:hover:bg-[#333333] hover:text-[#262626] dark:hover:text-[#EFF1F6] transition-colors cursor-pointer';

export function Card({ className = '', children }) {
  return <div className={`rounded-lg bg-white dark:bg-[#282828] ${className}`}>{children}</div>;
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold text-[#262626] dark:text-[#EFF1F6]">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-neutral-500 dark:text-neutral-400">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-neutral-400">{hint}</span>}
    </label>
  );
}

export function Spinner({ label }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 py-16 text-neutral-500 dark:text-neutral-400">
      <Loader2 className="h-5 w-5 animate-spin" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

export function Empty({ children }) {
  return <div className="py-14 text-center text-sm text-neutral-500 dark:text-neutral-400">{children}</div>;
}

export function Badge({ tone = 'neutral', children }) {
  const tones = {
    neutral: 'bg-[#F0F0F0] text-neutral-600 dark:bg-[#333333] dark:text-neutral-300',
    green: 'bg-[#2CBB5D]/10 text-[#2CBB5D]',
    red: 'bg-[#EF4743]/10 text-[#EF4743]',
    orange: 'bg-[#FFA116]/15 text-[#FFA116]',
    blue: 'bg-[#3B82F6]/10 text-[#3B82F6]',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 cursor-pointer"
    >
      <span
        className={`relative h-5 w-9 rounded-full transition-colors ${
          checked ? 'bg-[#2CBB5D]' : 'bg-neutral-300 dark:bg-[#3E3E3E]'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
            checked ? 'left-[18px]' : 'left-0.5'
          }`}
        />
      </span>
      {label && <span className="text-sm text-neutral-600 dark:text-neutral-300">{label}</span>}
    </button>
  );
}

export function Dialog({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-6xl' };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 dark:bg-black/60"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`flex max-h-[92vh] w-full ${widths[size]} flex-col rounded-lg bg-white shadow-xl dark:bg-[#282828]`}
      >
        <div className="flex items-center justify-between border-b border-[#E6E6E6] px-5 py-3.5 dark:border-[#3E3E3E]">
          <h2 className="text-base font-semibold text-[#262626] dark:text-[#EFF1F6]">{title}</h2>
          <button type="button" onClick={onClose} className={iconBtn}>
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-[#E6E6E6] px-5 py-3.5 dark:border-[#3E3E3E]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Xác nhận', busy, danger = true }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button type="button" onClick={onClose} className={btnGhost}>
            Hủy
          </button>
          <button type="button" onClick={onConfirm} disabled={busy} className={danger ? btnDanger : btnPrimary}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm text-neutral-600 dark:text-neutral-300">{message}</p>
    </Dialog>
  );
}

export function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1 border-t border-[#E6E6E6] p-3 dark:border-[#3E3E3E]">
      <button type="button" className={iconBtn} disabled={page <= 0} onClick={() => onChange(page - 1)}>
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="px-3 text-sm text-neutral-600 dark:text-neutral-300">
        {page + 1} / {totalPages}
      </span>
      <button type="button" className={iconBtn} disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)}>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

const ToastContext = createContext({ push: () => {} });

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const push = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[60] space-y-2">
        {items.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2 rounded-lg bg-[#262626] px-4 py-2.5 text-sm text-white shadow-lg dark:bg-[#EFF1F6] dark:text-[#262626]"
          >
            {t.type === 'error' ? (
              <AlertCircle className="h-4 w-4 text-[#FF6B68]" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-[#2CBB5D]" />
            )}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

export function useDebounced(value, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}
