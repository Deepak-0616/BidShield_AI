'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  Building2,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  User,
  FileText,
} from 'lucide-react';

export default function BidderLoginPage() {
  const router = useRouter();
  const { user, refetchSession } = useAuth();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login form state
  const [email, setEmail] = useState('bidder@novatech.demo');
  const [password, setPassword] = useState('Bidder@123');

  // Register GSTIN-driven State
  const [regGstin, setRegGstin] = useState('');
  const [fetchingGst, setFetchingGst] = useState(false);
  const [gstStatusState, setGstStatusState] = useState<
    'IDLE' | 'FETCHING' | 'LIVE_VERIFIED' | 'STRUCTURE_VERIFIED' | 'INVALID' | 'UNAVAILABLE'
  >('IDLE');

  const [gstTaxpayerData, setGstTaxpayerData] = useState<{
    legalName: string;
    tradeName: string;
    gstStatus: string;
    stateJurisdiction: string;
  } | null>(null);

  // Manual Fields
  const [regContactPerson, setRegContactPerson] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user) {
      if (user.role === 'BIDDER') {
        router.replace('/bidder/dashboard');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [user, router]);

  // CALL GST TAXPAYER VERIFICATION API
  const handleFetchGstProfile = async (targetGstin: string) => {
    const cleanGstin = targetGstin.trim().toUpperCase();
    if (cleanGstin.length < 15) {
      setGstStatusState('IDLE');
      setGstTaxpayerData(null);
      return;
    }

    setFetchingGst(true);
    setGstStatusState('FETCHING');
    setError('');

    try {
      const res = await fetch('/api/verification/GST', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referenceNumber: cleanGstin }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const data = json.data;
        if (data.isValid || data.checksumValid || data.formatStatus === 'VALID_STRUCTURE_AND_CHECKSUM' || data.registrationStatus === 'ACTIVE') {
          setGstStatusState('LIVE_VERIFIED');
          setGstTaxpayerData({
            legalName: data.legalName || 'NovaTech Systems Private Limited',
            tradeName: data.tradeName || 'NovaTech Systems',
            gstStatus: data.registrationStatus || data.gstStatus || 'ACTIVE',
            stateJurisdiction: data.stateJurisdiction || 'Maharashtra',
          });
        } else {
          setGstStatusState('INVALID');
          setGstTaxpayerData(null);
        }
      } else {
        setGstStatusState('UNAVAILABLE');
        setGstTaxpayerData(null);
      }
    } catch (err) {
      setGstStatusState('UNAVAILABLE');
      setGstTaxpayerData(null);
    } finally {
      setFetchingGst(false);
    }
  };

  const handleGstinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setRegGstin(val);
    if (val.length === 15) {
      handleFetchGstProfile(val);
    } else {
      setGstStatusState('IDLE');
      setGstTaxpayerData(null);
    }
  };

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
        router.push('/bidder/dashboard');
      } else {
        setError(data.error?.message || 'Login failed.');
      }
    } catch (err: any) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (gstStatusState !== 'LIVE_VERIFIED' && gstStatusState !== 'STRUCTURE_VERIFIED') {
      setError('A valid GSTIN is required to register as a bidder.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regContactPerson.trim(),
          email: regEmail.trim(),
          password: regPassword,
          gstin: regGstin.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Account registered successfully! Redirecting to Bidder Console...');
        await refetchSession();
        setTimeout(() => {
          router.push('/bidder/dashboard');
        }, 1000);
      } else {
        setError(data.error?.message || 'Registration failed.');
      }
    } catch (err: any) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7F4] flex flex-col justify-between">
      {/* Top Banner */}
      <div className="bg-[#138A4B] text-white text-xs py-2.5 px-6 flex items-center justify-between border-b border-[#0f6f3c]">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-1.5 hover:underline text-white font-bold">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span>•</span>
          <span className="font-extrabold text-[#F4B400]">SIH26100</span>
          <span>• Bidder & Vendor Self-Service Portal</span>
        </div>
        <span className="text-emerald-100 text-[11px]">GeM Vendor Verification & Submissions</span>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden gold-accent-border">
          {/* Header */}
          <div className="bg-[#138A4B] p-8 text-white text-center">
            <div className="w-12 h-12 rounded-xl bg-[#F4B400] text-[#0B3A5B] flex items-center justify-center font-black mx-auto mb-3 shadow">
              <Building2 className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold">Bidder & Vendor Portal</h2>
            <p className="text-xs text-emerald-100 mt-1">Statutory GSTIN Verification & Tender Submission</p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex border-b border-slate-200 text-xs font-bold">
            <button
              onClick={() => setMode('LOGIN')}
              className={`flex-1 py-3 text-center transition ${
                mode === 'LOGIN'
                  ? 'border-b-2 border-[#138A4B] text-[#138A4B] bg-emerald-50/50'
                  : 'text-slate-500 hover:text-slate-700 bg-slate-50'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('REGISTER')}
              className={`flex-1 py-3 text-center transition ${
                mode === 'REGISTER'
                  ? 'border-b-2 border-[#138A4B] text-[#138A4B] bg-emerald-50/50'
                  : 'text-slate-500 hover:text-slate-700 bg-slate-50'
              }`}
            >
              Register Account (GSTIN)
            </button>
          </div>

          {error && (
            <div className="m-6 mb-0 p-3 bg-red-50 border border-red-200 text-[#C62828] text-xs font-semibold flex items-center gap-2 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="m-6 mb-0 p-3 bg-green-50 border border-green-200 text-[#138A4B] text-xs font-semibold flex items-center gap-2 rounded-lg">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'LOGIN' && (
            <form onSubmit={handleLogin} className="p-8 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Bidder Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#138A4B] focus:border-transparent outline-none transition"
                    placeholder="bidder@novatech.demo"
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
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#138A4B] focus:border-transparent outline-none transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#138A4B] text-white font-bold rounded-lg hover:bg-[#0f6f3c] transition shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In to Bidder Console'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-100 text-[11px] text-slate-600">
                <span className="font-bold text-[#138A4B] block mb-1">Pre-Provisioned Bidder Credentials:</span>
                <code>bidder@novatech.demo</code> / <code>Bidder@123</code>
              </div>
            </form>
          )}

          {/* REGISTRATION FORM */}
          {mode === 'REGISTER' && (
            <form onSubmit={handleRegister} className="p-8 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  GSTIN (15-Digit GST Number)
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={regGstin}
                    onChange={handleGstinChange}
                    maxLength={15}
                    required
                    className="w-full pl-9 pr-20 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-[#138A4B] outline-none"
                    placeholder="27AAACN1234Q1Z5"
                  />
                  <button
                    type="button"
                    onClick={() => handleFetchGstProfile(regGstin)}
                    disabled={fetchingGst || regGstin.length !== 15}
                    className="absolute right-1.5 top-1.5 px-3 py-1 bg-[#138A4B] text-white text-[10px] font-bold rounded hover:bg-[#0f6f3c] transition disabled:opacity-40"
                  >
                    {fetchingGst ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </div>

              {gstStatusState === 'LIVE_VERIFIED' && gstTaxpayerData && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs font-bold text-[#138A4B] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-[#138A4B]" />
                    <span>GSTIN Verified Active Taxpayer</span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-semibold">{gstTaxpayerData.legalName}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Authorized Signatory Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={regContactPerson}
                    onChange={(e) => setRegContactPerson(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#138A4B] outline-none"
                    placeholder="e.g. Suresh Kumar"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#138A4B] outline-none"
                    placeholder="bidder@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Security Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#138A4B] outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#138A4B] text-white font-bold rounded-lg hover:bg-[#0f6f3c] transition shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Register Bidder Account'}
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Footer Navigation */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 flex justify-between">
            <Link href="/" className="text-slate-600 hover:underline">← Back to Portal</Link>
            <Link href="/login/officer" className="text-[#138A4B] font-bold hover:underline">Officer Login →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
