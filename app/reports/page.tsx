'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RoleGuard from '@/components/auth/RoleGuard';
import { FileCheck2, Download, Eye, ShieldCheck, Award } from 'lucide-react';

export default function ReportsPage() {
  const [bids, setBids] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/bids')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBids(data.bids);
        }
      });
  }, []);

  return (
    <RoleGuard allowedRoles={['ADMIN', 'PROCUREMENT_OFFICER', 'AUDITOR']}>
      <DashboardLayout>
        <div className="space-y-6 max-w-7xl mx-auto">
          <div className="border-b border-slate-200 pb-4">
            <h1 className="text-2xl font-black text-[#0B3A5B] tracking-tight">Compliance Reports Center</h1>
            <p className="text-xs text-slate-500 mt-1">Official downloadable PDF compliance & risk assessment reports</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden gold-accent-border">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                  <th className="p-4">Report Reference</th>
                  <th className="p-4">Bidder Entity</th>
                  <th className="p-4">Compliance Score</th>
                  <th className="p-4">Risk Rating</th>
                  <th className="p-4">Generated Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {bids.map((bid) => (
                  <tr key={bid.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-mono text-[#0B3A5B] font-bold">RPT-2026-{bid.id.substring(0, 6).toUpperCase()}</td>
                    <td className="p-4 font-bold text-slate-800">{bid.bidderName}</td>
                    <td className="p-4 font-bold text-[#138A4B]">{bid.complianceScore}%</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {bid.riskLevel} RISK ({bid.riskScore}/100)
                      </span>
                    </td>
                    <td className="p-4">
                      <a
                        href={`/api/reports/compliance/${bid.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 bg-[#0B3A5B] text-white text-xs font-bold rounded hover:bg-[#082C46] transition inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5 text-[#F4B400]" />
                        <span>Download PDF Report</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}

