'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RoleGuard from '@/components/auth/RoleGuard';
import { useAuth } from '@/lib/auth-context';
import { FileText, FileCheck, Plus, Search, Filter, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function TendersPage() {
  const { user } = useAuth();
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const canCreateTender = user?.role === 'ADMIN' || user?.role === 'PROCUREMENT_OFFICER';

  useEffect(() => {
    fetch(`/api/tenders?search=${search}&status=${statusFilter}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTenders(data.tenders);
        }
      })
      .finally(() => setLoading(false));
  }, [search, statusFilter]);

  return (
    <RoleGuard allowedRoles={['ADMIN', 'PROCUREMENT_OFFICER', 'AUDITOR', 'BIDDER']}>
      <DashboardLayout>
        <div className="space-y-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl font-black text-[#0B3A5B] tracking-tight">Tender Management</h1>
              <p className="text-xs text-slate-500 mt-1">GeM procurement tenders & AI requirement definitions</p>
            </div>
            {canCreateTender && (
              <Link
                href="/tenders/new"
                className="px-4 py-2.5 bg-[#0B3A5B] text-white text-xs font-bold rounded-lg shadow hover:bg-[#082C46] transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-[#F4B400]" />
                <span>Open a Tender</span>
              </Link>
            )}
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search tender title or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:ring-1 focus:ring-[#0B3A5B]"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none font-semibold text-slate-700"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>

          {/* Tenders Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                  <th className="p-4">Tender Number</th>
                  <th className="p-4">Title & Department</th>
                  <th className="p-4">Est. Value</th>
                  <th className="p-4">Bids Submitted</th>
                  <th className="p-4">Deadline</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {tenders.map((tender) => (
                  <tr key={tender.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-bold text-[#0B3A5B]">{tender.tenderNumber}</td>
                    <td className="p-4">
                      <span className="font-bold text-[#17202A] block">{tender.title}</span>
                      <span className="text-[10px] text-slate-400">{tender.department?.name || 'MoPNG'}</span>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">₹{(tender.estimatedValue / 10000000).toFixed(2)} Cr</td>
                    <td className="p-4">
                      <Link
                        href={`/bids?tenderId=${tender.id}`}
                        className="px-2 py-0.5 rounded bg-blue-50 text-[#1261A0] font-bold hover:underline inline-block"
                      >
                        {tender._count?.bids || 0} Bids
                      </Link>
                    </td>
                    <td className="p-4 text-slate-500">{new Date(tender.submissionDeadline).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#138A4B]/10 text-[#138A4B] border border-[#138A4B]/20">
                        {tender.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/tenders/${tender.id}/requirements`}
                          className="px-2.5 py-1.5 bg-slate-100 text-[#0B3A5B] text-[11px] font-bold rounded hover:bg-slate-200 transition inline-flex items-center gap-1"
                        >
                          <span>Reqs ({tender._count?.requirements || 0})</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                        {user?.role === 'BIDDER' ? (
                          <Link
                            href={`/bidder/dashboard?tenderId=${tender.id}`}
                            className="px-2.5 py-1.5 bg-[#0B3A5B] text-white text-[11px] font-bold rounded hover:bg-[#082C46] transition inline-flex items-center gap-1 shadow-sm"
                          >
                            <FileText className="w-3 h-3 text-[#F4B400]" />
                            <span>Bidder Portal</span>
                          </Link>
                        ) : (
                          <Link
                            href={`/bids?tenderId=${tender.id}`}
                            className="px-2.5 py-1.5 bg-[#0B3A5B] text-white text-[11px] font-bold rounded hover:bg-[#082C46] transition inline-flex items-center gap-1 shadow-sm"
                          >
                            <FileCheck className="w-3 h-3 text-[#F4B400]" />
                            <span>View Bids ({tender._count?.bids || 0})</span>
                          </Link>
                        )}
                      </div>
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

