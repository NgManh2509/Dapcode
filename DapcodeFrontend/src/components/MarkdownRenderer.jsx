import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  return (
    <div className="prose dark:prose-invert max-w-none text-stone-700 dark:text-stone-300 text-sm leading-relaxed space-y-4">
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB] tracking-tight mt-6 mb-3 border-b border-[#E8E4DC] dark:border-[#332F2B] pb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-base font-semibold text-[#1C1917] dark:text-[#F5F2EB] tracking-tight mt-5 mb-2" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-sm font-semibold text-[#1C1917] dark:text-[#F5F2EB] mt-4 mb-1.5" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="my-2 text-stone-700 dark:text-stone-300 leading-relaxed" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside space-y-1 my-2 text-stone-700 dark:text-stone-300" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside space-y-1 my-2 text-stone-700 dark:text-stone-300" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-stone-700 dark:text-stone-300" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-[#1C1917] dark:text-[#F5F2EB]" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            if (!inline && match) {
              return (
                <div className="my-3 overflow-x-auto rounded-lg border border-[#E8E4DC] dark:border-[#332F2B] bg-[#FAF8F3] dark:bg-[#141312] p-3 text-xs font-mono text-stone-800 dark:text-stone-200">
                  <pre className="m-0" {...props}>
                    <code>{children}</code>
                  </pre>
                </div>
              );
            }
            return (
              <code
                className="rounded bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 font-mono text-xs font-medium text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ node, children, ...props }) => (
            <pre className="my-3 overflow-x-auto rounded-lg border border-[#E8E4DC] dark:border-[#332F2B] bg-[#FAF8F3] dark:bg-[#141312] p-3 text-xs font-mono text-stone-800 dark:text-stone-200" {...props}>
              {children}
            </pre>
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-2 border-[#1C1917] dark:border-[#F5F2EB] bg-[#FAF8F3] dark:bg-[#24221F] px-4 py-2 text-stone-700 dark:text-stone-300 rounded-r-lg my-3"
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
