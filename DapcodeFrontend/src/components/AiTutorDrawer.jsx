import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 dark:bg-black/60 backdrop-blur-xs transition-opacity">
      <div className="relative flex h-full w-full max-w-lg flex-col border-l border-[#E8E4DC] dark:border-[#332F2B] bg-[#FFFFFF] dark:bg-[#1C1A18]">
        {/* Drawer Header */}
        <div className="flex h-14 items-center justify-between border-b border-[#E8E4DC] dark:border-[#332F2B] bg-[#FAF8F3] dark:bg-[#24221F] px-5">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1C1917] dark:bg-[#F5F2EB] text-white dark:text-[#1C1917]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#1C1917] dark:text-[#F5F2EB] tracking-tight flex items-center space-x-1.5">
                <span>Socratic AI Tutor</span>
                <span className="rounded bg-stone-100 dark:bg-stone-800 px-1.5 py-0.2 text-[10px] font-medium text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                  Dapcode
                </span>
              </h2>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate max-w-[260px]">
                {problemTitle}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-[#FAF8F3] dark:hover:bg-[#24221F] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Hint Level Selector: Flat Buttons distinguished by border & font weight */}
          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-2">
              Chọn mức độ hỗ trợ (Socratic Level):
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setHintLevel(1)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                  hintLevel === 1
                    ? 'border-[#1C1917] dark:border-[#F5F2EB] bg-[#FAF8F3] dark:bg-[#24221F]'
                    : 'border-[#E8E4DC] dark:border-[#332F2B] bg-white dark:bg-[#1C1A18] hover:bg-[#FAF8F3] dark:hover:bg-[#24221F]'
                }`}
              >
                <div className="flex items-center space-x-1.5 text-xs text-[#1C1917] dark:text-[#F5F2EB] mb-1">
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span className={hintLevel === 1 ? 'font-bold' : 'font-medium'}>Level 1: Gợi ý tư duy</span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                  Định hướng suy nghĩ, không tiết lộ mã giả hay thuật toán trực tiếp.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setHintLevel(2)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                  hintLevel === 2
                    ? 'border-[#1C1917] dark:border-[#F5F2EB] bg-[#FAF8F3] dark:bg-[#24221F]'
                    : 'border-[#E8E4DC] dark:border-[#332F2B] bg-white dark:bg-[#1C1A18] hover:bg-[#FAF8F3] dark:hover:bg-[#24221F]'
                }`}
              >
                <div className="flex items-center space-x-1.5 text-xs text-[#1C1917] dark:text-[#F5F2EB] mb-1">
                  <FileCode2 className="h-3.5 w-3.5" />
                  <span className={hintLevel === 2 ? 'font-bold' : 'font-medium'}>Level 2: Mã giả (Pseudocode)</span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                  Cung cấp các bước logic bằng mã giả để tự tay code lại.
                </p>
              </button>
            </div>
          </div>

          {/* Question / Context Input */}
          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
              Câu hỏi hoặc điểm vướng mắc của bạn:
            </label>
            <textarea
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="VD: Thuật toán của tôi đang bị Time Limit Exceeded, có cách nào tối ưu thời gian từ O(N^2) xuống O(N) không?"
              className="w-full rounded-xl border border-[#E8E4DC] dark:border-[#332F2B] bg-[#FAF8F3] dark:bg-[#141312] p-3 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-stone-500"
            />
          </div>

          {/* Include current code switch */}
          <div className="flex items-center justify-between rounded-lg border border-[#E8E4DC] dark:border-[#332F2B] bg-[#FAF8F3] dark:bg-[#24221F] px-3 py-2 text-xs text-stone-700 dark:text-stone-300">
            <span className="text-[11px]">Tự động gửi code hiện tại để AI phân tích</span>
            <input
              type="checkbox"
              checked={includeCode}
              onChange={(e) => setIncludeCode(e.target.checked)}
              className="h-4 w-4 rounded border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 focus:ring-0 accent-stone-800 cursor-pointer"
            />
          </div>

          {/* Submit Ask Button: Flat Charcoal Minimalist */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleAskHint}
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#1C1917] hover:bg-[#2D2A26] dark:bg-[#F5F2EB] dark:hover:bg-[#E8E4DC] disabled:opacity-50 py-2.5 text-xs font-medium text-[#FAF8F3] dark:text-[#1C1917] transition-colors cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white dark:text-[#1C1917]" />
                <span>AI Tutor đang suy luận...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Xin gợi ý từ AI Tutor</span>
              </>
            )}
          </button>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center space-x-2 rounded-lg border border-[#FECACA] dark:border-[#991B1B]/40 bg-[#FEF2F2] dark:bg-[#7F1D1D]/20 p-3 text-xs text-[#B91C1C] dark:text-[#F87171]">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* AI Response Display: Pedagogical annotation style with clean left border */}
          {hintResponse && (
            <div className="mt-4 border-l-2 border-[#1C1917] dark:border-[#F5F2EB] border-y border-r border-[#E8E4DC] dark:border-[#332F2B] bg-[#FAF8F3] dark:bg-[#24221F] rounded-r-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#E8E4DC] dark:border-[#332F2B] pb-2">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#1C1917] dark:text-[#F5F2EB]">
                  <Bot className="h-4 w-4" />
                  <span>Phản hồi từ AI Tutor (Level {hintResponse.hint_lv || hintLevel})</span>
                </div>
                {hintResponse.related_concept && (
                  <span className="inline-flex items-center space-x-1 rounded bg-white dark:bg-[#1C1A18] px-2 py-0.5 text-[10px] font-medium text-stone-700 dark:text-stone-300 border border-[#E8E4DC] dark:border-[#332F2B]">
                    <Bookmark className="h-3 w-3" />
                    <span>{hintResponse.related_concept}</span>
                  </span>
                )}
              </div>

              {/* Rendered Markdown Body */}
              <div className="text-stone-800 dark:text-stone-200 text-xs">
                <MarkdownRenderer content={hintResponse.hint} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
