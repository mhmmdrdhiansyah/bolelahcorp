'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// ============================================================================
// Admin Sidebar Context
// ============================================================================

interface AdminSidebarContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextValue | undefined>(
  undefined
);

export function useAdminSidebar() {
  const context = useContext(AdminSidebarContext);
  if (!context) {
    throw new Error('useAdminSidebar must be used within AdminSidebarProvider');
  }
  return context;
}

interface AdminSidebarProviderProps {
  children: ReactNode;
}

export function AdminSidebarProvider({ children }: AdminSidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const value = {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };

  return (
    <AdminSidebarContext.Provider value={value}>
      {children}
    </AdminSidebarContext.Provider>
  );
}
