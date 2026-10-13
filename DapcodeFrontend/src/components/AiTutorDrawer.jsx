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
      if (err.response?.status === 401) {
        setErrorMsg('Vui lòng đăng nhập tài khoản để sử dụng trợ lý AI Tutor!');
      } else {
        const message = err.response?.data?.message || err.message || 'Không thể kết nối tới AI Tutor. Vui lòng thử lại sau.';
        setErrorMsg(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 dark:bg-black/60 backdrop-blur-xs transition-opacity">
      <div className="relative flex h-full w-full max-w-lg flex-col border-l border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#FFFFFF] dark:bg-[#282828]">
        {/* Drawer Header */}
        <div className="flex h-14 items-center justify-between border-b border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#F7F8FA] dark:bg-[#333333] px-5">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#262626] dark:bg-[#EFF1F6] text-white dark:text-[#262626]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#262626] dark:text-[#EFF1F6] tracking-tight flex items-center space-x-1.5">
                <span>Socratic AI Tutor</span>
                <span className="rounded bg-[#FFA116]/20 px-1.5 py-0.2 text-[10px] font-semibold text-[#FFA116] border border-[#FFA116]/30">
                  LiệtCode
                </span>
              </h2>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate max-w-[260px]">
                {problemTitle}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-[#F7F8FA] dark:hover:bg-[#333333] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Hint Level Selector: Flat Buttons distinguished by border & font weight */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Chọn mức độ hỗ trợ (Socratic Level):
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setHintLevel(1)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                  hintLevel === 1
                    ? 'border-[#262626] dark:border-[#EFF1F6] bg-[#F7F8FA] dark:bg-[#333333]'
                    : 'border-[#E6E6E6] dark:border-[#3E3E3E] bg-white dark:bg-[#282828] hover:bg-[#F7F8FA] dark:hover:bg-[#333333]'
                }`}
              >
                <div className="flex items-center space-x-1.5 text-xs text-[#262626] dark:text-[#EFF1F6] mb-1">
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span className={hintLevel === 1 ? 'font-bold' : 'font-medium'}>Level 1: Gợi ý tư duy</span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
                  Định hướng suy nghĩ, không tiết lộ mã giả hay thuật toán trực tiếp.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setHintLevel(2)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                  hintLevel === 2
                    ? 'border-[#262626] dark:border-[#EFF1F6] bg-[#F7F8FA] dark:bg-[#333333]'
                    : 'border-[#E6E6E6] dark:border-[#3E3E3E] bg-white dark:bg-[#282828] hover:bg-[#F7F8FA] dark:hover:bg-[#333333]'
                }`}
              >
                <div className="flex items-center space-x-1.5 text-xs text-[#262626] dark:text-[#EFF1F6] mb-1">
                  <FileCode2 className="h-3.5 w-3.5" />
                  <span className={hintLevel === 2 ? 'font-bold' : 'font-medium'}>Level 2: Mã giả (Pseudocode)</span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
                  Cung cấp các bước logic bằng mã giả để tự tay code lại.
                </p>
              </button>
            </div>
          </div>

          {/* Question / Context Input */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Câu hỏi hoặc điểm vướng mắc của bạn:
            </label>
            <textarea
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="VD: Thuật toán của tôi đang bị Time Limit Exceeded, có cách nào tối ưu thời gian từ O(N^2) xuống O(N) không?"
              className="w-full rounded-xl border border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#F7F8FA] dark:bg-[#1A1A1A] p-3 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
            />
          </div>

          {/* Include current code switch */}
          <div className="flex items-center justify-between rounded-lg border border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#F7F8FA] dark:bg-[#333333] px-3 py-2 text-xs text-neutral-700 dark:text-neutral-300">
            <span className="text-[11px]">Tự động gửi code hiện tại để AI phân tích</span>
            <input
              type="checkbox"
              checked={includeCode}
              onChange={(e) => setIncludeCode(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 focus:ring-0 accent-neutral-800 cursor-pointer"
            />
          </div>

          {/* Submit Ask Button: Flat Charcoal Minimalist */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleAskHint}
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#262626] hover:bg-[#3C3C3C] dark:bg-[#EFF1F6] dark:hover:bg-[#E6E6E6] disabled:opacity-50 py-2.5 text-xs font-medium text-[#F7F8FA] dark:text-[#262626] transition-colors cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white dark:text-[#262626]" />
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
            <div className="flex items-center space-x-2 rounded-lg border border-[#FECACA] dark:border-[#991B1B]/40 bg-[#FDEDED] dark:bg-[#7F1D1D]/20 p-3 text-xs text-[#EF4743] dark:text-[#FF6B68]">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* AI Response Display: Pedagogical annotation style with clean left border */}
          {hintResponse && (
            <div className="mt-4 border-l-2 border-[#262626] dark:border-[#EFF1F6] border-y border-r border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#F7F8FA] dark:bg-[#333333] rounded-r-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#E6E6E6] dark:border-[#3E3E3E] pb-2">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#262626] dark:text-[#EFF1F6]">
                  <Bot className="h-4 w-4" />
                  <span>Phản hồi từ AI Tutor (Level {hintResponse.hint_lv || hintLevel})</span>
                </div>
                {hintResponse.related_concept && (
                  <span className="inline-flex items-center space-x-1 rounded bg-white dark:bg-[#282828] px-2 py-0.5 text-[10px] font-medium text-neutral-700 dark:text-neutral-300 border border-[#E6E6E6] dark:border-[#3E3E3E]">
                    <Bookmark className="h-3 w-3" />
                    <span>{hintResponse.related_concept}</span>
                  </span>
                )}
              </div>

              {/* Rendered Markdown Body */}
              <div className="text-neutral-800 dark:text-neutral-200 text-xs">
                <MarkdownRenderer content={hintResponse.hint} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
