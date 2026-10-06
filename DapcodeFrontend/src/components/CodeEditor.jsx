import React from 'react';
import Editor from '@monaco-editor/react';
import { RotateCcw, Sparkles, Code2 } from 'lucide-react';
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
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.key === language) || SUPPORTED_LANGUAGES[0];

  const handleEditorWillMount = (monaco) => {
    // Custom Warm Editorial Light Theme (Warm Cream & Earthy syntax)
    monaco.editor.defineTheme('dapcode-warm-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '78716C', fontStyle: 'italic' },
        { token: 'keyword', foreground: '9A3412', fontStyle: 'bold' },
        { token: 'string', foreground: '15803D' },
        { token: 'number', foreground: 'B45309' },
        { token: 'type', foreground: '0369A1' },
        { token: 'function', foreground: '1E293B' },
      ],
      colors: {
        'editor.background': '#FAF8F3',
        'editor.foreground': '#2D2A26',
        'editorLineNumber.foreground': '#A8A29E',
        'editorLineNumber.activeForeground': '#44403C',
        'editor.lineHighlightBackground': '#F3EFE6',
        'editorCursor.foreground': '#1C1917',
        'editor.selectionBackground': '#E8E2D5',
        'editorIndentGuide.background': '#EFECE6',
        'editorIndentGuide.activeBackground': '#D6D3CD',
      },
    });

    // Custom Warm Editorial Dark Theme (Warm Charcoal & Muted Amber/Olive)
    monaco.editor.defineTheme('dapcode-warm-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '78716C', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'F59E0B', fontStyle: 'bold' },
        { token: 'string', foreground: '84CC16' },
        { token: 'number', foreground: 'FBBF24' },
        { token: 'type', foreground: '38BDF8' },
        { token: 'function', foreground: 'F5F2EB' },
      ],
      colors: {
        'editor.background': '#1C1A18',
        'editor.foreground': '#E8E4DC',
        'editorLineNumber.foreground': '#57534E',
        'editorLineNumber.activeForeground': '#A8A29E',
        'editor.lineHighlightBackground': '#24221F',
        'editorCursor.foreground': '#F5F2EB',
        'editor.selectionBackground': '#332F2B',
        'editorIndentGuide.background': '#292623',
        'editorIndentGuide.activeBackground': '#44403C',
      },
    });
  };

  return (
    <div className="flex h-full flex-col border border-[#E8E4DC] dark:border-[#332F2B] bg-[#FFFFFF] dark:bg-[#1C1A18] rounded-xl overflow-hidden">
      {/* Editor Toolbar */}
      <div className="flex h-11 items-center justify-between border-b border-[#E8E4DC] dark:border-[#332F2B] bg-[#FAF8F3] dark:bg-[#24221F] px-4">
        {/* Language selector */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-xs text-stone-600 dark:text-stone-400">
            <Code2 className="h-3.5 w-3.5 text-stone-700 dark:text-stone-300" />
            <span className="font-medium hidden sm:inline text-[11px]">Ngôn ngữ:</span>
          </div>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="rounded-lg border border-[#E8E4DC] dark:border-[#332F2B] bg-white dark:bg-[#1C1A18] px-2.5 py-1 text-xs font-medium text-stone-800 dark:text-stone-200 focus:outline-none"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.key} value={lang.key} className="bg-white dark:bg-[#1C1A18] text-stone-800 dark:text-stone-200">
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Right Tools: AI Tutor & Reset */}
        <div className="flex items-center space-x-2">
          {/* Socratic AI Tutor Button */}
          <button
            type="button"
            onClick={onOpenAiTutor}
            className="flex items-center space-x-1.5 rounded-lg bg-[#1C1917] hover:bg-[#2D2A26] dark:bg-[#F5F2EB] dark:hover:bg-[#E8E4DC] text-white dark:text-[#1C1917] px-2.5 py-1 text-xs font-medium transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Tutor</span>
          </button>

          {/* Reset Code */}
          <button
            type="button"
            onClick={onResetCode}
            title="Khôi phục mã mẫu ban đầu"
            className="flex items-center space-x-1 rounded-lg bg-white hover:bg-stone-100 dark:bg-[#1C1A18] dark:hover:bg-[#24221F] border border-[#E8E4DC] dark:border-[#332F2B] px-2 py-1 text-xs text-stone-600 dark:text-stone-300 transition-colors"
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
          theme={isDark ? 'dapcode-warm-dark' : 'dapcode-warm-light'}
          beforeMount={handleEditorWillMount}
          onChange={(val) => onChange(val || '')}
          options={{
            fontSize: 13,
            fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
            lineHeight: 22,
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
