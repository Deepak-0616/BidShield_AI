'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, ArrowLeft, UserCheck, FileText, ShieldAlert, CheckCircle2 } from 'lucide-react';

const ROLE_CONFIGS: Record<string, {
  name: string;
  email: string;
  pass: string;
  title: string;
  subtitle: string;
  badgeBg: string;
  icon: any;
}> = {
  officer: {
    name: 'Procurement Officer',
    email: 'officer@bidshield.demo',
    pass: 'Officer@123',
    title: 'Procurement Officer Portal',
    subtitle: 'Ministry of Petroleum & Natural Gas - Official Sign In',
    badgeBg: 'bg-[#0B3A5B]',
    icon: UserCheck,
  },
  bidder: {
    name: 'Bidder / Vendor',
    email: 'bidder@novatech.demo',
    pass: 'Bidder@123',
    title: 'Bidder & Vendor Portal',
    subtitle: 'NovaTech Systems - Vendor Bid Management',
    badgeBg: 'bg-[#138A4B]',
    icon: FileText,
  },
  admin: {
    name: 'System Admin',
    email: 'admin@bidshield.demo',
    pass: 'Admin@123',
    title: 'System Administrator Portal',
    subtitle: 'Procurement Verification Division - Governance Admin',
    badgeBg: 'bg-[#D98200]',
    icon: ShieldAlert,
  },
  audit: {
    name: 'Principal Auditor',
    email: 'auditor@bidshield.demo',
    pass: 'Auditor@123',
    title: 'Principal Auditor Portal',
    subtitle: 'Independent Governance Cell - Audit Oversight',
    badgeBg: 'bg-[#C62828]',
    icon: CheckCircle2,
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'officer' | 'bidder' | 'admin' | 'audit'>('officer');
  const [email, setEmail] = useState('officer@bidshield.demo');
  const [password, setPassword] = useState('Officer@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlRole = params.get('role')?.toLowerCase();
      const urlEmail = params.get('email');
      const urlPassword = params.get('password');

      let targetRole: 'officer' | 'bidder' | 'admin' | 'audit' = 'officer';

      if (urlRole === 'bidder') targetRole = 'bidder';
      else if (urlRole === 'admin') targetRole = 'admin';
      else if (urlRole === 'audit' || urlRole === 'auditor') targetRole = 'audit';
      else if (urlRole === 'officer') targetRole = 'officer';

      setSelectedRole(targetRole);

      const config = ROLE_CONFIGS[targetRole];
      setEmail(urlEmail || config.email);
      setPassword(urlPassword || config.pass);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.user.role === 'BIDDER') {
          router.push('/bidder/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(data.error?.message || 'Login failed.');
      }
    } catch (err: any) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentConfig = ROLE_CONFIGS[selectedRole];
  const IconComponent = currentConfig.icon;

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-between">
      {/* Top Bar */}
      <div className="bg-[#0B3A5B] text-white text-xs py-2 px-6 flex items-center justify-between border-b border-[#1261A0]">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#F4B400]" />
          <span className="font-bold">BidShield AI</span>
          <span>• Smart Procurement Intelligence System</span>
        </div>
        <Link href="/" className="text-[#F4B400] hover:underline flex items-center gap-1 text-[11px] font-semibold">
          <ArrowLeft className="w-3 h-3" />
          <span>Back to Landing Page</span>
        </Link>
      </div>

      {/* Main Login Container */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden gold-accent-border">
          {/* Header */}
          <div className={`${currentConfig.badgeBg} p-8 text-white text-center transition-colors duration-300`}>
            <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center font-black mx-auto mb-3 shadow">
              <IconComponent className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold">{currentConfig.title}</h2>
            <p className="text-xs text-slate-200 mt-1">{currentConfig.subtitle}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-[#FFEBEE] border border-[#EF9A9A] text-[#C62828] text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email Address / Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#0B3A5B] focus:border-transparent outline-none transition"
                  placeholder={currentConfig.email}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#0B3A5B] focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 ${currentConfig.badgeBg} text-white font-bold rounded-lg hover:opacity-90 transition shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50`}
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-slate-200 p-4 text-center text-xs text-slate-500">
        Demo environment — all procurement documents and verification responses are synthetic for SIH26100 evaluation.
      </div>
    </div>
  );
}
