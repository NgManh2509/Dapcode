import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  return (
    <div className="prose dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed space-y-4">
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-lg font-bold text-[#262626] dark:text-[#EFF1F6] tracking-tight mt-6 mb-3 border-b border-[#E6E6E6] dark:border-[#3E3E3E] pb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-base font-semibold text-[#262626] dark:text-[#EFF1F6] tracking-tight mt-5 mb-2" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-sm font-semibold text-[#262626] dark:text-[#EFF1F6] mt-4 mb-1.5" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="my-2 text-neutral-700 dark:text-neutral-300 leading-relaxed" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside space-y-1 my-2 text-neutral-700 dark:text-neutral-300" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside space-y-1 my-2 text-neutral-700 dark:text-neutral-300" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-neutral-700 dark:text-neutral-300" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-[#262626] dark:text-[#EFF1F6]" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            if (!inline && match) {
              return (
                <div className="my-3 overflow-x-auto rounded-lg border border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#F7F8FA] dark:bg-[#1A1A1A] p-3 text-xs font-mono text-neutral-800 dark:text-neutral-200">
                  <pre className="m-0" {...props}>
                    <code>{children}</code>
                  </pre>
                </div>
              );
            }
            return (
              <code
                className="rounded bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 font-mono text-xs font-medium text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ node, children, ...props }) => (
            <pre className="my-3 overflow-x-auto rounded-lg border border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#F7F8FA] dark:bg-[#1A1A1A] p-3 text-xs font-mono text-neutral-800 dark:text-neutral-200" {...props}>
              {children}
            </pre>
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-2 border-[#262626] dark:border-[#EFF1F6] bg-[#F7F8FA] dark:bg-[#333333] px-4 py-2 text-neutral-700 dark:text-neutral-300 rounded-r-lg my-3"
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
