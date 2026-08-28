'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RoleGuard from '@/components/auth/RoleGuard';
import { Scale, CheckCircle2, XCircle, AlertCircle, RefreshCw, FileText } from 'lucide-react';

export default function CompareBiddersPage() {
  const [tenders, setTenders] = useState<any[]>([]);
  const [selectedTenderId, setSelectedTenderId] = useState<string>('ALL');
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load list of available tenders
  useEffect(() => {
    fetch('/api/tenders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.tenders?.length > 0) {
          setTenders(data.tenders);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch bids whenever selected tender changes
  const fetchCompareBids = (tenderId: string, silent = false) => {
    if (!silent) setLoading(true);
    fetch('/api/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenderId: tenderId === 'ALL' ? undefined : tenderId }),
      cache: 'no-store',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBids(data.bids || []);
        }
      })
      .finally(() => {
        if (!silent) setLoading(false);
      });
  };

  useEffect(() => {
    fetchCompareBids(selectedTenderId);

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/realtime');
      eventSource.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data);
          if (
            event.type === 'BID_CREATED' ||
            event.type === 'BID_UPDATED' ||
            event.type === 'COMPLIANCE_EVALUATED' ||
            event.type === 'TENDER_CREATED'
          ) {
            fetchCompareBids(selectedTenderId, true);
          }
        } catch {}
      };
    } catch {}

    const poll = setInterval(() => fetchCompareBids(selectedTenderId, true), 4000);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(poll);
    };
  }, [selectedTenderId]);

  // Derive dynamic list of requirements from bids
  const requirementsList: any[] = [];
  const seenReqCodes = new Set<string>();

  bids.forEach((bid) => {
    bid.tender?.requirements?.forEach((req: any) => {
      if (!seenReqCodes.has(req.requirementCode)) {
        seenReqCodes.add(req.requirementCode);
        requirementsList.push({
          code: req.requirementCode,
          title: req.title,
          category: req.category,
          mandatory: req.mandatory,
        });
      }
    });
  });

  const getStatusForRequirement = (bid: any, reqCode: string) => {
    const cr = bid.complianceResults?.find((c: any) => c.requirement?.requirementCode === reqCode);
    if (!cr) return { status: 'UNVERIFIED', text: 'Unverified' };
    return { status: cr.status, text: cr.status };
  };

  return (
    <RoleGuard allowedRoles={['ADMIN', 'AUDITOR']}>
      <DashboardLayout>
        <div className="space-y-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl font-black text-[#0B3A5B] tracking-tight">Bidder Comparison Matrix</h1>
              <p className="text-xs text-slate-500 mt-1">Multi-bidder side-by-side compliance & risk evaluation</p>
            </div>

            {/* Tender Filter Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Tender:</span>
              <select
                value={selectedTenderId}
                onChange={(e) => setSelectedTenderId(e.target.value)}
                className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-lg shadow-sm text-[#0B3A5B] focus:ring-2 focus:ring-[#0B3A5B]"
              >
                <option value="ALL">All Tenders & Bids</option>
                {tenders.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.tenderNumber} — {t.title.substring(0, 40)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Disclaimer Banner */}
          <div className="bg-[#0B3A5B] text-white p-4 rounded-xl shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scale className="w-6 h-6 text-[#F4B400] shrink-0" />
              <p className="text-xs font-semibold">
                AI assessment provides decision support. Final procurement decisions remain strictly with the authorized procurement officer.
              </p>
            </div>
            <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded text-[#F4B400] font-bold shrink-0">HUMAN IN THE LOOP</span>
          </div>

          {loading ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center">
              <RefreshCw className="w-8 h-8 text-[#0B3A5B] animate-spin mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">Loading multi-bidder comparison matrix...</p>
            </div>
          ) : bids.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center">
              <p className="text-xs font-bold text-slate-500">No bids submitted for the selected tender.</p>
            </div>
          ) : (
            /* Comparison Matrix Table */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto gold-accent-border">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 text-xs font-black text-[#0B3A5B] uppercase w-1/3">Evaluation Metric</th>
                    {bids.map((bid) => (
                      <th key={bid.id} className="p-4 text-center border-l border-slate-200">
                        <span className="text-sm font-extrabold text-[#0B3A5B] block">{bid.bidderName}</span>
                        <span className="text-[10px] text-slate-400 font-medium block truncate max-w-[200px] mx-auto">
                          {bid.tender?.tenderNumber}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {/* Compliance Score Row */}
                  <tr className="bg-slate-50/50 font-bold">
                    <td className="p-4 text-slate-700">Overall Compliance Score</td>
                    {bids.map((bid) => (
                      <td key={bid.id} className="p-4 text-center border-l border-slate-200">
                        <span
                          className={`text-lg font-black ${
                            bid.complianceScore >= 80
                              ? 'text-[#138A4B]'
                              : bid.complianceScore >= 60
                              ? 'text-[#D98200]'
                              : 'text-[#C62828]'
                          }`}
                        >
                          {bid.complianceScore}%
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Risk Level Row */}
                  <tr className="bg-slate-50/50 font-bold">
                    <td className="p-4 text-slate-700">Calculated Risk Score & Rating</td>
                    {bids.map((bid) => (
                      <td key={bid.id} className="p-4 text-center border-l border-slate-200">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                            bid.riskLevel === 'LOW'
                              ? 'badge-risk-low'
                              : bid.riskLevel === 'MEDIUM'
                              ? 'badge-risk-medium'
                              : 'badge-risk-high'
                          }`}
                        >
                          {bid.riskLevel} RISK ({bid.riskScore}/100)
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Dynamic Requirements Rows */}
                  {requirementsList.map((req) => (
                    <tr key={req.code} className="hover:bg-slate-50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#0B3A5B]">{req.code}</span>
                          <span className="font-medium text-slate-800">{req.title}</span>
                          {req.mandatory && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-[#C62828]">
                              MANDATORY
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] block text-slate-400 font-semibold mt-0.5">{req.category}</span>
                      </td>
                      {bids.map((bid) => {
                        const res = getStatusForRequirement(bid, req.code);
                        const isPass = res.status === 'COMPLIANT';
                        const isFail = res.status === 'NON_COMPLIANT';
                        const isMissing = res.status === 'MISSING';

                        return (
                          <td key={bid.id} className="p-4 text-center border-l border-slate-200">
                            <span
                              className={`inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold ${
                                isPass
                                  ? 'bg-[#E8F5E9] text-[#138A4B] border border-[#A5D6A7]'
                                  : isFail
                                  ? 'bg-[#FFEBEE] text-[#C62828] border border-[#EF9A9A]'
                                  : isMissing
                                  ? 'bg-slate-100 text-slate-700 border border-slate-300'
                                  : 'bg-[#FFF8E1] text-[#D98200] border border-[#FFE082]'
                              }`}
                            >
                              {isPass && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {isFail && <XCircle className="w-3.5 h-3.5" />}
                              {isMissing && <AlertCircle className="w-3.5 h-3.5" />}
                              <span>{res.status}</span>
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}
