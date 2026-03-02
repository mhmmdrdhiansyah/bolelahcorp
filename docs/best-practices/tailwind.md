# Tailwind CSS Best Practices

## Configuration

### 1. Extend Theme with Custom Colors

```js
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors from PRD
        navy: {
          DEFAULT: '#1D3557',
          light: '#2A4A73',
          dark: '#152540'
        },
        steel: {
          DEFAULT: '#457B9D',
          light: '#5A8FB0',
          dark: '#36627D'
        },
        coral: {
          DEFAULT: '#E63946',
          light: '#F06B76',
          dark: '#C4202D'
        },
        'off-white': {
          DEFAULT: '#F1FAEE',
          dark: '#E0E9DD'
        },
        mist: {
          DEFAULT: '#A8DADC',
          light: '#BCE5E7',
          dark: '#8AC0C2'
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
        display: ['var(--font-display)', 'sans-serif']
      },
      fontSize: {
        'hero': ['clamp(2.5rem, 5vw + 1rem, 4.5rem)', { lineHeight: '1.1' }],
        'section-title': ['clamp(1.8rem, 3vw + 1rem, 3rem)', { lineHeight: '1.2' }]
      },
      spacing: {
        '18': '4.5rem',
        '128': '32rem'
      },
      borderRadius: {
        '4xl': '2rem'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio')
  ]
}

export default config
```

### 2. CSS Variables for Theme

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Colors */
    --color-navy: #1D3557;
    --color-steel: #457B9D;
    --color-coral: #E63946;
    --color-off-white: #F1FAEE;
    --color-mist: #A8DADC;

    /* Spacing */
    --section-padding: clamp(4rem, 10vw, 8rem);

    /* Border Radius */
    --radius-sm: 0.25rem;
    --radius-md: 0.5rem;
    --radius-lg: 1rem;
    --radius-xl: 1.5rem;

    /* Transitions */
    --transition-fast: 150ms ease;
    --transition-base: 250ms ease;
    --transition-slow: 350ms ease;
  }

  * {
    @apply border-border;
  }

  html {
    @apply scroll-smooth;
  }

  body {
    @apply bg-navy text-off-white font-sans antialiased;
  }
}

@layer components {
  /* Container */
  .container {
    @apply mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl;
  }

  /* Section */
  .section {
    @apply py-20 lg:py-32;
  }

  /* Buttons */
  .btn {
    @apply inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200;
  }

  .btn-primary {
    @apply btn bg-coral text-off-white hover:bg-coral-dark hover:shadow-lg hover:scale-105 active:scale-95;
  }

  .btn-secondary {
    @apply btn bg-transparent border-2 border-mist text-mist hover:bg-mist hover:text-navy;
  }

  .btn-ghost {
    @apply btn bg-transparent text-off-white hover:bg-steel/20;
  }

  /* Cards */
  .card {
    @apply bg-steel rounded-xl p-6 shadow-lg;
  }

  .card-hover {
    @apply card transition-all duration-300 hover:shadow-2xl hover:-translate-y-1;
  }

  /* Inputs */
  .input {
    @apply w-full px-4 py-3 rounded-lg border-2 border-mist/30 bg-steel/20 text-off-white placeholder-mist/50 focus:outline-none focus:border-coral transition-colors;
  }

  /* Typography */
  .section-title {
    @apply text-section-title font-bold text-center mb-4;
  }

  .section-subtitle {
    @apply text-lg text-mist text-center mb-12 max-w-2xl mx-auto;
  }
}

