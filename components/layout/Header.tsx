'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface HeaderProps {
  userName?: string;
  userRole?: string;
  department?: string;
}

export default function Header(props: HeaderProps) {
  const { user, logout } = useAuth();

  const name = user?.name || props.userName || 'User';
  const role = user?.role || props.userRole || 'PROCUREMENT_OFFICER';
  const dept = user?.department || props.department || 'Ministry of Petroleum & Natural Gas';

  const isBidder = role === 'BIDDER';

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      {/* Department & Title */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{dept}</span>
          <span className="text-sm font-bold text-[#0B3A5B] flex items-center gap-2">
            GeM Bid Verification Platform
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#138A4B]/10 text-[#138A4B] font-medium border border-[#138A4B]/20">
              SECURE SESSION
            </span>
          </span>
        </div>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-4">
        {/* Role Portal Indicator */}
        <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#0B3A5B]/10 text-[#0B3A5B] border border-[#0B3A5B]/20">
          {role.replace('_', ' ')} PORTAL
        </span>

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:text-[#0B3A5B] hover:bg-slate-100 rounded-full transition" title="Notifications">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C62828] rounded-full ring-2 ring-white"></span>
        </button>

        {/* User Profile & Sign Out */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-[#0B3A5B] text-white font-bold flex items-center justify-center text-xs">
            {name.charAt(0)}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-[#17202A] leading-none">{name}</p>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded inline-block mt-0.5">
              {role}
            </span>
          </div>

          {/* Explicit Sign Out Button */}
          <button
            onClick={logout}
            className="ml-2 px-3 py-1.5 bg-slate-100 hover:bg-[#C62828]/10 text-slate-700 hover:text-[#C62828] text-xs font-bold rounded-lg border border-slate-200 transition flex items-center gap-1.5"
            title="Sign out of active account session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

