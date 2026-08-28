'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Lock, Mail, ArrowRight, ArrowLeft, AlertCircle, Scale } from 'lucide-react';

export default function AuditorLoginPage() {
  const router = useRouter();
  const { user, refetchSession } = useAuth();

  const [email, setEmail] = useState('auditor@bidshield.demo');
  const [password, setPassword] = useState('Auditor@123');
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
        router.push('/dashboard');
      } else {
        setError(data.error?.message || 'Login failed.');
      }
    } catch (err: any) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ECFEFF] flex flex-col justify-between">
      {/* Top Banner */}
      <div className="bg-[#0E7490] text-white text-xs py-2.5 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-1.5 hover:underline text-white font-bold">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span>•</span>
          <span className="font-extrabold text-[#F4B400]">SIH26100</span>
          <span>• Independent Vigilance & Compliance Audit</span>
        </div>
        <span className="text-cyan-100 text-[11px]">Read-Only Immutable Audit Trail</span>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-cyan-100 overflow-hidden">
          {/* Header */}
          <div className="bg-[#0E7490] p-8 text-white text-center">
            <div className="w-12 h-12 rounded-xl bg-white text-[#0E7490] flex items-center justify-center font-black mx-auto mb-3 shadow">
              <Scale className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold">Auditor & Vigilance Portal</h2>
            <p className="text-xs text-cyan-100 mt-1">Independent Integrity Verification & Decision Audit Logs</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Auditor Official Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#0E7490] focus:border-transparent outline-none transition"
                  placeholder="auditor@bidshield.demo"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Auditor Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#0E7490] focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#0E7490] text-white font-bold rounded-lg hover:bg-[#155E75] transition shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Auditor Console'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="p-3 bg-cyan-50/80 rounded-lg border border-cyan-100 text-[11px] text-slate-600">
              <span className="font-bold text-[#0E7490] block mb-1">Pre-Provisioned Auditor Credentials:</span>
              <code>auditor@bidshield.demo</code> / <code>Auditor@123</code>
            </div>
          </form>

          {/* Footer Navigation */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 flex justify-between">
            <Link href="/" className="text-slate-600 hover:underline">← Back to Portal</Link>
            <Link href="/login/officer" className="text-[#0E7490] font-semibold hover:underline">Officer Login →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
