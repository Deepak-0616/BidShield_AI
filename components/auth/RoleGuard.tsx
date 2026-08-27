'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Shield, RefreshCw } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: ('ADMIN' | 'PROCUREMENT_OFFICER' | 'BIDDER' | 'AUDITOR')[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (!allowedRoles.includes(user.role)) {
        if (user.role === 'BIDDER') {
          router.replace('/bidder/dashboard');
        } else {
          router.replace('/dashboard');
        }
      }
    }
  }, [user, loading, allowedRoles, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-[#0B3A5B] text-white flex items-center justify-center font-bold mb-4 shadow-md animate-pulse">
          <Shield className="w-7 h-7 text-[#F4B400]" />
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-[#0B3A5B]">
          <RefreshCw className="w-4 h-4 animate-spin text-[#1261A0]" />
          <span>Verifying Session & Role Permissions...</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">BidShield AI Security Layer</p>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
