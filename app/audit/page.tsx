'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RoleGuard from '@/components/auth/RoleGuard';
import { useAuth } from '@/lib/auth-context';
import {
  History,
  Shield,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Building2,
  RefreshCw,
  Search,
  Check,
  Eye,
  Scale,
  Sparkles,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

export default function AuditorPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'audits' | 'logs'>('audits');
  const [bids, setBids] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Inspection modal state
  const [selectedBid, setSelectedBid] = useState<any | null>(null);
  const [inspectLoading, setInspectLoading] = useState(false);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [decisionAction, setDecisionAction] = useState<'APPROVED' | 'REJECTED' | 'CLARIFICATION_REQUESTED' | null>(null);
  const [decisionReason, setDecisionReason] = useState('');
  const [submittingDecision, setSubmittingDecision] = useState(false);
  const [decisionFeedback, setDecisionFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchAuditorData = async () => {
    setLoading(true);
    try {
      const [bidsRes, logsRes] = await Promise.all([
        fetch('/api/bids?all=true'),
        fetch('/api/audit-logs'),
      ]);

      const bidsData = await bidsRes.json();
      const logsData = await logsRes.json();

      if (bidsData.success) {
        setBids(bidsData.bids || []);
      }
      if (logsData.success) {
        setLogs(logsData.logs || []);
      }
    } catch (err) {
      console.error('Fetch auditor data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditorData();
  }, []);

  const openInspection = async (bidId: string) => {
    setInspectLoading(true);
    setInspectModalOpen(true);
    setDecisionAction(null);
    setDecisionReason('');
    setDecisionFeedback(null);

    try {
      const res = await fetch(`/api/bids/${bidId}`);
      const data = await res.json();
      if (data.success) {
        setSelectedBid(data);
      }
    } catch (err) {
      console.error('Error fetching bid for audit inspection:', err);
    } finally {
      setInspectLoading(false);
    }
  };

  const handleAuditDecision = async (action: 'APPROVED' | 'REJECTED' | 'CLARIFICATION_REQUESTED') => {
    if (!selectedBid?.bid?.id) return;
    if (!decisionReason.trim()) {
      setDecisionFeedback({ type: 'error', text: 'Please enter mandatory audit review reasoning.' });
      return;
    }

    setSubmittingDecision(true);
    setDecisionFeedback(null);

    try {
      const res = await fetch(`/api/bids/${selectedBid.bid.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          finalReviewStatus: action,
          reviewComments: decisionReason.trim(),
          overrideReason:
            selectedBid.debarmentStatus?.hasActiveDebarment ? decisionReason.trim() : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDecisionFeedback({
          type: 'success',
          text: `Audit decision recorded: ${action}. AuditLog entry saved.`,
        });
        await fetchAuditorData();
        // Refresh active inspection
        const updatedBidRes = await fetch(`/api/bids/${selectedBid.bid.id}`);
        const updatedBidJson = await updatedBidRes.json();
        if (updatedBidJson.success) {
          setSelectedBid(updatedBidJson);
        }
      } else {
        setDecisionFeedback({
          type: 'error',
          text: data.error?.message || 'Audit decision submission failed.',
        });
      }
    } catch (err: any) {
      setDecisionFeedback({ type: 'error', text: err.message || 'Error recording audit decision.' });
    } finally {
      setSubmittingDecision(false);
    }
  };

  const filteredBids = bids.filter((b) => {
    const matchesSearch =
      b.bidderName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tender?.tenderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tender?.title?.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStatus === 'ALL') return matchesSearch;
    if (filterStatus === 'PENDING') return matchesSearch && b.finalReviewStatus === 'UNDER_REVIEW';
    if (filterStatus === 'APPROVED') return matchesSearch && b.finalReviewStatus === 'APPROVED';
    if (filterStatus === 'REJECTED') return matchesSearch && b.finalReviewStatus === 'REJECTED';
    if (filterStatus === 'HIGH_RISK') return matchesSearch && b.riskLevel === 'HIGH';
    return matchesSearch;
  });

  return (
    <RoleGuard allowedRoles={['AUDITOR', 'ADMIN']}>
      <DashboardLayout userRole="AUDITOR" department="Auditor & Compliance Division">
        <div className="space-y-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded bg-blue-100 text-[#0B3A5B] font-bold text-[10px]">
                  AUDITOR WORKSPACE
                </span>
                <span className="text-xs text-slate-500 font-medium">Final Procurement Approval & Integrity Verification</span>
              </div>
              <h1 className="text-2xl font-black text-[#0B3A5B] tracking-tight">Auditor Oversight & Decision Dashboard</h1>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveTab('audits')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-2 ${
                  activeTab === 'audits'
                    ? 'bg-[#0B3A5B] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#0B3A5B]'
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>Bid Compliance Audits ({bids.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-2 ${
                  activeTab === 'logs'
                    ? 'bg-[#0B3A5B] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#0B3A5B]'
                }`}
              >
                <History className="w-4 h-4" />
                <span>System Audit Logs ({logs.length})</span>
              </button>
            </div>
          </div>

          {activeTab === 'audits' ? (
            <>
              {/* Filter Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by Bidder, Tender No, or Title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#0B3A5B]"
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-500">Filter Status:</span>
                  {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'HIGH_RISK'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setFilterStatus(st)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg border transition ${
                        filterStatus === st
                          ? 'bg-[#0B3A5B] text-white border-[#0B3A5B]'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bids Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden gold-accent-border">
                {loading ? (
                  <div className="p-12 text-center">
                    <RefreshCw className="w-8 h-8 text-[#0B3A5B] animate-spin mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-500">Loading submitted bids for auditor review...</p>
                  </div>
                ) : filteredBids.length === 0 ? (
                  <div className="p-12 text-center">
                    <CheckCircle2 className="w-8 h-8 text-[#138A4B] mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-600">No bids match the selected audit filter.</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                        <th className="p-4">Bidder & Entity</th>
                        <th className="p-4">Tender Details</th>
                        <th className="p-4">AI Score</th>
                        <th className="p-4">Risk Level</th>
                        <th className="p-4">Audit Decision</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium">
                      {filteredBids.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50 transition">
                          <td className="p-4">
                            <span className="font-extrabold text-[#0B3A5B] block">{b.bidderName}</span>
                            <div className="flex items-center gap-1 mt-0.5">
                              {b.bidder?.gstStatus === 'ACTIVE' ? (
                                <span className="px-1.5 py-0.2 rounded bg-green-100 text-[#138A4B] text-[9px] font-bold">
                                  GST: {b.bidder.gstin}
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                                  GST Unverified
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-slate-800 block truncate max-w-xs">{b.tender?.title}</span>
                            <span className="text-[10px] text-slate-400">{b.tender?.tenderNumber}</span>
                          </td>
                          <td className="p-4 font-black text-sm text-[#0B3A5B]">{b.complianceScore}%</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                b.riskLevel === 'LOW'
                                  ? 'bg-[#E8F5E9] text-[#138A4B]'
                                  : b.riskLevel === 'MEDIUM'
                                  ? 'bg-[#FFF8E1] text-[#D98200]'
                                  : 'bg-[#FFEBEE] text-[#C62828]'
                              }`}
                            >
                              {b.riskLevel} RISK
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                                b.finalReviewStatus === 'APPROVED'
                                  ? 'bg-green-50 text-[#138A4B] border-green-200'
                                  : b.finalReviewStatus === 'REJECTED'
                                  ? 'bg-red-50 text-[#C62828] border-red-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}
                            >
                              {b.finalReviewStatus || 'UNDER_REVIEW'}
                            </span>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => openInspection(b.id)}
                              className="px-3 py-1.5 bg-[#0B3A5B] text-white text-xs font-bold rounded-lg hover:bg-[#082C46] transition flex items-center gap-1.5 shadow-sm"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect & Decide</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          ) : (
            /* System Audit Trail Logs View */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden gold-accent-border">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">User</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Entity</th>
                    <th className="p-4">Metadata Payload</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 text-slate-500 font-mono text-[11px]">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-[#0B3A5B] block">{log.userName || log.user?.name}</span>
                        <span className="text-[10px] text-slate-400">{log.user?.email || 'System'}</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded bg-blue-50 text-[#0B3A5B] font-bold text-[10px]">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 font-semibold">{log.entityType}</td>
                      <td className="p-4 font-mono text-[10px] text-slate-600 max-w-sm truncate">
                        {log.metadata || '{}'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* AUDITOR DEEP INSPECTION & DECISION MODAL */}
          {inspectModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
                {inspectLoading || !selectedBid ? (
                  <div className="p-12 text-center">
                    <RefreshCw className="w-8 h-8 text-[#0B3A5B] animate-spin mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-500">Loading audit compliance data & debarment cross-checks...</p>
                  </div>
                ) : (
                  <div className="p-6 space-y-6">
                    {/* Modal Header */}
                    <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded bg-blue-100 text-[#0B3A5B] text-[10px] font-bold">
                            {selectedBid.bid.tender?.tenderNumber}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                              selectedBid.bid.finalReviewStatus === 'APPROVED'
                                ? 'bg-green-100 text-[#138A4B]'
                                : selectedBid.bid.finalReviewStatus === 'REJECTED'
                                ? 'bg-red-100 text-[#C62828]'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            STATUS: {selectedBid.bid.finalReviewStatus || 'UNDER_REVIEW'}
                          </span>
                        </div>
                        <h2 className="text-xl font-black text-[#0B3A5B] mt-1">{selectedBid.bid.bidderName}</h2>
                        <p className="text-xs text-slate-500">{selectedBid.bid.tender?.title}</p>
                      </div>

                      <button
                        onClick={() => setInspectModalOpen(false)}
                        className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1"
                      >
                        ✕
                      </button>
                    </div>

                    {/* STATUTORY DEBARMENT REGISTRY ALERT */}
                    {selectedBid.debarmentStatus?.hasActiveDebarment ? (
                      <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl text-xs space-y-1">
                        <div className="flex items-center gap-2 text-[#C62828] font-black">
                          <ShieldAlert className="w-5 h-5" />
                          <span>CRITICAL STATUTORY BLOCK: ACTIVE DEBARMENT RECORD MATCHED</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed font-medium">
                          {selectedBid.debarmentStatus.warningMessage}
                        </p>
                        <div className="text-[11px] font-mono text-red-800 pt-1">
                          Order: {selectedBid.debarmentStatus.activeMatches[0]?.orderNumber} • Authority: {selectedBid.debarmentStatus.activeMatches[0]?.debarringAuthority}
                        </div>
                      </div>
                    ) : selectedBid.debarmentStatus?.historicalMatches?.length > 0 ? (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1">
                        <div className="flex items-center gap-2 text-[#1261A0] font-bold">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Debarment Registry Standing: Clear (Historical Expired Record on File)</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">
                          {selectedBid.debarmentStatus.warningMessage}
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs flex items-center gap-2 text-[#138A4B] font-bold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Debarment Registry Clear: No active or historical debarment orders matched for this entity.</span>
                      </div>
                    )}

                    {/* Entity Verification & AI Scores Summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">GST Verification</span>
                        <span className="font-extrabold text-[#0B3A5B] block truncate">
                          {selectedBid.bid.bidder?.gstin || 'Unverified'}
                        </span>
                        <span className="text-[9px] text-slate-500">{selectedBid.bid.bidder?.gstStatus || 'UNVERIFIED'}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">AI Compliance</span>
                        <span className="text-lg font-black text-[#0B3A5B]">{selectedBid.bid.complianceScore}%</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Calculated Risk</span>
                        <span className="text-lg font-black text-[#C62828]">{selectedBid.bid.riskScore}/100</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Attached Docs</span>
                        <span className="text-lg font-black text-[#0B3A5B]">{selectedBid.bid.documents?.length || 0} Files</span>
                      </div>
                    </div>

                    {/* Requirements Compliance Breakdown */}
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Requirement-wise Compliance Matrix ({selectedBid.bid.complianceResults?.length || 0} Criteria)
                      </h3>
                      <div className="max-h-56 overflow-y-auto space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50">
                        {selectedBid.bid.complianceResults?.map((cr: any) => (
                          <div key={cr.id} className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              {cr.status === 'COMPLIANT' ? (
                                <CheckCircle2 className="w-4 h-4 text-[#138A4B] shrink-0" />
                              ) : (
                                <XCircle className="w-4 h-4 text-[#C62828] shrink-0" />
                              )}
                              <span className="px-1.5 py-0.2 bg-[#0B3A5B] text-white text-[9px] font-bold rounded">
                                {cr.requirement?.requirementCode}
                              </span>
                              <span className="font-bold text-slate-800 truncate">{cr.requirement?.title}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 truncate max-w-xs">{cr.reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AUDITOR DECISION PANEL */}
                    <div className="p-5 bg-slate-50 border border-slate-300 rounded-2xl space-y-4">
                      <h3 className="text-xs font-extrabold text-[#0B3A5B] uppercase tracking-wider flex items-center gap-1.5">
                        <Scale className="w-4 h-4 text-[#F4B400]" />
                        <span>Auditor Final Decision Action</span>
                      </h3>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 block">
                          Mandatory Audit Justification & Statutory Rationale:
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Provide detailed compliance audit findings, statutory verification citations, or clarification instructions..."
                          value={decisionReason}
                          onChange={(e) => setDecisionReason(e.target.value)}
                          className="w-full p-3 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#0B3A5B] bg-white font-medium"
                        />
                      </div>

                      {decisionFeedback && (
                        <div
                          className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                            decisionFeedback.type === 'success'
                              ? 'bg-green-50 text-[#138A4B] border border-green-200'
                              : 'bg-red-50 text-[#C62828] border border-red-200'
                          }`}
                        >
                          {decisionFeedback.type === 'success' ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <AlertCircle className="w-4 h-4" />
                          )}
                          <span>{decisionFeedback.text}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          onClick={() => handleAuditDecision('CLARIFICATION_REQUESTED')}
                          disabled={submittingDecision}
                          className="px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-lg hover:bg-amber-600 transition shadow-sm"
                        >
                          Request Correction
                        </button>
                        <button
                          onClick={() => handleAuditDecision('REJECTED')}
                          disabled={submittingDecision}
                          className="px-4 py-2 bg-[#C62828] text-white text-xs font-bold rounded-lg hover:bg-[#a72020] transition shadow-sm"
                        >
                          Reject Bid
                        </button>
                        <button
                          onClick={() => handleAuditDecision('APPROVED')}
                          disabled={submittingDecision}
                          className="px-5 py-2 bg-[#138A4B] text-white text-xs font-bold rounded-lg hover:bg-[#0f6f3c] transition shadow-sm flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve & Award Bid</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}
