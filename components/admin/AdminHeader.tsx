'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAdminSidebar } from './AdminLayout';

// ============================================================================
// Types
// ============================================================================

interface AdminHeaderProps {
  className?: string;
  title?: string;
  onMenuClick?: () => void;
}

// ============================================================================
// AdminHeader Component
// ============================================================================

export function AdminHeader({ className, title }: AdminHeaderProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { toggle: toggleSidebar } = useAdminSidebar();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Handle logout
  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await signOut({ redirect: false });
    router.push('/admin/login');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (session?.user?.name) {
      return session.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return session?.user?.email?.slice(0, 2).toUpperCase() || 'AD';
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-30 bg-[#0a0f1e]/80 backdrop-blur-md border-b border-white/5',
        className
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left: Hamburger Menu + Page Title */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <motion.button
            onClick={toggleSidebar}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 text-mist hover:text-off-white hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>

          {/* Page Title */}
          {title && (
            <h1 className="text-lg font-semibold text-off-white hidden sm:block">
              {title}
            </h1>
          )}
        </div>

        {/* Right: User Menu */}
        <div className="user-menu-container relative">
          <motion.button
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-coral/20 flex items-center justify-center">
              <span className="text-xs font-bold text-coral">
                {getUserInitials()}
              </span>
            </div>

            {/* User Name (hidden on mobile) */}
            <span className="hidden md:block text-sm font-medium text-off-white">
              {session?.user?.name || 'Admin'}
            </span>

            {/* Chevron Icon */}
            <motion.svg
              className={cn(
                'w-4 h-4 text-mist transition-transform duration-200',
                isUserMenuOpen && 'rotate-180'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </motion.button>

          {/* Dropdown Menu */}
          {isUserMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-56 bg-[#1a2332] border border-white/10 rounded-lg shadow-xl overflow-hidden"
            >
              {/* User Info */}
              <div className="p-4 border-b border-white/5">
                <p className="text-sm font-medium text-off-white">
                  {session?.user?.name || 'Admin'}
                </p>
                <p className="text-xs text-mist truncate">
                  {session?.user?.email}
                </p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    router.push('/admin/settings');
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-mist hover:text-off-white hover:bg-white/5 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
                <hr className="border-white/5 my-1" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-coral hover:bg-coral/10 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}
