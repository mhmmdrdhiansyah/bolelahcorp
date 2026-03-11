'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface BlogContentProps {
  content: string;
  className?: string;
}

// ============================================================================
// Custom Components for Markdown Elements
// ============================================================================

const MarkdownComponents = {
  // Headings
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        'text-3xl md:text-4xl lg:text-5xl font-bold text-off-white mt-12 mb-6 first:mt-0 scroll-mt-24',
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        'text-2xl md:text-3xl lg:text-4xl font-bold text-off-white mt-10 mb-5 first:mt-0 scroll-mt-24',
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        'text-xl md:text-2xl font-semibold text-off-white mt-8 mb-4 first:mt-0 scroll-mt-24',
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn(
        'text-lg md:text-xl font-semibold text-off-white mt-6 mb-3 first:mt-0 scroll-mt-24',
        className
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5
      className={cn(
        'text-base md:text-lg font-semibold text-off-white mt-5 mb-2 first:mt-0 scroll-mt-24',
        className
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6
      className={cn(
        'text-sm md:text-base font-semibold text-mist mt-4 mb-2 first:mt-0 uppercase tracking-wide',
        className
      )}
      {...props}
    />
  ),

  // Paragraphs
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn(
        'text-base md:text-lg text-mist/90 leading-relaxed mb-6 first-letter:text-3xl first-letter:font-bold first-letter:text-coral',
        className
      )}
      {...props}
    />
  ),

  // Lists
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={cn('space-y-3 mb-6 pl-6 list-disc marker:text-coral', className)}
      {...props}
    />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={cn('space-y-3 mb-6 pl-6 list-decimal marker:text-steel', className)}
      {...props}
    />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li
      className={cn('text-mist/90 leading-relaxed pl-2', className)}
      {...props}
    />
  ),

  // Links
  a: ({ className, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={href}
      className={cn(
        'text-coral hover:text-coral-light underline underline-offset-4 hover:underline-offset-2 transition-all duration-200 font-medium',
        href?.startsWith('http') && 'inline-flex items-center gap-1',
        className
      )}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {props.children}
      {href?.startsWith('http') && (
        <svg className="w-3.5 h-3.5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      )}
    </a>
  ),

  // Blockquotes
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={cn(
        'border-l-4 border-coral pl-6 py-4 my-6 bg-coral/5 rounded-r-lg italic text-mist/80',
        className
      )}
      {...props}
    />
  ),

  // Code
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    // Check if this is inline code or code block
    const isInline = !className?.includes('hljs');

    if (isInline) {
      return (
        <code
          className={cn(
            'px-2 py-1 rounded bg-steel/30 text-coral font-mono text-sm border border-steel/50',
            className
          )}
          {...props}
        />
      );
    }

    return <code className={cn('font-mono text-sm', className)} {...props} />;
  },
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className={cn(
        'overflow-x-auto p-4 rounded-xl bg-navy-dark border border-steel/30 my-6',
        className
      )}
      {...props}
    />
  ),

  // Horizontal Rule
  hr: ({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr
      className={cn('my-8 border-t border-white/10', className)}
      {...props}
    />
  ),

  // Images
  img: ({ className, src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img
      src={src}
      alt={alt}
      className={cn('rounded-xl my-6 border border-white/10', className)}
      {...props}
    />
  ),

  // Tables
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6">
      <table
        className={cn('min-w-full divide-y divide-white/10 rounded-lg overflow-hidden', className)}
        {...props}
      />
    </div>
  ),
  thead: ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className={cn('bg-steel/20', className)} {...props} />
  ),
  tbody: ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className={cn('divide-y divide-white/10 bg-white/5', className)} {...props} />
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className={cn('hover:bg-white/5 transition-colors', className)} {...props} />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn('px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-off-white', className)}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className={cn('px-6 py-4 text-sm text-mist/90 whitespace-nowrap', className)} {...props} />
  ),

  // Strong and Emphasis
  strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className={cn('font-bold text-off-white', className)} {...props} />
  ),
  em: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <em className={cn('italic text-off-white', className)} {...props} />
  ),

  // Delete
  del: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <del className={cn('line-through text-mist/50', className)} {...props} />
  ),
};

// ============================================================================
// Blog Content Component
// ============================================================================

export function BlogContent({ content, className }: BlogContentProps) {
  return (
    <div className={cn('prose prose-invert max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={MarkdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
