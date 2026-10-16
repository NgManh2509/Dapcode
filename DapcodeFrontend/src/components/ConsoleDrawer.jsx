import React, { useState } from 'react';
import { 
  Play, 
  Send, 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Cpu, 
  AlertCircle,
  Loader2 
} from 'lucide-react';

export default function ConsoleDrawer({
  publicTestCases = [],
  submissionState, // { isRunning, isSubmitting, progress, result, error }
  onRunCode,
  onSubmitCode,
}) {
  const [activeTab, setActiveTab] = useState('testcases'); // 'testcases' | 'result'
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0);

  const { isRunning, isSubmitting, progress, result, error } = submissionState;
  const isBusy = isRunning || isSubmitting;

  const currentCase = publicTestCases[selectedTestCaseIndex] || publicTestCases[0] || {
    inputData: '',
    expectedOutput: '',
  };

  const getVerdictStyle = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACCEPTED':
        return {
          label: 'Accepted',
          badgeClass: 'text-[#2CBB5D] bg-[#E8F7EE] border-[#B7E4C7] dark:text-[#2CBB5D] dark:bg-[#14532D]/20 dark:border-[#166534]/50',
          icon: CheckCircle2,
          iconClass: 'text-[#2CBB5D] dark:text-[#2CBB5D]',
        };
      case 'WRONG_ANSWER':
        return {
          label: 'Wrong Answer',
          badgeClass: 'text-[#EF4743] bg-[#FDEDED] border-[#FECACA] dark:text-[#FF6B68] dark:bg-[#7F1D1D]/20 dark:border-[#991B1B]/50',
          icon: XCircle,
          iconClass: 'text-[#EF4743] dark:text-[#FF6B68]',
        };
      case 'TIME_LIMIT_EXCEEDED':
        return {
          label: 'Time Limit Exceeded',
          badgeClass: 'text-[#FFA116] bg-[#FFF6E5] border-[#FFD98A] dark:text-[#FFC01E] dark:bg-[#78350F]/20 dark:border-[#B36B00]/50',
          icon: Clock,
          iconClass: 'text-[#FFA116] dark:text-[#FFC01E]',
        };
      default:
        return {
          label: status || 'Error',
          badgeClass: 'text-[#EF4743] bg-[#FDEDED] border-[#FECACA] dark:text-[#FF6B68] dark:bg-[#7F1D1D]/20 dark:border-[#991B1B]/50',
          icon: AlertCircle,
          iconClass: 'text-[#EF4743] dark:text-[#FF6B68]',
        };
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#FFFFFF] dark:bg-[#282828] rounded-lg overflow-hidden">
      {/* Drawer Header Tabs */}
      <div className="flex h-10 items-center justify-between border-b border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#F7F8FA] dark:bg-[#333333] px-4">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab('testcases')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'testcases'
                ? 'bg-white dark:bg-[#282828] text-[#262626] dark:text-[#EFF1F6] border border-[#E6E6E6] dark:border-[#3E3E3E]'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Test Cases</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('result')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors relative ${
              activeTab === 'result'
                ? 'bg-white dark:bg-[#282828] text-[#262626] dark:text-[#EFF1F6] border border-[#E6E6E6] dark:border-[#3E3E3E]'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <span>Kết quả</span>
            {isBusy && (
              <span className="flex h-1.5 w-1.5 rounded-full bg-neutral-700 dark:bg-neutral-300 animate-pulse ml-1" />
            )}
          </button>
        </div>

        {/* Action Buttons: Run & Submit */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            disabled={isBusy}
            onClick={() => {
              setActiveTab('result');
              onRunCode();
            }}
            className="flex items-center space-x-1.5 rounded-lg bg-white hover:bg-neutral-100 dark:bg-[#282828] dark:hover:bg-[#333333] disabled:opacity-50 border border-[#E6E6E6] dark:border-[#3E3E3E] px-3.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 transition-colors"
          >
            {isRunning ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-neutral-500 dark:text-neutral-400" />
            ) : (
              <Play className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-400 fill-neutral-600 dark:fill-neutral-400" />
            )}
            <span>Run Code</span>
          </button>

          <button
            type="button"
            disabled={isBusy}
            onClick={() => {
              setActiveTab('result');
              onSubmitCode();
            }}
            className="flex items-center space-x-1.5 rounded-lg bg-[#2CBB5D] hover:bg-[#28A754] disabled:opacity-50 px-4 py-1.5 text-xs font-medium text-white transition-colors"
          >
            {isSubmitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            <span>Submit</span>
          </button>
        </div>
      </div>

      {/* Drawer Body Content */}
      <div className="flex-1 overflow-y-auto p-4 text-xs font-mono">
        {activeTab === 'testcases' ? (
          <div>
            {/* Case selector pills */}
            <div className="flex items-center space-x-2 mb-3">
              {publicTestCases.map((tc, idx) => (
                <button
                  key={tc.id || idx}
                  type="button"
                  onClick={() => setSelectedTestCaseIndex(idx)}
                  className={`rounded-lg px-3 py-1 text-xs transition-colors ${
                    selectedTestCaseIndex === idx
                      ? 'bg-[#262626] text-white dark:bg-[#EFF1F6] dark:text-[#262626] font-medium'
                      : 'bg-[#F7F8FA] dark:bg-[#333333] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-[#E6E6E6] dark:border-[#3E3E3E]'
                  }`}
                >
                  Case {idx + 1}
                </button>
              ))}
            </div>

            {/* Selected case details */}
            <div className="space-y-3">
              <div>
                <div className="text-[11px] font-sans font-medium text-neutral-500 dark:text-neutral-400 mb-1">Input:</div>
                <div className="rounded-lg border border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#F7F8FA] dark:bg-[#1A1A1A] p-2.5 text-neutral-800 dark:text-neutral-200">
                  {currentCase.inputData || 'N/A'}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-sans font-medium text-neutral-500 dark:text-neutral-400 mb-1">Expected Output:</div>
                <div className="rounded-lg border border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#F7F8FA] dark:bg-[#1A1A1A] p-2.5 text-neutral-800 dark:text-neutral-200">
                  {currentCase.expectedOutput !== undefined && currentCase.expectedOutput !== null
                    ? (currentCase.expectedOutput === '' ? '"" (chuỗi rỗng)' : currentCase.expectedOutput)
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Test Result / Submission SSE Stream View */
          <div>
            {isBusy ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-3 font-sans">
                <Loader2 className="h-6 w-6 animate-spin text-neutral-700 dark:text-neutral-300" />
                <div className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                  {progress?.message || 'Đang gửi mã nguồn tới Sandbox Judge0...'}
                </div>
                {progress?.currentTest !== undefined && progress?.totalTests && (
                  <div className="w-56 space-y-1">
                    <div className="flex justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                      <span>Kiểm thử test case {progress.currentTest}/{progress.totalTests}</span>
                      <span>{Math.round((progress.currentTest / progress.totalTests) * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#F7F8FA] dark:bg-[#333333] rounded-full overflow-hidden border border-[#E6E6E6] dark:border-[#3E3E3E]">
                      <div
                        className="h-full bg-neutral-800 dark:bg-neutral-200 rounded-full transition-all duration-300"
                        style={{ width: `${(progress.currentTest / progress.totalTests) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : error ? (
              <div className="rounded-lg border border-[#FECACA] dark:border-[#991B1B]/50 bg-[#FDEDED] dark:bg-[#7F1D1D]/20 p-4 text-[#EF4743] dark:text-[#FF6B68] font-sans space-y-2">
                <div className="flex items-center space-x-2 font-medium">
                  <AlertCircle className="h-4 w-4 text-[#EF4743] dark:text-[#FF6B68]" />
                  <span>Đã xảy ra lỗi</span>
                </div>
                <div className="text-xs font-mono text-[#EF4743] dark:text-[#FF6B68] bg-white/60 dark:bg-black/30 p-2.5 rounded border border-[#FECACA] dark:border-[#991B1B]/40 whitespace-pre-wrap">
                  {error}
                </div>
              </div>
            ) : result ? (
              <div className="space-y-4">
                {/* Verdict Banner */}
                {(() => {
                  const verdict = getVerdictStyle(result.status);
                  const Icon = verdict.icon;
                  return (
                    <div className="flex items-center justify-between border-b border-[#E6E6E6] dark:border-[#3E3E3E] pb-3">
                      <div className="flex items-center space-x-2.5">
                        <span className={`inline-flex items-center space-x-1.5 rounded-lg border px-3 py-1 font-sans text-xs font-medium ${verdict.badgeClass}`}>
                          <Icon className={`h-4 w-4 ${verdict.iconClass}`} />
                          <span>{verdict.label}</span>
                        </span>
                      </div>

                      {/* Runtime & Memory */}
                      <div className="flex items-center space-x-4 text-xs font-sans text-neutral-500 dark:text-neutral-400">
                        {result.totalRuntimeMs !== undefined && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3.5 w-3.5 text-neutral-400" />
                            <span>Runtime: <strong className="text-neutral-800 dark:text-neutral-200 font-mono">{result.totalRuntimeMs} ms</strong></span>
                          </div>
                        )}
                        {result.maxMemoryKb !== undefined && (
                          <div className="flex items-center space-x-1">
                            <Cpu className="h-3.5 w-3.5 text-neutral-400" />
                            <span>Memory: <strong className="text-neutral-800 dark:text-neutral-200 font-mono">{(result.maxMemoryKb / 1024).toFixed(1)} MB</strong></span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {(() => {
                  const casesToDisplay = (result.testCaseResults && result.testCaseResults.length > 0)
                    ? result.testCaseResults
                    : (publicTestCases && publicTestCases.length > 0)
                      ? publicTestCases.map((ptc, idx) => ({
                          testCaseId: ptc.id || idx,
                          status: result.status === 'ACCEPTED' ? 'ACCEPTED' : (result.status || 'PENDING'),
                          inputData: ptc.inputData,
                          expectedOutput: ptc.expectedOutput,
                          actualOutput: result.status === 'ACCEPTED' ? ptc.expectedOutput : 'N/A',
                          isHidden: false,
                        }))
                      : [];

                  if (casesToDisplay.length === 0) {
                    return (
                      <div className="rounded-xl border border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#F7F8FA] dark:bg-[#1A1A1A] p-4 text-center font-sans text-xs text-neutral-600 dark:text-neutral-400">
                        Đã kiểm thử hoàn tất với kết quả: <strong className="font-mono">{result.status || 'ACCEPTED'}</strong>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-[11px] font-sans font-medium text-neutral-700 dark:text-neutral-300">
                          Chi tiết từng Test Case ({result.passedTestCases ?? casesToDisplay.filter(c => c.status === 'ACCEPTED' || c.passed).length} / {casesToDisplay.length} Passed):
                        </div>
                      </div>

                      <div className="space-y-2">
                        {casesToDisplay.map((tc, i) => {
                          const isPassed = tc.status === 'ACCEPTED' || tc.passed === true;
                          const isHidden = tc.isHidden ?? tc.hidden ?? false;
                          let cleanActual = 'N/A';
                          if (tc.actualOutput !== undefined && tc.actualOutput !== null) {
                            const trimmed = tc.actualOutput.trim();
                            cleanActual = trimmed === '' ? '"" (chuỗi rỗng)' : trimmed;
                          } else if (isPassed) {
                            cleanActual = (tc.expectedOutput !== undefined && tc.expectedOutput !== null && tc.expectedOutput.trim() === '')
                              ? '"" (chuỗi rỗng)'
                              : (tc.expectedOutput || 'Passed');
                          }
                          if (cleanActual && cleanActual.length >= 16 && /^[A-Za-z0-9+/=\s]+$/.test(cleanActual) && !cleanActual.startsWith('[') && !cleanActual.startsWith('{')) {
                            try {
                              const decoded = atob(cleanActual.replace(/\s+/g, ''));
                              if (decoded && /^[\x20-\x7E\r\n\t]+$/.test(decoded)) {
                                cleanActual = decoded;
                              }
                            } catch {}
                          }

                          return (
                            <div
                              key={i}
                              className={`rounded-lg border p-3 font-mono text-xs transition-colors ${
                                isPassed
                                  ? 'border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#F7F8FA] dark:bg-[#282828]'
                                  : 'border-[#FECACA] dark:border-[#991B1B]/40 bg-[#FDEDED]/60 dark:bg-[#7F1D1D]/10'
                              }`}
                            >
                              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E6E6E6] dark:border-[#3E3E3E]">
                                <div className="flex items-center space-x-2">
                                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                    Case {i + 1} {isHidden ? '(Ẩn)' : ''}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${
                                      isPassed
                                        ? 'bg-[#E8F7EE] text-[#2CBB5D] border-[#B7E4C7] dark:bg-[#14532D]/20 dark:text-[#2CBB5D] dark:border-[#166534]/50'
                                        : 'bg-[#FDEDED] text-[#EF4743] border-[#FECACA] dark:bg-[#7F1D1D]/20 dark:text-[#FF6B68] dark:border-[#991B1B]/50'
                                    }`}
                                  >
                                    {isPassed ? 'PASS' : (tc.status || 'FAIL')}
                                  </span>
                                </div>
                                {tc.runtimeMs !== undefined && (
                                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-sans">
                                    {Math.round(tc.runtimeMs)} ms
                                  </span>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                                <div>
                                  <div className="text-[11px] font-sans font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                    Input:
                                  </div>
                                  <div className="rounded-lg border border-[#E6E6E6] dark:border-[#3E3E3E] bg-white dark:bg-[#1A1A1A] p-2 text-neutral-800 dark:text-neutral-200 break-words whitespace-pre-wrap">
                                    {tc.inputData || (isHidden ? '(Test case ẩn)' : 'N/A')}
                                  </div>
                                </div>

                                <div>
                                  <div className="text-[11px] font-sans font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                    Output:
                                  </div>
                                  <div className="rounded-lg border border-[#E6E6E6] dark:border-[#3E3E3E] bg-white dark:bg-[#1A1A1A] p-2 text-neutral-800 dark:text-neutral-200 break-words whitespace-pre-wrap">
                                    {tc.expectedOutput !== undefined && tc.expectedOutput !== null
                                      ? (tc.expectedOutput === '' ? '"" (chuỗi rỗng)' : tc.expectedOutput)
                                      : (isHidden ? '(Test case ẩn)' : 'N/A')}
                                  </div>
                                </div>

                                <div>
                                  <div className="text-[11px] font-sans font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                    Kết quả:
                                  </div>
                                  <div
                                    className={`rounded-lg border p-2 break-words whitespace-pre-wrap font-medium ${
                                      isPassed
                                        ? 'border-[#B7E4C7] dark:border-[#166534]/40 bg-[#E8F7EE] dark:bg-[#14532D]/10 text-[#2CBB5D] dark:text-[#2CBB5D]'
                                        : 'border-[#FECACA] dark:border-[#991B1B]/40 bg-[#FDEDED] dark:bg-[#7F1D1D]/10 text-[#EF4743] dark:text-[#FF6B68]'
                                    }`}
                                  >
                                    {cleanActual}
                                  </div>
                                </div>
                              </div>

                              {tc.errMes && (
                                <div className="mt-2 text-[11px] font-mono text-[#EF4743] dark:text-[#FF6B68] bg-[#FDEDED] dark:bg-[#7F1D1D]/20 p-2 rounded border border-[#FECACA] dark:border-[#991B1B]/30 whitespace-pre-wrap">
                                  {tc.errMes}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-neutral-400 dark:text-neutral-500 font-sans">
                <Terminal className="h-6 w-6 mb-2 opacity-40" />
                <p className="text-xs">Nhấn &quot;Run Code&quot; hoặc &quot;Submit&quot; để xem kết quả kiểm thử.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
