'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RoleGuard from '@/components/auth/RoleGuard';
import { useAuth } from '@/lib/auth-context';
import {
  Upload,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Sparkles,
  RefreshCw,
  Check,
  Building2,
  FileCheck,
  ChevronDown,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Search,
  ArrowRight,
} from 'lucide-react';

function BidderDashboardContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramTenderId = searchParams.get('tenderId');
  const paramBidId = searchParams.get('bidId');

  const [tenders, setTenders] = useState<any[]>([]);
  const [selectedTenderId, setSelectedTenderId] = useState<string>('');
  const [tenderDetails, setTenderDetails] = useState<any>(null);
  const [activeBid, setActiveBid] = useState<any>(null);
  const [userBids, setUserBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTender, setLoadingTender] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');
  const [recalculating, setRecalculating] = useState(false);

  // Profile GST verification state
  const [gstinInput, setGstinInput] = useState(user?.gstin || '');
  const [companyNameInput, setCompanyNameInput] = useState(user?.companyName || '');
  const [verifyingGst, setVerifyingGst] = useState(false);
  const [gstResultMsg, setGstResultMsg] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // 1. Fetch all available tenders and user's bids
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [tendersRes, bidsRes] = await Promise.all([
        fetch('/api/tenders'),
        fetch(user?.id ? `/api/bids?bidderId=${user.id}` : '/api/bids'),
      ]);

      const tendersData = await tendersRes.json();
      const bidsData = await bidsRes.json();

      const allTenders = tendersData.success ? tendersData.tenders || [] : [];
      const allBids = bidsData.success ? bidsData.bids || [] : [];

      setTenders(allTenders);
      setUserBids(allBids);

      // Determine initial selected tender
      let initialTenderId = '';
      if (paramTenderId && allTenders.some((t: any) => t.id === paramTenderId)) {
        initialTenderId = paramTenderId;
      } else if (paramBidId) {
        const matchingBid = allBids.find((b: any) => b.id === paramBidId);
        if (matchingBid?.tenderId) {
          initialTenderId = matchingBid.tenderId;
        }
      }

      if (!initialTenderId && allTenders.length > 0) {
        const bidTender = allBids[0]?.tenderId;
        initialTenderId = bidTender || allTenders[0].id;
      }

      if (initialTenderId) {
        setSelectedTenderId(initialTenderId);
      }
    } catch (err) {
      console.error('Error loading bidder dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
    if (user?.gstin) {
      setGstinInput(user.gstin);
    }
    if (user?.companyName) {
      setCompanyNameInput(user.companyName);
    }
  }, [user]);

  // Sync if URL search params change
  useEffect(() => {
    if (paramTenderId && paramTenderId !== selectedTenderId) {
      setSelectedTenderId(paramTenderId);
    }
  }, [paramTenderId]);

  // 2. Fetch tender details & corresponding bid whenever selectedTenderId changes
  const loadTenderAndBid = async (tenderId: string) => {
    if (!tenderId) return;
    setLoadingTender(true);
    setUploadSuccessMsg('');

    try {
      const tenderRes = await fetch(`/api/tenders/${tenderId}`);
      const tenderJson = await tenderRes.json();

      if (tenderJson.success) {
        setTenderDetails(tenderJson.tender);
      }

      let currentBid = userBids.find((b) => b.tenderId === tenderId || b.tender?.id === tenderId);

      if (!currentBid) {
        const bidsQuery = await fetch(
          user?.id
            ? `/api/bids?tenderId=${tenderId}&bidderId=${user.id}`
            : `/api/bids?tenderId=${tenderId}`
        );
        const bidsJson = await bidsQuery.json();
        if (bidsJson.success && bidsJson.bids?.length > 0) {
          currentBid = bidsJson.bids[0];
        }
      }

      if (currentBid?.id) {
        const bidRes = await fetch(`/api/bids/${currentBid.id}`);
        const bidJson = await bidRes.json();
        if (bidJson.success) {
          setActiveBid(bidJson.bid);
        } else {
          setActiveBid(currentBid);
        }
      } else {
        setActiveBid(null);
      }
    } catch (e) {
      console.error('Error loading tender details & bid:', e);
    } finally {
      setLoadingTender(false);
    }
  };

  useEffect(() => {
    if (selectedTenderId) {
      loadTenderAndBid(selectedTenderId);
    }
  }, [selectedTenderId]);

  const handleSelectTender = (tenderId: string) => {
    setSelectedTenderId(tenderId);
    router.replace(`/bidder/dashboard?tenderId=${tenderId}`);
  };

  // 3. Handle Bidder GST Verification
  const handleVerifyGst = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gstinInput.trim()) {
      setGstResultMsg({ type: 'error', text: 'Please enter a valid 15-digit GSTIN.' });
      return;
    }

    setVerifyingGst(true);
    setGstResultMsg(null);

    try {
      const res = await fetch('/api/bidder/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gstin: gstinInput.trim(),
          companyName: companyNameInput.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.user.gstStatus === 'ACTIVE') {
          setGstResultMsg({
            type: 'success',
            text: `GSTIN Verified! State: ${data.verificationDetails?.stateJurisdiction || 'Verified'}, Extracted PAN: ${data.user.pan || 'N/A'}. Checksum: Valid.`,
          });
        } else {
          setGstResultMsg({
            type: 'warning',
            text: 'GSTIN recorded as Unverified (Structural checksum or format is invalid). Verification unavailable/unverified.',
          });
        }
        // Reload page data to reflect new profile
        window.location.reload();
      } else {
        setGstResultMsg({
          type: 'error',
          text: data.error?.message || 'Verification unavailable/unverified.',
        });
      }
    } catch (err: any) {
      setGstResultMsg({ type: 'error', text: 'GST verification service unavailable. Unverified.' });
    } finally {
      setVerifyingGst(false);
    }
  };

  // 4. Initialize/Create Bid for this Tender
  const handleCreateBidForTender = async () => {
    if (!selectedTenderId) return;
    setRecalculating(true);
    setUploadSuccessMsg('');

    try {
      const res = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenderId: selectedTenderId,
          bidderId: user?.id,
          bidderName: user?.companyName || user?.name || 'Registered Bidder Entity',
        }),
      });

      const data = await res.json();
      if (data.success && data.bid) {
        setUploadSuccessMsg('Bid application draft initialized! You can now upload your documents for this tender.');
        await loadInitialData();
        await loadTenderAndBid(selectedTenderId);
      }
    } catch (e) {
      console.error('Create bid error:', e);
    } finally {
      setRecalculating(false);
    }
  };

  // 5. Run Pre-Submission AI Compliance Check
  const handleRunPreCheck = async () => {
    if (!activeBid?.id) return;
    setRecalculating(true);
    setUploadSuccessMsg('');

    try {
      const res = await fetch(`/api/compliance/${activeBid.id}/run`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setUploadSuccessMsg(
          `AI Pre-Submission Evaluation complete! Compliance Score: ${data.complianceScore}%, Calculated Risk: ${data.riskLevel} (${data.riskScore}/100).`
        );
        await loadTenderAndBid(selectedTenderId);
      }
    } catch (e) {
      console.error('Run pre-check error:', e);
    } finally {
      setRecalculating(false);
    }
  };

  // 6. Handle Document Upload for a specific requirement
  const handleFileUpload = async (reqCode: string, docType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let targetBidId = activeBid?.id;
    if (!targetBidId && selectedTenderId) {
      const createRes = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenderId: selectedTenderId,
          bidderId: user?.id,
          bidderName: user?.companyName || user?.name || 'Registered Bidder Entity',
        }),
      });
      const createJson = await createRes.json();
      if (createJson.success && createJson.bid) {
        targetBidId = createJson.bid.id;
        setActiveBid(createJson.bid);
      }
    }

    if (!targetBidId) return;

    setUploadingKey(reqCode);
    setUploadSuccessMsg('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', docType);
      formData.append('bidId', targetBidId);

      const res = await fetch('/api/bidder/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setUploadSuccessMsg(
          `Uploaded "${file.name}"! AI Compliance Re-Evaluation: Score ${data.complianceScore}%, Risk ${data.riskLevel}.`
        );
        await loadTenderAndBid(selectedTenderId);
      }
    } catch (err) {
      console.error('File upload error:', err);
    } finally {
      setUploadingKey(null);
    }
  };

  const triggerFileInput = (reqCode: string) => {
    fileInputRefs.current[reqCode]?.click();
  };

  const getDocTypeForCategory = (cat: string) => {
    switch (cat) {
      case 'LEGAL':
        return 'GST_CERTIFICATE';
      case 'FINANCIAL':
        return 'FINANCIAL_STATEMENT';
      case 'TECHNICAL':
        return 'OEM_AUTHORIZATION';
      case 'EXPERIENCE':
        return 'EXPERIENCE_CERTIFICATE';
      case 'LOCAL_CONTENT':
        return 'LOCAL_CONTENT_DECLARATION';
      case 'CERTIFICATION':
        return 'ISO_CERTIFICATE';
      default:
        return 'DOCUMENTATION';
    }
  };

  const currentRequirements: any[] = tenderDetails?.requirements || [];
  const currentComplianceResults: any[] = activeBid?.complianceResults || [];

  const passedItems = currentComplianceResults.filter((cr) => cr.status === 'COMPLIANT');
  const failingItems = currentComplianceResults.filter((cr) => cr.status === 'NON_COMPLIANT');
  const missingItems = currentComplianceResults.filter(
    (cr) => cr.status === 'MISSING' || (cr.requirement?.mandatory && cr.status === 'UNVERIFIED')
  );

  const isGstVerified = user?.gstStatus === 'ACTIVE';

  return (
    <RoleGuard allowedRoles={['BIDDER', 'ADMIN']}>
      <DashboardLayout userRole="BIDDER" department="Bidder Portal">
        <div className="space-y-6 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl font-black text-[#0B3A5B] tracking-tight">Bidder Self-Service Portal</h1>
              <p className="text-xs text-slate-500 mt-1">
                Authenticated User: <strong>{user?.name}</strong> ({user?.email})
              </p>
            </div>

            {/* Dynamic Tender Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 shrink-0">Selected Tender:</span>
              <select
                value={selectedTenderId}
                onChange={(e) => handleSelectTender(e.target.value)}
                className="px-3 py-2 text-xs font-bold bg-white border border-slate-300 rounded-xl shadow-sm text-[#0B3A5B] focus:ring-2 focus:ring-[#0B3A5B] outline-none max-w-xs truncate"
              >
                {tenders.map((t) => {
                  const hasBid = userBids.some((b) => b.tenderId === t.id || b.tender?.id === t.id);
                  return (
                    <option key={t.id} value={t.id}>
                      {t.tenderNumber} — {t.title.substring(0, 30)}... {hasBid ? '(Bid Created)' : '(Open to Apply)'}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* 1. Bidder Statutory Verification Profile Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm gold-accent-border space-y-3">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B3A5B]/10 text-[#0B3A5B] flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-extrabold text-[#0B3A5B]">
                      {user?.legalName || user?.companyName || user?.tradeName || user?.name || 'Bidder Profile'}
                    </h2>
                    {user?.gstStatus === 'ACTIVE' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E8F5E9] text-[#138A4B] border border-[#138A4B]/20 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> ACTIVE
                      </span>
                    ) : user?.gstin ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1">
                        <Shield className="w-3 h-3 text-slate-500" /> GSTIN Structure Verified (Unverified)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Unverified
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {user?.gstin
                      ? `GSTIN: ${user.gstin} • Embedded PAN: ${user.pan || 'N/A'}${
                          user.gstVerifiedAt ? ` • Verified: ${new Date(user.gstVerifiedAt).toLocaleDateString()}` : ' • Live Taxpayer Master Unavailable'
                        }`
                      : 'Statutory GSTIN is required for official GeM tender compliance verification.'}
                  </p>
                </div>
              </div>

              {!isGstVerified && (
                <div className="w-full md:w-auto">
                  <form onSubmit={handleVerifyGst} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Enter 15-digit GSTIN"
                      value={gstinInput}
                      onChange={(e) => setGstinInput(e.target.value.toUpperCase())}
                      maxLength={15}
                      required
                      className="px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg uppercase focus:ring-2 focus:ring-[#0B3A5B] outline-none tracking-wider"
                    />
                    <button
                      type="submit"
                      disabled={verifyingGst || gstinInput.length !== 15}
                      className="px-3.5 py-1.5 bg-[#0B3A5B] text-white text-xs font-bold rounded-lg hover:bg-[#082C46] transition flex items-center justify-center gap-1 shrink-0 disabled:opacity-50"
                    >
                      {verifyingGst ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Shield className="w-3 h-3 text-[#F4B400]" />}
                      <span>{verifyingGst ? 'Validating...' : 'Verify & Auto-Fetch'}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Verified GST Details Grid (Populated ONLY when live provider returned actual data) */}
            {user?.gstStatus === 'ACTIVE' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Legal Name</span>
                  <span className="font-bold text-[#0B3A5B] truncate block">{user?.legalName || '—'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Trade Name</span>
                  <span className="font-semibold text-slate-700 truncate block">{user?.tradeName || '—'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Constitution</span>
                  <span className="font-semibold text-slate-700 truncate block">{user?.constitution || '—'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Registered Address</span>
                  <span className="font-semibold text-slate-700 truncate block">{user?.address || '—'}</span>
                </div>
              </div>
            )}

            {gstResultMsg && (
              <div
                className={`mt-2 p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  gstResultMsg.type === 'success'
                    ? 'bg-green-50 text-[#138A4B] border border-green-200'
                    : gstResultMsg.type === 'warning'
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-red-50 text-[#C62828] border border-red-200'
                }`}
              >
                {gstResultMsg.type === 'success' ? (
                  <Check className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{gstResultMsg.text}</span>
              </div>
            )}
          </div>

          {uploadSuccessMsg && (
            <div className="p-4 bg-green-50 border border-green-200 text-[#138A4B] text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm animate-fade-in">
              <Check className="w-5 h-5 shrink-0" />
              <span>{uploadSuccessMsg}</span>
            </div>
          )}

          {loading || loadingTender ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center">
              <RefreshCw className="w-8 h-8 text-[#0B3A5B] animate-spin mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">Loading tender specifications and compliance checklist...</p>
            </div>
          ) : (
            <>
              {/* Tender Details & Bid Status Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-blue-100 text-[#0B3A5B]">
                        {tenderDetails?.tenderNumber || 'N/A'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        EST. VALUE: ₹{((tenderDetails?.estimatedValue || 0) / 10000000).toFixed(2)} Cr
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        DEADLINE: {tenderDetails?.submissionDeadline ? new Date(tenderDetails.submissionDeadline).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <h2 className="text-xl font-extrabold text-[#0B3A5B] mt-1 truncate">
                      {tenderDetails?.title}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {tenderDetails?.description}
                    </p>
                  </div>

                  {/* Pre-Check Scores or Initialize Bid CTA */}
                  <div className="flex items-center gap-4 shrink-0">
                    {activeBid ? (
                      <>
                        <div className="text-right">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">AI Pre-Check</span>
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-2xl font-black text-[#0B3A5B]">{activeBid.complianceScore ?? 0}%</span>
                            <span
                              className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                                activeBid.riskLevel === 'LOW'
                                  ? 'bg-[#E8F5E9] text-[#138A4B]'
                                  : activeBid.riskLevel === 'MEDIUM'
                                  ? 'bg-[#FFF8E1] text-[#D98200]'
                                  : 'bg-[#FFEBEE] text-[#C62828]'
                              }`}
                            >
                              {activeBid.riskLevel || 'LOW'} RISK
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={handleRunPreCheck}
                          disabled={recalculating}
                          className="px-4 py-2.5 bg-[#0B3A5B] text-white text-xs font-bold rounded-lg shadow hover:bg-[#082C46] transition flex items-center gap-2"
                        >
                          <Sparkles className={`w-4 h-4 text-[#F4B400] ${recalculating ? 'animate-spin' : ''}`} />
                          <span>{recalculating ? 'Evaluating...' : 'Run Pre-Check'}</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleCreateBidForTender}
                        disabled={recalculating}
                        className="px-5 py-2.5 bg-[#138A4B] text-white text-xs font-bold rounded-lg shadow hover:bg-[#0f6f3c] transition flex items-center gap-2"
                      >
                        <FileCheck className="w-4 h-4" />
                        <span>Initialize Submission for this Tender</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Tender-Specific Requirements Checklist */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Mandatory Eligibility Checklist for {tenderDetails?.tenderNumber} ({currentRequirements.length} Criteria)
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">
                      {passedItems.length}/{currentRequirements.length} Criteria Compliant
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    {currentRequirements.map((req: any) => {
                      const reqCode = req.requirementCode;
                      const cr = currentComplianceResults.find((c) => c.requirementId === req.id || c.requirement?.requirementCode === reqCode);
                      const isCompliant = cr?.status === 'COMPLIANT';
                      const isFail = cr?.status === 'NON_COMPLIANT';
                      const docType = getDocTypeForCategory(req.category);
                      const isUploading = uploadingKey === reqCode;

                      return (
                        <div
                          key={req.id}
                          className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 hover:border-slate-300 transition"
                        >
                          <input
                            type="file"
                            accept=".pdf"
                            ref={(el) => {
                              fileInputRefs.current[reqCode] = el;
                            }}
                            onChange={(e) => handleFileUpload(reqCode, docType, e)}
                            className="hidden"
                          />

                          <div className="flex items-center gap-3 min-w-0">
                            {isCompliant ? (
                              <CheckCircle2 className="w-5 h-5 text-[#138A4B] shrink-0" />
                            ) : isFail ? (
                              <XCircle className="w-5 h-5 text-[#C62828] shrink-0" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-[#D98200] shrink-0" />
                            )}

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="px-1.5 py-0.2 bg-[#0B3A5B] text-white text-[9px] font-bold rounded">
                                  {reqCode}
                                </span>
                                <p className="text-xs font-bold text-slate-800 truncate">{req.title}</p>
                                {req.mandatory && (
                                  <span className="text-[8px] font-bold px-1 rounded bg-red-100 text-[#C62828]">
                                    MANDATORY
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                                {cr?.reason || req.description || `${req.category} Requirement`}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => triggerFileInput(reqCode)}
                            disabled={isUploading}
                            className="px-3 py-1.5 bg-white border border-slate-300 text-xs font-bold text-[#0B3A5B] rounded-lg hover:bg-slate-100 transition shadow-sm flex items-center gap-1.5 shrink-0"
                          >
                            {isUploading ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Upload className="w-3.5 h-3.5 text-[#1261A0]" />
                            )}
                            <span>{isUploading ? 'Analyzing...' : isCompliant ? 'Replace PDF' : 'Upload PDF'}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Pre-Submission AI Evaluation Summary */}
              {activeBid && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-[#0B3A5B] uppercase tracking-wider">
                    Pre-Submission AI Evaluation Summary ({tenderDetails?.tenderNumber})
                  </h3>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-xs space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#138A4B] block">Compliant Criteria</span>
                      <span className="text-xl font-black text-[#138A4B]">{passedItems.length}</span>
                      <p className="text-slate-600 text-[11px] truncate">
                        {passedItems.map((p) => p.requirement?.requirementCode).join(', ') || 'None'}
                      </p>
                    </div>

                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#C62828] block">Non-Compliant Criteria</span>
                      <span className="text-xl font-black text-[#C62828]">{failingItems.length}</span>
                      <p className="text-slate-600 text-[11px] truncate">
                        {failingItems.map((f) => f.requirement?.requirementCode).join(', ') || 'None'}
                      </p>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#D98200] block">Missing Documents</span>
                      <span className="text-xl font-black text-[#D98200]">{missingItems.length}</span>
                      <p className="text-slate-600 text-[11px] truncate">
                        {missingItems.map((m) => m.requirement?.requirementCode).join(', ') || 'None'}
                      </p>
                    </div>
                  </div>

                  {/* Attached Documents */}
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Attached Bid Documents ({activeBid?.documents?.length || 0} Files)
                    </h4>
                    {activeBid?.documents?.length > 0 ? (
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {activeBid.documents.map((doc: any) => (
                          <div key={doc.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#0B3A5B] shrink-0" />
                            <div className="min-w-0 text-xs">
                              <p className="font-bold text-slate-800 truncate">{doc.filename}</p>
                              <span className="text-[10px] text-slate-400">{doc.documentType} • PROCESSED</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No documents attached yet. Click 'Upload PDF' on the checklist above.</p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}

export default function BidderDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <RefreshCw className="w-8 h-8 text-[#0B3A5B] animate-spin" />
        </div>
      }
    >
      <BidderDashboardContent />
    </Suspense>
  );
}
