import React from 'react';
import Editor from '@monaco-editor/react';
import { RotateCcw, Sparkles, Code } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const SUPPORTED_LANGUAGES = [
  { id: 71, key: 'python', label: 'Python 3', monacoLang: 'python' },
  { id: 62, key: 'java', label: 'Java (OpenJDK 13)', monacoLang: 'java' },
  { id: 54, key: 'cpp', label: 'C++ (GCC 9.2)', monacoLang: 'cpp' },
];

export default function CodeEditor({
  code,
  onChange,
  language,
  onLanguageChange,
  onResetCode,
  onOpenAiTutor,
}) {
  const { isDark } = useTheme();
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.key === language) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="flex h-full flex-col border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-[#16171d] rounded-xl overflow-hidden shadow-sm">
      {/* Editor Toolbar */}
      <div className="flex h-11 items-center justify-between border-b border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-[#121319] px-4">
        {/* Language selector */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-zinc-400">
            <Code className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-medium hidden sm:inline">Ngôn ngữ:</span>
          </div>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="rounded-md border border-slate-300 dark:border-zinc-700/60 bg-white dark:bg-zinc-800/90 px-2.5 py-1 text-xs font-medium text-slate-800 dark:text-zinc-200 focus:border-indigo-500 focus:outline-none shadow-xs"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.key} value={lang.key} className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200">
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Right Tools: Reset & AI Tutor */}
        <div className="flex items-center space-x-2">
          {/* Socratic AI Tutor Button */}
          <button
            type="button"
            onClick={onOpenAiTutor}
            className="flex items-center space-x-1.5 rounded-md bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-600/20 dark:hover:bg-indigo-600/30 border border-indigo-200 dark:border-indigo-500/40 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 transition-all active:scale-95 shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>AI Tutor</span>
          </button>

          {/* Reset Code */}
          <button
            type="button"
            onClick={onResetCode}
            title="Khôi phục mã mẫu ban đầu"
            className="flex items-center space-x-1 rounded-md bg-white hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-slate-300 dark:border-zinc-700/60 px-2 py-1 text-xs text-slate-600 dark:text-zinc-300 transition-colors shadow-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 w-full relative">
        <Editor
          height="100%"
          language={currentLangObj.monacoLang}
          value={code}
          theme={isDark ? "vs-dark" : "vs"}
          onChange={(val) => onChange(val || '')}
          options={{
            fontSize: 13.5,
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
            lineHeight: 21,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            bracketPairColorization: { enabled: true },
            wordWrap: 'on',
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
    </div>
  );
}

