'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface NavLink {
  name: string;
  href: string;
}

interface HeaderProps {
  className?: string;
  links?: NavLink[];
}

// ============================================================================
// Default Navigation Links
// ============================================================================

const defaultLinks: NavLink[] = [
  { name: 'Home', href: '/' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/#contact' },
];

// ============================================================================
// Header Component
// ============================================================================

export function Header({ className, links = defaultLinks }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Scroll detection for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Handle link clicks with smooth scroll for anchor links
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
      }
    } else {
      setIsMenuOpen(false);
    }
  };

  // Check if link is active
  const isActive = (href: string) => {
    if (href.startsWith('#')) return false;
    return pathname === href;
  };

  return (
    <>
      {/* Header */}
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          'bg-navy/80 backdrop-blur-md border-b border-mist/10',
          scrolled && 'shadow-lg shadow-coral/5',
          className
        )}
      >
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <motion.span
                className="text-xl md:text-2xl font-bold text-off-white"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Bolehah Corp
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {links.map((link) => (
                <div key={link.name} className="relative group">
                  <Link
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={cn(
                      'text-sm font-medium transition-colors duration-300 relative py-2',
                      isActive(link.href)
                        ? 'text-coral'
                        : 'text-mist hover:text-off-white group-hover:text-coral'
                    )}
                  >
                    {link.name}
                    {/* Underline animation for active/hover state */}
                    <motion.div
                      className={cn(
                        'absolute bottom-0 left-0 h-0.5 bg-coral',
                        isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                      )}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </div>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-steel/20 text-off-white hover:bg-coral hover:text-off-white transition-colors duration-300"
              onClick={() => setIsMenuOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-navy/90 backdrop-blur-md z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-navy border-l border-mist/10 z-50 md:hidden flex flex-col"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-mist/10">
                <span className="text-xl font-bold text-off-white">Menu</span>
                <motion.button
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-steel/20 text-off-white hover:bg-coral hover:text-off-white transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Menu Links */}
              <nav className="flex-1 p-6 space-y-2">
                {links.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className={cn(
                        'block px-4 py-3 rounded-lg text-lg font-medium transition-all duration-300',
                        isActive(link.href)
                          ? 'bg-coral text-off-white'
                          : 'text-mist hover:bg-steel/20 hover:text-off-white'
                      )}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Menu Footer */}
              <div className="p-6 border-t border-mist/10">
                <p className="text-mist/60 text-sm text-center">
                  © {new Date().getFullYear()} Bolehah Corp
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
