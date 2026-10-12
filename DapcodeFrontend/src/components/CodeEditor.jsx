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
    monaco.editor.defineTheme('dapcode-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '8A8A8A', fontStyle: 'italic' },
        { token: 'keyword', foreground: '0000FF' },
        { token: 'string', foreground: 'A31515' },
        { token: 'number', foreground: '098658' },
        { token: 'type', foreground: '267F99' },
      ],
      colors: {
        'editor.background': '#FFFFFF',
        'editor.foreground': '#262626',
        'editorLineNumber.foreground': '#9A9A9A',
        'editorLineNumber.activeForeground': '#595959',
        'editor.lineHighlightBackground': '#F7F8FA',
        'editorCursor.foreground': '#262626',
        'editor.selectionBackground': '#D9E8FF',
        'editorIndentGuide.background': '#EFEFEF',
        'editorIndentGuide.activeBackground': '#D1D1D1',
      },
    });

    monaco.editor.defineTheme('dapcode-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '7A7A7A', fontStyle: 'italic' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'type', foreground: '4EC9B0' },
      ],
      colors: {
        'editor.background': '#282828',
        'editor.foreground': '#E6E6E6',
        'editorLineNumber.foreground': '#6B6B6B',
        'editorLineNumber.activeForeground': '#9A9A9A',
        'editor.lineHighlightBackground': '#303030',
        'editorCursor.foreground': '#EFF1F6',
        'editor.selectionBackground': '#3E4B63',
        'editorIndentGuide.background': '#343434',
        'editorIndentGuide.activeBackground': '#595959',
      },
    });
  };

  return (
    <div className="flex h-full flex-col bg-[#FFFFFF] dark:bg-[#282828] rounded-lg overflow-hidden">
      {/* Editor Toolbar */}
      <div className="flex h-10 items-center justify-between border-b border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#F7F8FA] dark:bg-[#333333] px-4">
        {/* Language selector */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-xs text-neutral-600 dark:text-neutral-400">
            <Code2 className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300" />
            <span className="font-medium hidden sm:inline text-[11px]">Ngôn ngữ:</span>
          </div>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="rounded-lg border border-[#E6E6E6] dark:border-[#3E3E3E] bg-white dark:bg-[#282828] px-2.5 py-1 text-xs font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.key} value={lang.key} className="bg-white dark:bg-[#282828] text-neutral-800 dark:text-neutral-200">
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
            className="flex items-center space-x-1.5 rounded-lg bg-[#262626] hover:bg-[#3C3C3C] dark:bg-[#EFF1F6] dark:hover:bg-[#E6E6E6] text-white dark:text-[#262626] px-2.5 py-1 text-xs font-medium transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Tutor</span>
          </button>

          {/* Reset Code */}
          <button
            type="button"
            onClick={onResetCode}
            title="Khôi phục mã mẫu ban đầu"
            className="flex items-center space-x-1 rounded-lg bg-white hover:bg-neutral-100 dark:bg-[#282828] dark:hover:bg-[#333333] border border-[#E6E6E6] dark:border-[#3E3E3E] px-2 py-1 text-xs text-neutral-600 dark:text-neutral-300 transition-colors"
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
          theme={isDark ? 'dapcode-dark' : 'dapcode-light'}
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
