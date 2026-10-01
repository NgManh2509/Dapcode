import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  return (
    <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-zinc-300 text-sm leading-relaxed space-y-4">
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-6 mb-3 border-b border-slate-200 dark:border-zinc-800 pb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-lg font-semibold text-slate-800 dark:text-zinc-100 tracking-tight mt-5 mb-2" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-base font-semibold text-slate-800 dark:text-zinc-200 mt-4 mb-1.5" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="my-2 text-slate-700 dark:text-zinc-300 leading-normal" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside space-y-1 my-2 text-slate-700 dark:text-zinc-300" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside space-y-1 my-2 text-slate-700 dark:text-zinc-300" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-slate-700 dark:text-zinc-300" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-slate-900 dark:text-white" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            if (!inline && match) {
              return (
                <div className="my-3 overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-[#121319] p-3 text-xs font-mono text-slate-800 dark:text-zinc-200 shadow-xs">
                  <pre className="m-0" {...props}>
                    <code>{children}</code>
                  </pre>
                </div>
              );
            }
            return (
              <code
                className="rounded bg-slate-100 dark:bg-zinc-800/80 px-1.5 py-0.5 font-mono text-xs font-medium text-indigo-700 dark:text-indigo-300 border border-slate-200 dark:border-zinc-700/50"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ node, children, ...props }) => (
            <pre className="my-3 overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-[#121319] p-3 text-xs font-mono text-slate-800 dark:text-zinc-200" {...props}>
              {children}
            </pre>
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 px-4 py-2 italic text-slate-700 dark:text-zinc-300 rounded-r-md my-3"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

