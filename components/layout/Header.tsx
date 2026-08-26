'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Bell, Shield, User, Play } from 'lucide-react';

interface HeaderProps {
  userName?: string;
  userRole?: string;
  department?: string;
}

export default function Header({
  userName = 'Dr. Ananya Sharma',
  userRole = 'PROCUREMENT_OFFICER',
  department = 'Ministry of Petroleum & Natural Gas',
}: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      {/* Department & Title */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{department}</span>
          <span className="text-sm font-bold text-[#0B3A5B] flex items-center gap-2">
            GeM Bid Verification Platform
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#138A4B]/10 text-[#138A4B] font-medium border border-[#138A4B]/20">
              DEMO ONLINE
            </span>
          </span>
        </div>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-4">
        {/* Quick Hackathon Demo Launcher */}
        <Link
          href="/bids"
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#F4B400] text-[#0B3A5B] font-bold text-xs shadow hover:bg-[#e0a500] transition"
        >
          <Play className="w-3.5 h-3.5 fill-[#0B3A5B]" />
          <span>Quick Demo Scenario</span>
        </Link>

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:text-[#0B3A5B] hover:bg-slate-100 rounded-full transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C62828] rounded-full ring-2 ring-white"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-[#0B3A5B] text-white font-bold flex items-center justify-center text-xs">
            {userName.charAt(0)}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-[#17202A] leading-none">{userName}</p>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded inline-block mt-0.5">
              {userRole}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
