'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: string;
  userName?: string;
  department?: string;
}

export default function DashboardLayout({
  children,
  userRole = 'PROCUREMENT_OFFICER',
  userName = 'Dr. Ananya Sharma',
  department = 'Ministry of Petroleum & Natural Gas',
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar userRole={userRole} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header userName={userName} userRole={userRole} department={department} />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
