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
    activeTenders: 1,
    bidsUnderReview: 2,
    highRiskBids: 1,
    averageCompliance: 83.5,
    pendingReviews: 3,
    completedAssessments: 1,
  };

  const riskPieData = data?.riskDistribution || [
    { name: 'Low Risk', value: 1, color: '#138A4B' },
    { name: 'Medium Risk', value: 1, color: '#D98200' },
    { name: 'High Risk', value: 0, color: '#C62828' },
  ];

  const complianceBarData = [
    { category: 'Legal', compliance: 100 },
    { category: 'Financial', compliance: 100 },
    { category: 'Technical', compliance: 50 },
    { category: 'Experience', compliance: 50 },
    { category: 'Local Content', compliance: 50 },
    { category: 'Certification', compliance: 100 },
  ];

  return (
    <RoleGuard allowedRoles={['ADMIN', 'PROCUREMENT_OFFICER', 'AUDITOR']}>
      <DashboardLayout>
        <div className="space-y-6 max-w-7xl mx-auto">
          {/* Title Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl font-black text-[#0B3A5B] tracking-tight">Procurement Intelligence Dashboard</h1>
              <p className="text-xs text-slate-500 mt-1">Live database monitoring & AI compliance overview</p>
            </div>
            {user?.role !== 'AUDITOR' && (
              <div className="flex items-center gap-3">
                <Link
                  href="/tenders/new"
                  className="px-4 py-2 bg-[#0B3A5B] text-white text-xs font-bold rounded-lg shadow hover:bg-[#082C46] transition flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>New Tender + AI Extractor</span>
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
                <TrendingUp className="w-3 h-3" /> +100% active
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
              <span className="text-[10px] text-slate-400 font-medium block mt-1">NovaTech & Apex</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">High Risk Bids</span>
              <AlertTriangle className="w-4 h-4 text-[#C62828]" />
            </div>
            <div>
              <span className="text-2xl font-black text-[#C62828]">{stats.highRiskBids}</span>
              <span className="text-[10px] text-[#C62828] font-semibold block mt-1">Requires Officer Action</span>
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
              <span className="text-[11px] font-bold uppercase tracking-wider">Pending Reviews</span>
              <Clock className="w-4 h-4 text-[#D98200]" />
            </div>
            <div>
              <span className="text-2xl font-black text-[#D98200]">{stats.pendingReviews}</span>
              <span className="text-[10px] text-slate-400 font-medium block mt-1">Evidence Items</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Completed</span>
              <CheckCircle className="w-4 h-4 text-[#138A4B]" />
            </div>
            <div>
              <span className="text-2xl font-black text-[#17202A]">{stats.completedAssessments}</span>
              <span className="text-[10px] text-slate-400 font-medium block mt-1">Approved Bids</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Category Compliance Bar Chart */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#0B3A5B] uppercase tracking-wider">Category Compliance Overview</h2>
              <span className="text-xs text-slate-400">Deterministic Percentage</span>
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

        {/* Recent Bids Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0B3A5B]">Submitted Tender Bids Under Review</h2>
              <p className="text-xs text-slate-500">Click any bidder to open primary AI evaluation screen</p>
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
                {data?.recentBids?.map((bid: any) => (
                  <tr key={bid.id} className="hover:bg-slate-50 transition">
                    <td className="p-4">
                      <Link href={`/bids/${bid.id}`} className="font-bold text-[#0B3A5B] hover:underline">
                        {bid.bidderName}
                      </Link>
                    </td>
                    <td className="p-4 text-slate-600">
                      <span className="font-semibold block">{bid.tenderNumber}</span>
                      <span className="text-[10px] text-slate-400">{bid.tenderTitle}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{bid.complianceScore}%</span>
                        <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              bid.complianceScore >= 80
                                ? 'bg-[#138A4B]'
                                : bid.complianceScore >= 60
                                ? 'bg-[#D98200]'
                                : 'bg-[#C62828]'
                            }`}
                            style={{ width: `${bid.complianceScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
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
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {bid.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/bids/${bid.id}`}
                        className="px-3 py-1.5 bg-[#0B3A5B] text-white text-[11px] font-bold rounded hover:bg-[#082C46] transition inline-block"
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

