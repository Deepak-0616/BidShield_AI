'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RoleGuard from '@/components/auth/RoleGuard';
import { FileCheck, Search, Filter, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function BidsListingPage() {
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [riskFilter, setRiskFilter] = useState('ALL');

  useEffect(() => {
    fetch(`/api/bids?riskLevel=${riskFilter}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBids(data.bids);
        }
      })
      .finally(() => setLoading(false));
  }, [riskFilter]);

  return (
    <RoleGuard allowedRoles={['ADMIN', 'PROCUREMENT_OFFICER', 'AUDITOR']}>
      <DashboardLayout>
        <div className="space-y-6 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl font-black text-[#0B3A5B] tracking-tight">Bidder Submissions & AI Assessments</h1>
              <p className="text-xs text-slate-500 mt-1">First-level GeM procurement compliance & risk evaluation</p>
            </div>
            <Link
              href="/compare"
              className="px-4 py-2.5 bg-[#0B3A5B] text-white text-xs font-bold rounded-lg shadow hover:bg-[#082C46] transition flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#F4B400]" />
              <span>Side-by-Side Bid Comparison</span>
            </Link>
          </div>

          {/* Filter */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Filter Bids by Risk Level</span>
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

          {/* Bids Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {bids.map((bid) => (
              <div key={bid.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 gold-accent-border">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {bid.tender?.tenderNumber}
                    </span>
                    <h2 className="text-lg font-extrabold text-[#0B3A5B] mt-1">{bid.bidderName}</h2>
                    <p className="text-xs text-slate-500">{bid.tender?.title}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black ${
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
                    <span className="text-base font-black text-[#0B3A5B]">{bid.documents?.length || 8} Files</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-[11px] text-slate-500">Status: <strong className="text-slate-800">{bid.status}</strong></span>
                  <Link
                    href={`/bids/${bid.id}`}
                    className="px-4 py-2 bg-[#0B3A5B] text-white text-xs font-bold rounded-lg hover:bg-[#082C46] transition flex items-center gap-1.5"
                  >
                    <span>Open Primary AI Inspection Screen</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}

