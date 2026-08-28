'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RoleGuard from '@/components/auth/RoleGuard';
import {
  FileCheck,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  X,
  FileText,
} from 'lucide-react';

function BidsListingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramTenderId = searchParams.get('tenderId') || 'ALL';

  const [bids, setBids] = useState<any[]>([]);
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [tenderFilter, setTenderFilter] = useState(paramTenderId);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [newlyUpdatedBidIds, setNewlyUpdatedBidIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/tenders?all=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTenders(data.tenders || []);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (paramTenderId && paramTenderId !== tenderFilter) {
      setTenderFilter(paramTenderId);
    }
  }, [paramTenderId]);

  const fetchBids = (silent = false) => {
    if (!silent) setLoading(true);
    let url = `/api/bids?riskLevel=${riskFilter}`;
    if (tenderFilter && tenderFilter !== 'ALL') {
      url += `&tenderId=${tenderFilter}`;
    }

    fetch(url, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBids(data.bids || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (!silent) setLoading(false);
      });
  };

  useEffect(() => {
    fetchBids();
  }, [riskFilter, tenderFilter]);

  // Setup Real-time SSE listener
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/realtime');
      eventSource.onopen = () => setIsLiveConnected(true);
      eventSource.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data);
          if (
            event.type === 'BID_CREATED' ||
            event.type === 'BID_UPDATED' ||
            event.type === 'COMPLIANCE_EVALUATED' ||
            event.type === 'DOCUMENT_UPLOADED'
          ) {
            fetchBids(true);
            if (event.data?.bidId) {
              setNewlyUpdatedBidIds((prev) => new Set(prev).add(event.data.bidId));
            }
          }
        } catch {}
      };
      eventSource.onerror = () => setIsLiveConnected(false);
    } catch {}

    const pollInterval = setInterval(() => fetchBids(true), 4000);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(pollInterval);
    };
  }, [riskFilter, tenderFilter]);

  const handleTenderFilterChange = (tid: string) => {
    setTenderFilter(tid);
    if (tid === 'ALL') {
      router.replace('/bids');
    } else {
      router.replace(`/bids?tenderId=${tid}`);
    }
  };

  const selectedTenderObj = tenders.find((t) => t.id === tenderFilter);

  const filteredBids = bids.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.bidderName?.toLowerCase().includes(q) ||
      b.tender?.tenderNumber?.toLowerCase().includes(q) ||
      b.tender?.title?.toLowerCase().includes(q)
    );
  });

  return (
    <RoleGuard allowedRoles={['ADMIN', 'PROCUREMENT_OFFICER', 'AUDITOR']}>
      <DashboardLayout>
        <div className="space-y-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h1 className="text-2xl font-black text-[#0B3A5B] tracking-tight">Bidder Submissions & Evaluations</h1>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-[#138A4B] border border-emerald-200 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>LIVE UPDATING</span>
                </div>
              </div>
              <p className="text-xs text-slate-500">GeM tender bids, document verifications & deterministic rule analysis</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchBids(false)}
                title="Refresh bids"
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 transition flex items-center gap-1.5 shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
              <Link
                href="/compare"
                className="px-4 py-2 bg-[#0B3A5B] text-white text-xs font-bold rounded-lg shadow hover:bg-[#082C46] transition flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#F4B400]" />
                <span>Open Bid Comparison</span>
              </Link>
            </div>
          </div>

          {/* Active Tender Scope Banner */}
          {selectedTenderObj && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-[#0B3A5B] font-bold">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-4 h-4 text-[#1261A0] shrink-0" />
                <span className="truncate">
                  Filtering by Tender: <strong>{selectedTenderObj.tenderNumber}</strong> — {selectedTenderObj.title}
                </span>
              </div>
              <button
                onClick={() => handleTenderFilterChange('ALL')}
                className="px-2.5 py-1 bg-white border border-blue-200 text-slate-600 rounded-lg hover:bg-blue-100 transition flex items-center gap-1 text-[11px] shrink-0"
              >
                <X className="w-3.5 h-3.5" />
                <span>Show All Tenders</span>
              </button>
            </div>
          )}

          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search bidder or tender..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:ring-1 focus:ring-[#0B3A5B]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Tender:</span>
                <select
                  value={tenderFilter}
                  onChange={(e) => handleTenderFilterChange(e.target.value)}
                  className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 max-w-xs truncate"
                >
                  <option value="ALL">All Tenders ({tenders.length})</option>
                  {tenders.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.tenderNumber} — {t.title.substring(0, 28)}...
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Risk:</span>
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
                >
                  <option value="ALL">All Risk Levels</option>
                  <option value="LOW">LOW RISK</option>
                  <option value="MEDIUM">MEDIUM RISK</option>
                  <option value="HIGH">HIGH RISK</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bids Grid */}
          {loading ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center">
              <RefreshCw className="w-8 h-8 text-[#0B3A5B] animate-spin mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">Loading submitted bids...</p>
            </div>
          ) : filteredBids.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center">
              <FileCheck className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">No Bids Found</h3>
              <p className="text-xs text-slate-400 mt-1">No bids submitted matching the current filters.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredBids.map((bid) => (
                <div key={bid.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 gold-accent-border">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {bid.tender?.tenderNumber}
                      </span>
                      <h2 className="text-lg font-extrabold text-[#0B3A5B] mt-1 truncate">{bid.bidderName}</h2>
                      <p className="text-xs text-slate-500 truncate">{bid.tender?.title}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black shrink-0 ${
                        bid.riskLevel === 'LOW'
                          ? 'badge-risk-low'
                          : bid.riskLevel === 'MEDIUM'
                          ? 'badge-risk-medium'
                          : 'badge-risk-high'
                      }`}
                    >
                      {bid.riskLevel} RISK ({bid.riskScore}/100)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl text-xs font-medium border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px]">COMPLIANCE SCORE</span>
                      <span className="text-base font-black text-[#138A4B]">{bid.complianceScore}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">SUBMITTED DOCUMENTS</span>
                      <span className="text-base font-black text-[#0B3A5B]">{bid.documents?.length || 0} Files</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                    <span className="text-slate-500">
                      Audit Status:{' '}
                      <strong className="text-slate-800 font-bold">{bid.finalReviewStatus || bid.status}</strong>
                    </span>
                    <Link
                      href={`/bids/${bid.id}`}
                      className="px-4 py-2 bg-[#0B3A5B] text-white text-xs font-bold rounded-lg hover:bg-[#082C46] transition flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Open AI Inspection</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}

export default function BidsListingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <RefreshCw className="w-8 h-8 text-[#0B3A5B] animate-spin" />
        </div>
      }
    >
      <BidsListingContent />
    </Suspense>
  );
}
