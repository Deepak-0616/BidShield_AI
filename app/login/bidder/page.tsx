'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  Building2,
  User,
  FileText,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  HelpCircle,
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
    'IDLE' | 'FETCHING' | 'LIVE_VERIFIED' | 'STRUCTURE_VERIFIED' | 'NOT_FOUND' | 'INVALID' | 'UNAVAILABLE'
  >('IDLE');

  // GST-Derived Locked Profile Fields (Populated ONLY when live provider returns actual data)
  const [gstTaxpayerData, setGstTaxpayerData] = useState<{
    legalName: string;
    tradeName: string;
    gstStatus: string;
    constitution: string;
    registrationDate: string;
    registeredAddress: string;
    stateJurisdiction: string;
    extractedPan: string;
    isLiveVerified: boolean;
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
    if (cleanGstin.length !== 15) {
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
        if (data.liveLookupStatus === 'LIVE_VERIFIED' && data.gstStatus === 'ACTIVE') {
          setGstStatusState('LIVE_VERIFIED');
          setGstTaxpayerData({
            legalName: data.legalName || '',
            tradeName: data.tradeName || '',
            gstStatus: data.gstStatus || 'ACTIVE',
            constitution: data.constitution || '',
            registrationDate: data.registrationDate || '',
            registeredAddress: data.registeredAddress || '',
            stateJurisdiction: data.stateJurisdiction || '',
            extractedPan: data.extractedPan || '',
            isLiveVerified: true,
          });
        } else if (data.isValid || data.formatStatus === 'VALID_STRUCTURE_AND_CHECKSUM') {
          // GSTIN structure is valid, but live taxpayer verification is unavailable
          setGstStatusState('STRUCTURE_VERIFIED');
          setGstTaxpayerData({
            legalName: '',
            tradeName: '',
            gstStatus: 'UNVERIFIED',
            constitution: '',
            registrationDate: '',
            registeredAddress: '',
            stateJurisdiction: data.stateJurisdiction || '',
            extractedPan: data.extractedPan || '',
            isLiveVerified: false,
          });
        } else {
          setGstStatusState('INVALID');
          setGstTaxpayerData(null);
        }
      } else {
        setGstStatusState('INVALID');
        setGstTaxpayerData(null);
        setError(json.error?.message || 'Invalid GSTIN');
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
      setError('A valid GSTIN structure is required to register as a bidder.');
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
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#E57373_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
          {/* Header Banner */}
          <div className="bg-[#D32F2F] p-6 text-center text-white relative">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-3 text-white shadow-inner">
              <Building2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h1 className="text-xl font-black tracking-tight">Bidder & Supplier Registration Portal</h1>
            <p className="text-xs text-red-100 mt-1">
              Statutory GSTIN Verification & Tender Submission Engine
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex border-b border-slate-200 text-xs font-bold">
            <button
              onClick={() => setMode('LOGIN')}
              className={`flex-1 py-3 text-center transition ${
                mode === 'LOGIN'
                  ? 'border-b-2 border-[#D32F2F] text-[#D32F2F] bg-red-50/50'
                  : 'text-slate-500 hover:text-slate-700 bg-slate-50'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('REGISTER')}
              className={`flex-1 py-3 text-center transition ${
                mode === 'REGISTER'
                  ? 'border-b-2 border-[#D32F2F] text-[#D32F2F] bg-red-50/50'
                  : 'text-slate-500 hover:text-slate-700 bg-slate-50'
              }`}
            >
              Create Account (GSTIN-First)
            </button>
          </div>

          {error && (
            <div className="m-6 mb-0 p-3 bg-red-50 border border-red-200 text-[#C62828] text-xs font-bold rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="m-6 mb-0 p-3 bg-green-50 border border-green-200 text-[#138A4B] text-xs font-bold rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'LOGIN' && (
            <form onSubmit={handleLogin} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Bidder Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#D32F2F] outline-none transition"
                    placeholder="bidder@novatech.demo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#D32F2F] outline-none transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#D32F2F] text-white font-bold rounded-lg hover:bg-[#b71c1c] transition shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In to Bidder Console'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="p-3 bg-red-50/70 rounded-lg border border-red-100 text-[11px] text-slate-600">
                <span className="font-bold text-red-900 block mb-1">Demo Credentials:</span>
                <code>bidder@novatech.demo</code> / <code>Bidder@123</code>
              </div>
            </form>
          )}

          {/* REGISTRATION FORM (GSTIN IS SOURCE OF TRUTH) */}
          {mode === 'REGISTER' && (
            <form onSubmit={handleRegister} className="p-6 pt-4 space-y-4">
              {/* 1. GSTIN INPUT & STATUS */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-[#0B3A5B] uppercase tracking-wider">
                    1. Enter GSTIN (Statutory Identifier)
                  </label>
                  <span className="text-[10px] text-slate-400 font-semibold">15 Characters</span>
                </div>

                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={regGstin}
                    onChange={handleGstinChange}
                    maxLength={15}
                    required
                    className="w-full pl-9 pr-24 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-mono font-bold uppercase focus:ring-2 focus:ring-[#D32F2F] outline-none tracking-wider"
                    placeholder="e.g. 29AADFV7589C1ZX"
                  />
                  <button
                    type="button"
                    onClick={() => handleFetchGstProfile(regGstin)}
                    disabled={fetchingGst || regGstin.length !== 15}
                    className="absolute right-1.5 top-1.5 px-3 py-1.5 bg-[#0B3A5B] text-white text-[11px] font-bold rounded-md hover:bg-[#082C46] transition disabled:opacity-40"
                  >
                    {fetchingGst ? 'Fetching...' : 'Verify'}
                  </button>
                </div>

                {/* Status Indicator */}
                {gstStatusState === 'FETCHING' && (
                  <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs font-bold text-[#1261A0] flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                    <span>Fetching GST profile...</span>
                  </div>
                )}

                {gstStatusState === 'LIVE_VERIFIED' && gstTaxpayerData && (
                  <div className="p-2.5 bg-green-50 border border-green-200 rounded-lg text-xs font-bold text-[#138A4B] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 shrink-0 text-[#138A4B]" />
                      <span>GSTIN Verified • Live Taxpayer Master Active</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#138A4B] text-white text-[10px] font-black">
                      ACTIVE
                    </span>
                  </div>
                )}

                {gstStatusState === 'STRUCTURE_VERIFIED' && (
                  <div className="p-2.5 bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[#0B3A5B]">
                        <CheckCircle2 className="w-4 h-4 text-[#138A4B] shrink-0" />
                        <span>GSTIN structure valid</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">
                        UNVERIFIED
                      </span>
                    </div>
                    <p className="text-[11px] font-normal text-slate-500 pl-5.5">
                      Live taxpayer verification unavailable / Unverified.
                    </p>
                  </div>
                )}

                {gstStatusState === 'NOT_FOUND' && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs font-bold text-amber-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>GSTIN not found in Taxpayer Registry</span>
                  </div>
                )}

                {gstStatusState === 'INVALID' && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs font-bold text-[#C62828] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#C62828]" />
                    <span>GSTIN checksum or statutory structure invalid</span>
                  </div>
                )}

                {gstStatusState === 'UNAVAILABLE' && (
                  <div className="p-2.5 bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 shrink-0 text-slate-500" />
                    <span>Live taxpayer verification unavailable / Unverified</span>
                  </div>
                )}
              </div>

              {/* 2. GST-DERIVED COMPANY DETAILS (LOCKED / NON-EDITABLE) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>2. GST-Derived Company Details (Locked / Read-Only)</span>
                  </h3>
                  {gstStatusState === 'LIVE_VERIFIED' && (
                    <span className="text-[10px] text-[#138A4B] font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200">
                      Source: Live GST API
                    </span>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1">
                      <span>Legal Name</span>
                      <Lock className="w-3 h-3 text-slate-400" />
                    </label>
                    <input
                      type="text"
                      value={gstTaxpayerData?.legalName || ''}
                      readOnly
                      placeholder={gstStatusState === 'STRUCTURE_VERIFIED' ? 'Pending live taxpayer lookup' : ''}
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-[#0B3A5B] cursor-not-allowed outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1">
                      <span>Trade Name</span>
                      <Lock className="w-3 h-3 text-slate-400" />
                    </label>
                    <input
                      type="text"
                      value={gstTaxpayerData?.tradeName || ''}
                      readOnly
                      placeholder={gstStatusState === 'STRUCTURE_VERIFIED' ? 'Pending live taxpayer lookup' : ''}
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-not-allowed outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1">
                      <span>Constitution / Business Type</span>
                      <Lock className="w-3 h-3 text-slate-400" />
                    </label>
                    <input
                      type="text"
                      value={gstTaxpayerData?.constitution || ''}
                      readOnly
                      placeholder={gstStatusState === 'STRUCTURE_VERIFIED' ? 'Pending live taxpayer lookup' : ''}
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-not-allowed outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1">
                      <span>State / Jurisdiction</span>
                      <Lock className="w-3 h-3 text-slate-400" />
                    </label>
                    <input
                      type="text"
                      value={gstTaxpayerData?.stateJurisdiction || ''}
                      readOnly
                      placeholder={gstStatusState === 'STRUCTURE_VERIFIED' ? 'Pending live taxpayer lookup' : ''}
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-not-allowed outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1">
                      <span>Registered Address</span>
                      <Lock className="w-3 h-3 text-slate-400" />
                    </label>
                    <input
                      type="text"
                      value={gstTaxpayerData?.registeredAddress || ''}
                      readOnly
                      placeholder={gstStatusState === 'STRUCTURE_VERIFIED' ? 'Pending live taxpayer lookup' : ''}
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. MANUAL CREDENTIALS & CONTACT INFO */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>3. Authorized Contact Person & Login Credentials (Manual Fields)</span>
                  </h3>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Authorized Contact Person Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={regContactPerson}
                      onChange={(e) => setRegContactPerson(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:bg-white focus:ring-2 focus:ring-[#D32F2F] outline-none"
                      placeholder="e.g. Rajesh Sharma"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Official Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:bg-white focus:ring-2 focus:ring-[#D32F2F] outline-none"
                        placeholder="vendor@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Password (min. 6 characters)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-[#D32F2F] outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || (gstStatusState !== 'LIVE_VERIFIED' && gstStatusState !== 'STRUCTURE_VERIFIED')}
                className="w-full py-3 px-4 bg-[#D32F2F] text-white font-bold rounded-lg hover:bg-[#b71c1c] transition shadow-md flex items-center justify-center gap-2 text-xs disabled:opacity-50 mt-3"
              >
                {loading ? 'Creating Account...' : 'Register Bidder Account'}
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Footer Navigation */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 flex justify-between">
            <Link href="/" className="text-slate-600 hover:underline">← Back to Portal</Link>
            <Link href="/login/officer" className="text-[#1261A0] font-semibold hover:underline">Officer Login →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
