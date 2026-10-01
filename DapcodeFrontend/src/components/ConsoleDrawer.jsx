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
          badgeClass: 'text-emerald-700 bg-emerald-50 border-emerald-300 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/30',
          icon: CheckCircle2,
          iconClass: 'text-emerald-600 dark:text-emerald-400',
        };
      case 'WRONG_ANSWER':
        return {
          label: 'Wrong Answer',
          badgeClass: 'text-rose-700 bg-rose-50 border-rose-300 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/30',
          icon: XCircle,
          iconClass: 'text-rose-600 dark:text-rose-400',
        };
      case 'TIME_LIMIT_EXCEEDED':
        return {
          label: 'Time Limit Exceeded',
          badgeClass: 'text-amber-700 bg-amber-50 border-amber-300 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/30',
          icon: Clock,
          iconClass: 'text-amber-600 dark:text-amber-400',
        };
      default:
        return {
          label: status || 'Error',
          badgeClass: 'text-rose-700 bg-rose-50 border-rose-300 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/30',
          icon: AlertCircle,
          iconClass: 'text-rose-600 dark:text-rose-400',
        };
    }
  };

  return (
    <div className="flex h-full flex-col border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-[#16171d] rounded-xl overflow-hidden shadow-sm">
      {/* Drawer Header Tabs */}
      <div className="flex h-11 items-center justify-between border-b border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-[#121319] px-4">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab('testcases')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'testcases'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white border border-slate-200 dark:border-transparent shadow-xs'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Test Cases</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('result')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors relative ${
              activeTab === 'result'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white border border-slate-200 dark:border-transparent shadow-xs'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            <span>Kết quả</span>
            {isBusy && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
            )}
          </button>
        </div>

        {/* Action Buttons: Run & Submit */}
        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            disabled={isBusy}
            onClick={() => {
              setActiveTab('result');
              onRunCode();
            }}
            className="flex items-center space-x-1.5 rounded-lg bg-white hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 disabled:opacity-50 border border-slate-300 dark:border-zinc-700/60 px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-zinc-200 shadow-xs transition-all active:scale-95"
          >
            {isRunning ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500 dark:text-zinc-400" />
            ) : (
              <Play className="h-3.5 w-3.5 text-slate-600 dark:text-zinc-400 fill-slate-600 dark:fill-zinc-400" />
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
            className="flex items-center space-x-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition-all active:scale-95"
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
                  className={`rounded-md px-3 py-1 font-medium transition-colors ${
                    selectedTestCaseIndex === idx
                      ? 'bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-white border border-slate-300 dark:border-zinc-700 font-semibold'
                      : 'bg-slate-100 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800/60 border border-transparent'
                  }`}
                >
                  Case {idx + 1}
                </button>
              ))}
            </div>

            {/* Selected case details */}
            <div className="space-y-3">
              <div>
                <div className="text-[11px] font-sans font-medium text-slate-500 dark:text-zinc-400 mb-1">Input:</div>
                <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#111217] p-2.5 text-slate-800 dark:text-zinc-200">
                  {currentCase.inputData || 'N/A'}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-sans font-medium text-slate-500 dark:text-zinc-400 mb-1">Expected Output:</div>
                <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#111217] p-2.5 text-slate-800 dark:text-zinc-200">
                  {currentCase.expectedOutput || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Test Result / Submission SSE Stream View */
          <div>
            {isBusy ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-3">
                <Loader2 className="h-7 w-7 animate-spin text-indigo-600 dark:text-indigo-400" />
                <div className="text-sm font-sans font-medium text-slate-800 dark:text-zinc-200">
                  {progress?.message || 'Đang gửi mã nguồn tới Sandbox Judge0...'}
                </div>
                {progress?.currentTest !== undefined && progress?.totalTests && (
                  <div className="w-64 space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-zinc-400 font-sans">
                      <span>Đang kiểm thử test case {progress.currentTest}/{progress.totalTests}</span>
                      <span>{Math.round((progress.currentTest / progress.totalTests) * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                        style={{ width: `${(progress.currentTest / progress.totalTests) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : error ? (
              <div className="rounded-lg border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-950/20 p-4 text-rose-800 dark:text-rose-300 font-sans space-y-2">
                <div className="flex items-center space-x-2 font-semibold">
                  <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  <span>Đã xảy ra lỗi</span>
                </div>
                <div className="text-xs font-mono text-rose-900 dark:text-rose-200 bg-rose-100 dark:bg-rose-950/40 p-2.5 rounded border border-rose-300 dark:border-rose-800/40 whitespace-pre-wrap">
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
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800/80 pb-3">
                      <div className="flex items-center space-x-2.5">
                        <span className={`inline-flex items-center space-x-1.5 rounded-lg border px-3 py-1 font-sans text-sm font-bold ${verdict.badgeClass}`}>
                          <Icon className={`h-4 w-4 ${verdict.iconClass}`} />
                          <span>{verdict.label}</span>
                        </span>
                      </div>

                      {/* Runtime & Memory */}
                      <div className="flex items-center space-x-4 text-xs font-sans text-slate-500 dark:text-zinc-400">
                        {result.totalRuntimeMs !== undefined && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-400" />
                            <span>Runtime: <strong className="text-slate-800 dark:text-zinc-200 font-mono">{result.totalRuntimeMs} ms</strong></span>
                          </div>
                        )}
                        {result.maxMemoryKb !== undefined && (
                          <div className="flex items-center space-x-1">
                            <Cpu className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-400" />
                            <span>Memory: <strong className="text-slate-800 dark:text-zinc-200 font-mono">{(result.maxMemoryKb / 1024).toFixed(1)} MB</strong></span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Test case breakdown if available */}
                {result.testCaseResults && result.testCaseResults.length > 0 && (
                  <div>
                    <div className="text-[11px] font-sans font-semibold text-slate-600 dark:text-zinc-400 mb-2">
                      Chi tiết từng Test Case ({result.passedTestCases || 0} / {result.testCaseResults.length} Passed):
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {result.testCaseResults.map((tc, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-md border text-[11px] ${
                            tc.passed
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-400'
                              : 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/5 dark:text-rose-400'
                          }`}
                        >
                          <span>Case {i + 1}</span>
                          <span className="font-semibold">{tc.passed ? 'PASS' : 'FAIL'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400 dark:text-zinc-500 font-sans">
                <Terminal className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-xs">Nhấn &quot;Run Code&quot; hoặc &quot;Submit&quot; để xem kết quả kiểm thử.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

