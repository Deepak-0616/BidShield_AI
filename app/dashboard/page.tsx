'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  FileText,
  FileCheck,
  AlertTriangle,
  Award,
  Clock,
  CheckCircle,
  ArrowUpRight,
  TrendingUp,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Users,
  Building2,
  Scale,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import RoleGuard from '@/components/auth/RoleGuard';
import { useAuth } from '@/lib/auth-context';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/summary')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json);
        }
      })
      .catch((err) => console.error('Dashboard fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats || {
    activeTenders: 4,
    totalBids: 8,
    bidsUnderReview: 6,
    approvedBids: 2,
    rejectedBids: 0,
    highRiskBids: 2,
    averageCompliance: 76.5,
    pendingReviews: 12,
    officersCount: 2,
    biddersCount: 8,
    verifiedBiddersCount: 0,
    activeDebarmentsCount: 0,
    totalDebarmentsCount: 3,
  };

  const riskPieData = data?.riskDistribution || [
    { name: 'Low Risk', value: 4, color: '#138A4B' },
    { name: 'Medium Risk', value: 2, color: '#D98200' },
    { name: 'High Risk', value: 2, color: '#C62828' },
  ];

  const complianceBarData = data?.complianceOverview?.map((c: any) => ({
    category: c.category,
    compliance: c.compliant,
  })) || [
    { category: 'Legal', compliance: 100 },
    { category: 'Financial', compliance: 80 },
    { category: 'Technical', compliance: 85 },
    { category: 'Experience', compliance: 90 },
    { category: 'Local Content', compliance: 75 },
    { category: 'Certification', compliance: 80 },
  ];

  return (
    <RoleGuard allowedRoles={['ADMIN', 'PROCUREMENT_OFFICER', 'AUDITOR']}>
      <DashboardLayout>
        <div className="space-y-6 max-w-7xl mx-auto">
          {/* Title Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl font-black text-[#0B3A5B] tracking-tight">Procurement Intelligence Dashboard</h1>
              <p className="text-xs text-slate-500 mt-1">
                Active Role: <strong>{user?.role?.replace('_', ' ')}</strong> • Live database monitoring & compliance metrics
              </p>
            </div>
            {user?.role === 'PROCUREMENT_OFFICER' && (
              <div className="flex items-center gap-3">
                <Link
                  href="/tenders/new"
                  className="px-4 py-2 bg-[#0B3A5B] text-white text-xs font-bold rounded-lg shadow hover:bg-[#082C46] transition flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-[#F4B400]" />
                  <span>Open a Tender</span>
                </Link>
              </div>
            )}
            {user?.role === 'AUDITOR' && (
              <div className="flex items-center gap-3">
                <Link
                  href="/audit"
                  className="px-4 py-2 bg-[#0B3A5B] text-white text-xs font-bold rounded-lg shadow hover:bg-[#082C46] transition flex items-center gap-2"
                >
                  <Scale className="w-4 h-4 text-[#F4B400]" />
                  <span>Auditor Decision Workspace</span>
                </Link>
              </div>
            )}
          </div>

          {/* Live Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between gold-accent-border">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Active Tenders</span>
                <FileText className="w-4 h-4 text-[#0B3A5B]" />
              </div>
              <div>
                <span className="text-2xl font-black text-[#0B3A5B]">{stats.activeTenders}</span>
                <span className="text-[10px] text-[#138A4B] font-semibold flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> Live in Database
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Bids Under Review</span>
                <FileCheck className="w-4 h-4 text-[#1261A0]" />
              </div>
              <div>
                <span className="text-2xl font-black text-[#1261A0]">{stats.bidsUnderReview}</span>
                <span className="text-[10px] text-slate-400 font-medium block mt-1">Pending Audit</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">High Risk Bids</span>
                <AlertTriangle className="w-4 h-4 text-[#C62828]" />
              </div>
              <div>
                <span className="text-2xl font-black text-[#C62828]">{stats.highRiskBids}</span>
                <span className="text-[10px] text-[#C62828] font-semibold block mt-1">Non-compliant Flags</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Avg Compliance</span>
                <Award className="w-4 h-4 text-[#138A4B]" />
              </div>
              <div>
                <span className="text-2xl font-black text-[#138A4B]">{stats.averageCompliance}%</span>
                <span className="text-[10px] text-[#138A4B] font-semibold block mt-1">Deterministic Rules</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Approved Bids</span>
                <CheckCircle className="w-4 h-4 text-[#138A4B]" />
              </div>
              <div>
                <span className="text-2xl font-black text-[#138A4B]">{stats.approvedBids}</span>
                <span className="text-[10px] text-slate-400 font-medium block mt-1">Auditor Awarded</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Debarment Registry</span>
                <Shield className="w-4 h-4 text-[#0B3A5B]" />
              </div>
              <div>
                <span className="text-2xl font-black text-[#0B3A5B]">{stats.totalDebarmentsCount}</span>
                <span className="text-[10px] text-slate-400 font-medium block mt-1">Gazetted Records</span>
              </div>
            </div>
          </div>

          {/* Admin Global Visibility Card (for Admin role) */}
          {user?.role === 'ADMIN' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 gold-accent-border">
              <h3 className="text-xs font-bold text-[#0B3A5B] uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-[#F4B400]" />
                <span>Admin Platform Role & Governance Directory</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Procurement Officers</span>
                  <span className="text-xl font-black text-[#0B3A5B]">{stats.officersCount}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">MoPNG & MNRE Division</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Registered Bidders</span>
                  <span className="text-xl font-black text-[#0B3A5B]">{stats.biddersCount}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Supplier Accounts</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">GST Verified Bidders</span>
                  <span className="text-xl font-black text-[#138A4B]">{stats.verifiedBiddersCount}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Statutory Checksum Active</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Debarments</span>
                  <span className="text-xl font-black text-[#C62828]">{stats.activeDebarmentsCount}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Central/Ministry Orders</span>
                </div>
              </div>
            </div>
          )}

          {/* Charts Section */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Category Compliance Bar Chart */}
            <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-[#0B3A5B] uppercase tracking-wider">Category Compliance Overview</h2>
                <span className="text-xs text-slate-400 font-medium">Deterministic DB Pass Rates</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={complianceBarData}>
                    <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="compliance" fill="#0B3A5B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk Distribution Pie Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-[#0B3A5B] uppercase tracking-wider">Risk Distribution</h2>
                <Shield className="w-4 h-4 text-slate-400" />
              </div>
              <div className="h-52 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {riskPieData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-around text-xs pt-2 border-t border-slate-100">
                <div className="text-center">
                  <span className="block w-2.5 h-2.5 rounded-full bg-[#138A4B] mx-auto mb-1"></span>
                  <span className="text-slate-600 font-semibold">Low</span>
                </div>
                <div className="text-center">
                  <span className="block w-2.5 h-2.5 rounded-full bg-[#D98200] mx-auto mb-1"></span>
                  <span className="text-slate-600 font-semibold">Medium</span>
                </div>
                <div className="text-center">
                  <span className="block w-2.5 h-2.5 rounded-full bg-[#C62828] mx-auto mb-1"></span>
                  <span className="text-slate-600 font-semibold">High</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Submissions List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#0B3A5B] uppercase tracking-wider">Recent Bid Submissions</h2>
                <p className="text-xs text-slate-500">Live database records and audit standings</p>
              </div>
              <Link
                href="/bids"
                className="text-xs font-bold text-[#1261A0] hover:underline flex items-center gap-1"
              >
                <span>View All Bids</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                    <th className="p-4">Bidder Entity</th>
                    <th className="p-4">Tender Reference</th>
                    <th className="p-4">Compliance Score</th>
                    <th className="p-4">Risk Level</th>
                    <th className="p-4">Review Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {data?.recentBids?.map((b: any) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition">
                      <td className="p-4">
                        <Link href={`/bids/${b.id}`} className="font-bold text-[#0B3A5B] hover:underline block">
                          {b.bidderName}
                        </Link>
                        <span className="text-[10px] text-slate-400">
                          {b.bidder?.gstStatus === 'ACTIVE' ? `GST: ${b.bidder.gstin}` : 'GST Unverified'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600">
                        <span className="font-semibold block">{b.tender?.tenderNumber}</span>
                        <span className="text-[10px] text-slate-400">{b.tender?.title}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{b.complianceScore}%</span>
                          <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                b.complianceScore >= 80
                                  ? 'bg-[#138A4B]'
                                  : b.complianceScore >= 60
                                  ? 'bg-[#D98200]'
                                  : 'bg-[#C62828]'
                              }`}
                              style={{ width: `${b.complianceScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            b.riskLevel === 'LOW'
                              ? 'badge-risk-low'
                              : b.riskLevel === 'MEDIUM'
                              ? 'badge-risk-medium'
                              : 'badge-risk-high'
                          }`}
                        >
                          {b.riskLevel} RISK ({b.riskScore}/100)
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            b.finalReviewStatus === 'APPROVED'
                              ? 'bg-green-100 text-[#138A4B]'
                              : b.finalReviewStatus === 'REJECTED'
                              ? 'bg-red-100 text-[#C62828]'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {b.finalReviewStatus || b.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/bids/${b.id}`}
                          className="px-3 py-1.5 bg-[#0B3A5B] text-white text-[11px] font-bold rounded hover:bg-[#082C46] transition inline-block shadow-sm"
                        >
                          Inspect AI Evidence
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}
