'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  FileCheck,
  ShieldCheck,
  AlertTriangle,
  Link2,
  Scale,
  Bot,
  BarChart3,
  FileCheck2,
  History,
  Settings,
  Shield,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  userRole?: string;
}

export default function Sidebar({ userRole = 'PROCUREMENT_OFFICER' }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'AUDITOR'] },
    { name: 'Tenders', href: '/tenders', icon: FileText, roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'BIDDER', 'AUDITOR'] },
    { name: 'Bids', href: '/bids', icon: FileCheck, roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'AUDITOR'] },
    { name: 'Compliance', href: '/bids', icon: ShieldCheck, roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'AUDITOR'] },
    { name: 'Risk Intelligence', href: '/bids', icon: AlertTriangle, roles: ['ADMIN', 'PROCUREMENT_OFFICER'] },
    { name: 'Verification Center', href: '/verification', icon: Link2, roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'AUDITOR'] },
    { name: 'Bid Comparison', href: '/compare', icon: Scale, roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'AUDITOR'] },
    { name: 'Ask BidShield', href: '/bids', icon: Bot, roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'AUDITOR'] },
    { name: 'Reports', href: '/reports', icon: FileCheck2, roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'AUDITOR'] },
    { name: 'Audit Trail', href: '/audit', icon: History, roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'AUDITOR'] },
    { name: 'Bidder Portal', href: '/bidder/dashboard', icon: FileText, roles: ['BIDDER'] },
    { name: 'Admin Panel', href: '/admin/users', icon: Settings, roles: ['ADMIN'] },
  ];

  const filteredNav = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-[#0B3A5B] text-white min-h-screen flex flex-col shadow-xl z-20">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-[#1261A0]">
        <div className="w-10 h-10 rounded-lg bg-[#F4B400] flex items-center justify-center text-[#0B3A5B] font-extrabold shadow-md">
          <Shield className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
            BidShield <span className="text-[#F4B400] text-xs font-semibold px-1.5 py-0.5 rounded bg-white/10">AI</span>
          </h1>
          <p className="text-[10px] text-slate-300 font-medium tracking-wide">SIH26100 • MoPNG Procurement</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {filteredNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#1261A0] text-white font-semibold shadow-inner border-l-4 border-[#F4B400]'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#F4B400]' : 'text-slate-300'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Role Footer */}
      <div className="p-4 border-t border-[#1261A0] bg-[#082C46]/60">
        <div className="flex items-center justify-between">
          <div className="truncate">
            <p className="text-xs font-bold text-white truncate">{userRole.replace('_', ' ')}</p>
            <p className="text-[10px] text-slate-400">Authenticated Session</p>
          </div>
          <Link
            href="/login"
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
