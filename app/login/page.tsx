'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, UserCheck, ShieldAlert, FileText, AlertCircle } from 'lucide-react';


export default function LoginPage() {
  const router = useRouter();
  const { user, refetchSession } = useAuth();

  const [email, setEmail] = useState('officer@bidshield.demo');
  const [password, setPassword] = useState('Officer@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      if (user.role === 'BIDDER') {
        router.replace('/bidder/dashboard');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [user, router]);

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
        await refetchSession();
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

  const setDemoAccount = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-between">
      {/* Top Bar */}
      <div className="bg-[#0B3A5B] text-white text-xs py-2 px-6 flex items-center justify-between border-b border-[#1261A0]">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#F4B400]" />
          <span className="font-bold">BidShield AI</span>
          <span>• Smart Procurement Intelligence System</span>
        </div>
        <span className="text-[#F4B400] font-semibold text-[11px]">SIH26100 Hackathon Demonstration</span>
      </div>

      {/* Main Login Container */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden gold-accent-border">
          {/* Header */}
          <div className="bg-[#0B3A5B] p-8 text-white text-center">
            <div className="w-12 h-12 rounded-xl bg-[#F4B400] text-[#0B3A5B] flex items-center justify-center font-black mx-auto mb-3 shadow">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold">Government Enterprise Portal</h2>
            <p className="text-xs text-slate-300 mt-1">Ministry of Petroleum & Natural Gas - GeM Verification</p>
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
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#0B3A5B] focus:border-transparent outline-none transition"
                  placeholder="officer@bidshield.demo"
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
              className="w-full py-3 px-4 bg-[#0B3A5B] text-white font-bold rounded-lg hover:bg-[#082C46] transition shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* DEMO ACCOUNTS QUICK LOGIN SELECTOR */}
            <div className="pt-4 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 text-center">
                Quick Demo Role Switcher
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDemoAccount('officer@bidshield.demo', 'Officer@123')}
                  className={`p-2 rounded border text-left flex items-center gap-2 transition ${
                    email === 'officer@bidshield.demo'
                      ? 'border-[#0B3A5B] bg-[#0B3A5B]/10 font-bold text-[#0B3A5B]'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#1261A0]" />
                  <span>Officer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoAccount('bidder@novatech.demo', 'Bidder@123')}
                  className={`p-2 rounded border text-left flex items-center gap-2 transition ${
                    email === 'bidder@novatech.demo'
                      ? 'border-[#0B3A5B] bg-[#0B3A5B]/10 font-bold text-[#0B3A5B]'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-[#138A4B]" />
                  <span>Bidder</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoAccount('admin@bidshield.demo', 'Admin@123')}
                  className={`p-2 rounded border text-left flex items-center gap-2 transition ${
                    email === 'admin@bidshield.demo'
                      ? 'border-[#0B3A5B] bg-[#0B3A5B]/10 font-bold text-[#0B3A5B]'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-[#D98200]" />
                  <span>Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoAccount('auditor@bidshield.demo', 'Auditor@123')}
                  className={`p-2 rounded border text-left flex items-center gap-2 transition ${
                    email === 'auditor@bidshield.demo'
                      ? 'border-[#0B3A5B] bg-[#0B3A5B]/10 font-bold text-[#0B3A5B]'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C62828]" />
                  <span>Auditor</span>
                </button>
              </div>
            </div>
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
