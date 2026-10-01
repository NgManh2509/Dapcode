import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Lightbulb, 
  FileCode2, 
  AlertCircle,
  Loader2,
  Bookmark,
  Bot
} from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import { getAiHint } from '../api/ai';

export default function AiTutorDrawer({
  isOpen,
  onClose,
  problemSlug,
  problemTitle,
  currentCode,
  language,
  lastError,
}) {
  const [hintLevel, setHintLevel] = useState(1); // 1: Nudge, 2: Pseudocode
  const [question, setQuestion] = useState('');
  const [includeCode, setIncludeCode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hintResponse, setHintResponse] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleAskHint = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await getAiHint({
        problemSlug,
        code: includeCode ? currentCode : '',
        language,
        hintLevel,
        errorMessage: lastError || '',
        question,
      });

      if (res && res.data) {
        setHintResponse(res.data);
      } else if (res) {
        setHintResponse(res);
      }
    } catch (err) {
      console.error('Failed to call AI Tutor API:', err);
      const message = err.response?.data?.message || err.message || 'Không thể kết nối tới AI Tutor. Vui lòng thử lại sau.';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 dark:bg-black/60 backdrop-blur-xs transition-opacity">
      <div className="relative flex h-full w-full max-w-lg flex-col border-l border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121319] shadow-2xl">
        {/* Drawer Header */}
        <div className="flex h-14 items-center justify-between border-b border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-[#16171d] px-5">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-500/30">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-1.5">
                <span>Socratic AI Tutor</span>
                <span className="rounded bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.2 text-[10px] font-medium text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                  Dapcode
                </span>
              </h2>
              <div className="text-[11px] text-slate-500 dark:text-zinc-400 truncate max-w-[260px]">
                {problemTitle}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Hint Level Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-2">
              Chọn mức độ hỗ trợ (Socratic Level):
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setHintLevel(1)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  hintLevel === 1
                    ? 'border-indigo-400 bg-indigo-50/80 dark:border-indigo-500/60 dark:bg-indigo-950/20 shadow-xs'
                    : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/40 hover:bg-slate-100 dark:hover:bg-zinc-800/40'
                }`}
              >
                <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-400 mb-1">
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span>Level 1: Gợi ý tư duy</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-snug">
                  Định hướng suy nghĩ, không tiết lộ mã giả hay thuật toán trực tiếp.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setHintLevel(2)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  hintLevel === 2
                    ? 'border-indigo-400 bg-indigo-50/80 dark:border-indigo-500/60 dark:bg-indigo-950/20 shadow-xs'
                    : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/40 hover:bg-slate-100 dark:hover:bg-zinc-800/40'
                }`}
              >
                <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-400 mb-1">
                  <FileCode2 className="h-3.5 w-3.5" />
                  <span>Level 2: Mã giả (Pseudocode)</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-snug">
                  Cung cấp các bước logic bằng mã giả để tự tay code lại.
                </p>
              </button>
            </div>
          </div>

          {/* Question / Context Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
              Câu hỏi hoặc điểm vướng mắc của bạn:
            </label>
            <textarea
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="VD: Thuật toán của tôi đang bị Time Limit Exceeded, có cách nào tối ưu thời gian từ O(N^2) xuống O(N) không?"
              className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/80 p-3 text-xs text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Include current code switch */}
          <div className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-900/40 px-3 py-2 text-xs text-slate-700 dark:text-zinc-300">
            <span className="text-[11px]">Tự động gửi code hiện tại để AI phân tích</span>
            <input
              type="checkbox"
              checked={includeCode}
              onChange={(e) => setIncludeCode(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Ask Button */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleAskHint}
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition-all active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>AI Tutor đang suy luận...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-white" />
                <span>Xin gợi ý từ AI Tutor</span>
              </>
            )}
          </button>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center space-x-2 rounded-lg border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-950/20 p-3 text-xs text-rose-800 dark:text-rose-300">
              <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* AI Response Display */}
          {hintResponse && (
            <div className="mt-4 rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/40 dark:bg-gradient-to-b dark:from-indigo-950/20 dark:to-[#16171d] p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-indigo-200 dark:border-indigo-500/20 pb-2.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-indigo-700 dark:text-indigo-400">
                  <Bot className="h-4 w-4" />
                  <span>Phản hồi từ AI Tutor (Level {hintResponse.hint_lv || hintLevel})</span>
                </div>
                {hintResponse.related_concept && (
                  <span className="inline-flex items-center space-x-1 rounded bg-indigo-100 dark:bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20">
                    <Bookmark className="h-3 w-3" />
                    <span>{hintResponse.related_concept}</span>
                  </span>
                )}
              </div>

              {/* Rendered Markdown Body */}
              <div className="text-slate-800 dark:text-zinc-200 text-xs">
                <MarkdownRenderer content={hintResponse.hint} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