@layer utilities {
  /* Text gradient */
  .text-gradient {
    @apply bg-gradient-to-r from-mist to-coral bg-clip-text text-transparent;
  }

  /* Glass effect */
  .glass {
    @apply bg-white/10 backdrop-blur-md border border-white/20;
  }

  /* Hide scrollbar but keep functionality */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

## Component Patterns

### 1. Button Component

```tsx
// components/ui/button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'active:scale-95',
          {
            // Variants
            'bg-coral text-off-white hover:bg-coral-dark hover:shadow-lg shadow-coral/20': variant === 'primary',
            'bg-transparent border-2 border-mist text-mist hover:bg-mist hover:text-navy': variant === 'secondary',
            'bg-transparent text-off-white hover:bg-white/10': variant === 'ghost',
            'bg-red-500 text-white hover:bg-red-600': variant === 'danger',

            // Sizes
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-6 py-3 text-base': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',

            // Full width
            'w-full': fullWidth
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
```

### 2. Card Component

```tsx
// components/ui/card.tsx
import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-steel/30 backdrop-blur-sm rounded-xl border border-mist/20 overflow-hidden',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6', className)} {...props} />
  )
)

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0 flex items-center', className)} {...props} />
  )
)
```

### 3. Badge Component

```tsx
// components/ui/badge.tsx
import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

export function Badge({ className, variant = 'default', children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-mist/20 text-mist': variant === 'default',
          'bg-green-500/20 text-green-400': variant === 'success',
          'bg-yellow-500/20 text-yellow-400': variant === 'warning',
          'bg-red-500/20 text-red-400': variant === 'danger',
          'bg-blue-500/20 text-blue-400': variant === 'info'
        },
        className
      )}
    >
      {children}
    </span>
  )
}
```

## Responsive Design Patterns

### 1. Mobile-First Approach

```tsx
// ✅ Good - Mobile-first (base is mobile, add responsive modifiers)
<div className="p-4 md:p-6 lg:p-8">
  <h1 className="text-2xl md:text-3xl lg:text-4xl">Title</h1>
  <p className="text-sm md:text-base">Description</p>
</div>

// ❌ Bad - Desktop-first
<div className="p-8 md:p-6 md:p-4">
  <h1 className="text-4xl md:text-3xl md:text-2xl">Title</h1>
</div>
```

### 2. Grid Layouts

```tsx
// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {items.map(item => <div key={item.id}>{item.name}</div>)}
</div>

// Auto-fit grid
<div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
  {projects.map(project => <ProjectCard key={project.id} {...project} />)}
</div>

// Masonry-like layout
<div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
  {images.map(img => <img key={img} src={img} className="mb-4 break-inside-avoid" />)}
</div>
```

### 3. Container Queries (Experimental)

```tsx
// Using Tailwind's container queries
<div className="@container">
  <div className="@lg:grid @lg:grid-cols-2 flex flex-col gap-4">
    <div>Item 1</div>
    <div>Item 2</div>
  </div>
</div>
```

## Animation Patterns

### 1. Hover Effects

```tsx
// Scale + Shadow
<div className="transition-all duration-300 hover:scale-105 hover:shadow-2xl">

// Color transition
<button className="bg-coral text-white transition-colors duration-200 hover:bg-coral-dark">

// Underline animation
<a className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-coral after:transition-all hover:after:w-full">

// Icon animation
<svg className="transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1">
```

### 2. Stagger Animations

```tsx
// With Framer Motion-like approach using CSS
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {items.map((item, index) => (
    <div
      key={item.id}
      className="animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {item.content}
    </div>
  ))}
</div>
```

### 3. Loading States

```tsx
// Skeleton loader
<div className="animate-pulse">
  <div className="h-4 bg-mist/20 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-mist/20 rounded w-1/2"></div>
</div>

// Spinner
<div className="animate-spin h-8 w-8 border-4 border-mist/30 border-t-coral rounded-full"></div>
```

## Common Patterns

### 1. Section Container

```tsx
// components/ui/section.tsx
interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  container?: boolean
}

export function Section({ children, className, id, container = true }: SectionProps) {
  return (
    <section id={id} className={cn('py-20 lg:py-32', className)}>
      {container ? <div className="container">{children}</div> : children}
    </section>
  )
}
```

### 2. Hero Section

```tsx
export function Hero({ title, subtitle, cta }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-steel" />

      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-coral rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-mist rounded-full filter blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="container relative z-10 text-center">
        <h1 className="text-hero font-bold text-gradient mb-6 animate-fade-in">
          {title}
        </h1>
        <p className="text-xl text-mist max-w-2xl mx-auto mb-8 animate-slide-up">
          {subtitle}
        </p>
        <div className="flex gap-4 justify-center animate-slide-up" style={{ animationDelay: '200ms' }}>
          {cta}
        </div>
      </div>
    </section>
  )
}
```

### 3. Modal/Dialog

```tsx
// components/ui/modal.tsx
'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative bg-steel rounded-xl shadow-2xl max-w-lg w-full animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-mist hover:text-off-white"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}
```

## Typography Plugin

```tsx
// Using @tailwindcss/typography for blog content
<article className="prose prose-lg prose-invert prose-headings:text-gradient prose-a:text-coral prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-pre:bg-navy">
  <MDXContent />
</article>
```

## Forms Plugin

```tsx
// Using @tailwindcss/forms
<form className="space-y-4">
  <input type="text" placeholder="Name" className="input" />
  <input type="email" placeholder="Email" className="input" />
  <select className="input">
    <option>Option 1</option>
    <option>Option 2</option>
  </select>
  <textarea rows={4} className="input" />
  <label className="flex items-center gap-2">
    <input type="checkbox" className="rounded border-mist bg-steel/20 text-coral focus:ring-coral" />
    <span>Accept terms</span>
  </label>
</form>
```

## Dark Mode (if needed)

```js
// tailwind.config.ts
export default {
  darkMode: 'class', // or 'media'
  // ...
}
```

```tsx
// Toggle dark mode
<button
  onClick={() => document.documentElement.classList.toggle('dark')}
  className="..."
>
  Toggle Theme
</button>
```

## Utilities

```ts
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Best Practices Summary

1. **Use @layer directives** - Organize custom styles in @layer base, components, utilities
2. **Mobile-first** - Write base styles for mobile, add modifiers for larger screens
3. **Extract components** - Create reusable components for common patterns
4. **Use arbitrary values sparingly** - Prefer extending theme over `[value]`
5. **Purge unused styles** - Tailwind automatically removes unused CSS in production
6. **Use semantic color names** - `text-coral` instead of `text-red-500`
7. **Consistent spacing** - Use spacing scale consistently
8. **Group hover** - Use `group` for parent hover effects on children
9. **Focus states** - Always include focus styles for accessibility
10. **Container queries** - Consider for component-level responsiveness

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/)
- [Headless UI](https://headlessui.com/)
