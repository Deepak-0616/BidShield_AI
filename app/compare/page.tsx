'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Scale, CheckCircle2, XCircle, AlertCircle, ShieldAlert, Award } from 'lucide-react';

export default function CompareBiddersPage() {
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bidIds: [] }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBids(data.bids);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const requirementsList = [
    { code: 'R1', title: 'GST Registration (Active GSTIN)', category: 'LEGAL' },
    { code: 'R2', title: 'PAN Registration (Income Tax)', category: 'LEGAL' },
    { code: 'R3', title: 'Turnover Threshold (₹10.0 Crore)', category: 'FINANCIAL' },
    { code: 'R4', title: 'Relevant Experience (5 Years Minimum)', category: 'EXPERIENCE' },
    { code: 'R5', title: 'OEM Authorization Letter', category: 'TECHNICAL' },
    { code: 'R6', title: 'ISO 9001:2015 Quality Certificate', category: 'CERTIFICATION' },
    { code: 'R7', title: 'Local Content Class-I (50% Minimum)', category: 'LOCAL_CONTENT' },
    { code: 'R8', title: 'MSME / Udyam Registration', category: 'DOCUMENTATION' },
  ];

  const getStatusForRequirement = (bid: any, reqCode: string) => {
    const cr = bid.complianceResults?.find((c: any) => c.requirement?.requirementCode === reqCode);
    if (!cr) return { status: 'UNVERIFIED', text: 'Unverified' };
    return { status: cr.status, text: cr.status };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-black text-[#0B3A5B] tracking-tight">Bidder Comparison Matrix</h1>
          <p className="text-xs text-slate-500 mt-1">Multi-bidder side-by-side compliance & risk evaluation</p>
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

        {/* Comparison Matrix Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden gold-accent-border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-xs font-black text-[#0B3A5B] uppercase w-1/3">Evaluation Metric</th>
                {bids.map((bid) => (
                  <th key={bid.id} className="p-4 text-center border-l border-slate-200">
                    <span className="text-sm font-extrabold text-[#0B3A5B] block">{bid.bidderName}</span>
                    <span className="text-[10px] text-slate-400 font-medium">Submitted Tender Bid</span>
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
                    <span className={`text-lg font-black ${bid.complianceScore >= 80 ? 'text-[#138A4B]' : 'text-[#D98200]'}`}>
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
                        bid.riskLevel === 'LOW' ? 'badge-risk-low' : 'badge-risk-medium'
                      }`}
                    >
                      {bid.riskLevel} RISK ({bid.riskScore}/100)
                    </span>
                  </td>
                ))}
              </tr>

              {/* Requirements Rows */}
              {requirementsList.map((req) => (
                <tr key={req.code} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <span className="font-bold text-[#0B3A5B] mr-2">{req.code}</span>
                    <span className="font-medium text-slate-800">{req.title}</span>
                    <span className="text-[9px] block text-slate-400 font-semibold">{req.category}</span>
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
                              ? 'bg-[#E8F5E9] text-[#138A4B]'
                              : isFail
                              ? 'bg-[#FFEBEE] text-[#C62828]'
                              : isMissing
                              ? 'bg-slate-100 text-slate-700 border border-slate-300'
                              : 'bg-[#FFF8E1] text-[#D98200]'
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
      </div>
    </DashboardLayout>
  );
}
