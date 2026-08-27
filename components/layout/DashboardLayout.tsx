'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '@/lib/auth-context';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: string;
  userName?: string;
  department?: string;
}

export default function DashboardLayout({
  children,
  userRole,
  userName,
  department,
}: DashboardLayoutProps) {
  const { user } = useAuth();

  const role = user?.role || userRole;
  const name = user?.name || userName;
  const dept = user?.department || department;

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar userRole={role} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header userName={name} userRole={role} department={dept} />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

