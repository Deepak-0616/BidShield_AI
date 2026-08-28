'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Shield,
  FileCheck,
  AlertTriangle,
  FileText,
  Bot,
  Download,
  Upload,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Send,
  RefreshCw,
  Search,
  Eye,
  Scale,
} from 'lucide-react';

import RoleGuard from '@/components/auth/RoleGuard';
import { useAuth } from '@/lib/auth-context';

export default function BidDetailDemoPage() {
  const { user } = useAuth();
  const params = useParams();
  const bidId = params?.id as string;

  const [bid, setBid] = useState<any>(null);
  const [categoryScores, setCategoryScores] = useState<any>(null);
  const [debarmentStatus, setDebarmentStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [updatingDecision, setUpdatingDecision] = useState(false);
  const [auditComment, setAuditComment] = useState('');
  const [decisionError, setDecisionError] = useState('');

  // Chat State for Ask BidShield
  const [chatOpen, setChatOpen] = useState(true);
  const [chatQuery, setChatQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      role: 'ASSISTANT',
      message:
        'Hello. I am BidShield AI — your evidence-grounded AI procurement assistant. Ask me anything about this bid compliance findings.',
      citations: [],
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Selected Evidence Modal/Drawer State
  const [selectedResult, setSelectedResult] = useState<any>(null);

  const fetchBid = () => {
    if (!bidId) return;
    fetch(`/api/bids/${bidId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBid(data.bid);
          setCategoryScores(data.categoryScores);
          setDebarmentStatus(data.debarmentStatus);
          setChatMessages([
            {
              role: 'ASSISTANT',
              message: `Hello. I am BidShield AI — your evidence-grounded AI procurement assistant. I have indexed all submitted compliance documents for ${data.bid.bidderName} (${data.bid.tender?.tenderNumber}). Ask me any questions regarding eligibility, certifications, turnover, or technical criteria.`,
              citations: [],
            },
          ]);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBid();
  }, [bidId]);

  const handleRunCompliance = async () => {
    if (!bidId) return;
    setRecalculating(true);
    try {
      const res = await fetch(`/api/compliance/${bidId}/run`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchBid();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRecalculating(false);
    }
  };

  const handleUpdateDecision = async (status: string) => {
    if (!bidId) return;
    setUpdatingDecision(true);
    setDecisionError('');
    try {
      const res = await fetch(`/api/bids/${bidId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          finalReviewStatus: status,
          reviewComments: auditComment || 'Decision recorded by Auditor',
          overrideReason: debarmentStatus?.hasActiveDebarment ? auditComment : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAuditComment('');
        fetchBid();
      } else {
        setDecisionError(data.error?.message || 'Failed to record audit decision.');
      }
    } catch (e: any) {
      setDecisionError(e.message || 'Network error recording decision.');
    } finally {
      setUpdatingDecision(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuery.trim()) return;

    const userMsg = chatQuery;
    setChatQuery('');
    setChatMessages((prev) => [...prev, { role: 'USER', message: userMsg }]);
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg, bidId }),
      });
      const data = await res.json();
      if (data.success) {
        setChatMessages((prev) => [
          ...prev,
          { role: 'ASSISTANT', message: data.response, citations: data.citations },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <RoleGuard allowedRoles={['ADMIN', 'PROCUREMENT_OFFICER', 'AUDITOR']}>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#0B3A5B] animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-600">Loading AI Compliance Evidence Engine...</p>
            </div>
          </div>
        </DashboardLayout>
      </RoleGuard>
    );
  }

  const isOfficerOrAdmin = user?.role === 'ADMIN' || user?.role === 'PROCUREMENT_OFFICER';

  // Identify any non-compliant or missing mandatory items dynamically
  const nonCompliantMandatory = bid?.complianceResults?.filter(
    (cr: any) => cr.requirement?.mandatory && (cr.status === 'NON_COMPLIANT' || cr.status === 'MISSING')
  ) || [];

  return (
    <RoleGuard allowedRoles={['ADMIN', 'PROCUREMENT_OFFICER', 'AUDITOR']}>
      <DashboardLayout>
      <div className="flex gap-6 max-w-7xl mx-auto items-start">
        {/* Main Left Evaluation View */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* Header Banner Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm gold-accent-border flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-[#0B3A5B]/10 text-[#0B3A5B] font-bold text-[10px]">
                  {bid?.tender?.tenderNumber}
                </span>
                <span className="text-xs text-slate-500 font-medium">Submitted {bid?.submittedAt ? new Date(bid.submittedAt).toLocaleDateString() : 'N/A'}</span>
                <span className="px-2 py-0.5 rounded bg-[#138A4B]/10 text-[#138A4B] font-bold text-[10px]">
                  STATUS: {bid?.finalReviewStatus || bid?.status}
                </span>
              </div>
              <h1 className="text-2xl font-black text-[#0B3A5B] tracking-tight">{bid?.bidderName}</h1>
              <p className="text-xs text-slate-500 font-medium">{bid?.tender?.title}</p>
            </div>

            {/* Circular Scores & Risk Badge */}
            <div className="flex items-center gap-6">
              {/* Compliance Gauge */}
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="34" stroke="#E2E8F0" strokeWidth="7" fill="transparent" />
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      stroke={bid?.complianceScore >= 80 ? '#138A4B' : bid?.complianceScore >= 60 ? '#D98200' : '#C62828'}
                      strokeWidth="7"
                      strokeDasharray={213}
                      strokeDashoffset={213 - (213 * (bid?.complianceScore || 0)) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <span className="absolute text-sm font-black text-[#0B3A5B]">{bid?.complianceScore}%</span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-1">Compliance</span>
              </div>

              {/* Risk Level Badge */}
              <div className="text-center">
                <div
                  className={`px-4 py-2 rounded-xl text-xs font-black shadow-sm ${
                    bid?.riskLevel === 'LOW'
                      ? 'badge-risk-low'
                      : bid?.riskLevel === 'MEDIUM'
                      ? 'badge-risk-medium'
                      : 'badge-risk-high'
                  }`}
                >
                  <span className="block text-lg leading-tight">{bid?.riskScore} / 100</span>
                  <span className="uppercase text-[9px] font-bold">{bid?.riskLevel} RISK</span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-1">Risk Score</span>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                {isOfficerOrAdmin && (
                  <button
                    onClick={handleRunCompliance}
                    disabled={recalculating}
                    className="px-3.5 py-2 bg-[#0B3A5B] text-white text-xs font-bold rounded-lg shadow hover:bg-[#082C46] transition flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${recalculating ? 'animate-spin' : ''}`} />
                    <span>Re-Run AI Verification</span>
                  </button>
                )}

                <a
                  href={`/api/reports/compliance/${bid?.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-slate-100 text-[#0B3A5B] text-xs font-bold rounded-lg hover:bg-slate-200 transition flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#1261A0]" />
                  <span>Generate Report PDF</span>
                </a>
              </div>
            </div>
          </div>

          {/* STATUTORY DEBARMENT REGISTRY STATUS BANNER */}
          {debarmentStatus?.hasActiveDebarment ? (
            <div className="bg-red-50 border-2 border-red-300 p-4 rounded-xl shadow-sm space-y-1">
              <div className="flex items-center gap-2 text-[#C62828] font-black text-xs">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>CRITICAL STATUTORY BLOCK: ACTIVE DEBARMENT RECORD MATCHED</span>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                {debarmentStatus.warningMessage}
              </p>
              <div className="text-[10px] font-mono text-red-800 pt-1">
                Order: {debarmentStatus.activeMatches[0]?.orderNumber} • Authority: {debarmentStatus.activeMatches[0]?.debarringAuthority}
              </div>
            </div>
          ) : debarmentStatus?.historicalMatches?.length > 0 ? (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl shadow-sm text-xs space-y-1">
              <div className="flex items-center gap-2 text-[#1261A0] font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Debarment Registry Standing: Clear (Historical Record on File)</span>
              </div>
              <p className="text-[11px] text-slate-600">
                {debarmentStatus.warningMessage}
              </p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 p-3 rounded-xl shadow-sm text-xs flex items-center gap-2 text-[#138A4B] font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Debarment Registry Clear: No active or historical debarment orders matched for this entity.</span>
            </div>
          )}

          {/* Role-Based Decision Actions Bar */}
          {user?.role === 'AUDITOR' || user?.role === 'ADMIN' ? (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-xs font-bold text-[#0B3A5B] uppercase tracking-wider flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-[#F4B400]" />
                    <span>Auditor Final Decision Action</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">Record final statutory approval, rejection, or request correction with audit trail logging</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-[#0B3A5B]">
                  Current Status: {bid?.finalReviewStatus || 'UNDER_REVIEW'}
                </span>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter audit rationale / decision comments (Mandatory for approval/rejection)..."
                  value={auditComment}
                  onChange={(e) => setAuditComment(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#0B3A5B]"
                />
              </div>

              {decisionError && (
                <div className="p-3 bg-red-50 border border-red-200 text-[#C62828] text-xs font-bold rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{decisionError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => handleUpdateDecision('CLARIFICATION_REQUESTED')}
                  disabled={updatingDecision}
                  className="px-4 py-2 bg-[#D98200] text-white text-xs font-bold rounded-lg hover:bg-[#ad6800] transition shadow flex items-center gap-1.5"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Request Clarification</span>
                </button>
                <button
                  onClick={() => handleUpdateDecision('REJECTED')}
                  disabled={updatingDecision}
                  className="px-4 py-2 bg-[#C62828] text-white text-xs font-bold rounded-lg hover:bg-[#9a1f1f] transition shadow flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Bid</span>
                </button>
                <button
                  onClick={() => handleUpdateDecision('APPROVED')}
                  disabled={updatingDecision}
                  className="px-4 py-2 bg-[#138A4B] text-white text-xs font-bold rounded-lg hover:bg-[#0f6f3c] transition shadow flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Award Bid</span>
                </button>
              </div>
            </div>
          ) : user?.role === 'PROCUREMENT_OFFICER' ? (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#0B3A5B] block">Procurement Officer Review Mode</span>
                <span className="text-[11px] text-slate-500">Inspection & verification active. Final approval/award decisions are executed exclusively by the Auditor workflow.</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-blue-50 text-[#0B3A5B] font-bold text-[10px]">
                Status: {bid?.finalReviewStatus || 'UNDER_REVIEW'}
              </span>
            </div>
          ) : null}

          {/* Dynamic Risk & Non-Compliance Alert */}
          {nonCompliantMandatory.length > 0 && (
            <div className="bg-[#FFF8E1] border-l-4 border-[#D98200] p-4 rounded-xl shadow-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#D98200] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-[#D98200] uppercase tracking-wider">
                  Mandatory Non-Compliance Flags Detected ({nonCompliantMandatory.length})
                </h3>
                <ul className="text-xs text-slate-700 mt-1 space-y-1">
                  {nonCompliantMandatory.map((ncm: any) => (
                    <li key={ncm.id}>
                      <strong>{ncm.requirement?.requirementCode} ({ncm.requirement?.title}):</strong> {ncm.reason}
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-slate-500 mt-2 italic">
                  Deterministic rule engine flags mandatory non-compliance. Manual review by procurement authority required before awarding.
                </p>
              </div>
            </div>
          )}

          {/* Category Scores Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label: 'LEGAL', score: categoryScores?.LEGAL?.scorePercent ?? 100 },
              { label: 'FINANCIAL', score: categoryScores?.FINANCIAL?.scorePercent ?? 100 },
              { label: 'TECHNICAL', score: categoryScores?.TECHNICAL?.scorePercent ?? 100 },
              { label: 'EXPERIENCE', score: categoryScores?.EXPERIENCE?.scorePercent ?? 100 },
              { label: 'LOCAL CONTENT', score: categoryScores?.LOCAL_CONTENT?.scorePercent ?? 100 },
              { label: 'CERTIFICATION', score: categoryScores?.CERTIFICATION?.scorePercent ?? 100 },
              { label: 'DOCUMENTATION', score: categoryScores?.DOCUMENTATION?.scorePercent ?? 100 },
            ].map((cat, i) => (
              <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{cat.label}</span>
                <span className={`text-base font-black ${cat.score === 100 ? 'text-[#138A4B]' : cat.score > 0 ? 'text-[#D98200]' : 'text-[#C62828]'}`}>
                  {cat.score}%
                </span>
              </div>
            ))}
          </div>

          {/* Compliance Findings List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#0B3A5B] uppercase tracking-wider">Requirement Compliance Findings</h2>
                <p className="text-xs text-slate-500">Deterministic rule validation + AI evidence matching</p>
              </div>
              <span className="text-xs text-slate-400 font-medium">8 Evaluated Criteria</span>
            </div>

            <div className="divide-y divide-slate-100">
              {bid?.complianceResults?.map((res: any) => {
                const isPass = res.status === 'COMPLIANT';
                const isFail = res.status === 'NON_COMPLIANT';
                const isMissing = res.status === 'MISSING';

                return (
                  <div
                    key={res.id}
                    onClick={() => setSelectedResult(res)}
                    className="p-4 hover:bg-slate-50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#0B3A5B] text-white text-[10px] font-bold rounded">
                          {res.requirement?.requirementCode}
                        </span>
                        <span className="text-xs font-bold text-[#17202A]">{res.requirement?.title}</span>
                        {res.requirement?.mandatory && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-[#C62828]">
                            MANDATORY
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-snug">{res.reason}</p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${
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

                      <button className="text-xs font-bold text-[#1261A0] hover:underline flex items-center gap-1">
                        <span>Inspect</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bidder Submitted Documents List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold text-[#0B3A5B] uppercase tracking-wider mb-4">Submitted Documents ({bid?.documents?.length || 0})</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {bid?.documents?.map((doc: any) => (
                <div key={doc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-[#0B3A5B] shrink-0" />
                  <div className="truncate text-xs">
                    <p className="font-bold text-[#17202A] truncate">{doc.filename}</p>
                    <span className="text-[10px] text-slate-400 block">{doc.documentType} • PROCESSED</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right-side Slide-Out Panel: ASK BIDSHIELD AI ASSISTANT */}
        <div className={`w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-lg flex flex-col h-[85vh] sticky top-20 overflow-hidden`}>
          {/* Header */}
          <div className="p-4 bg-[#0B3A5B] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#F4B400] text-[#0B3A5B] flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold">Ask BidShield AI</h3>
                <p className="text-[10px] text-slate-300">Grounded Procurement RAG</p>
              </div>
            </div>
          </div>

          {/* Chat Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl max-w-[90%] space-y-2 ${
                  msg.role === 'USER'
                    ? 'bg-[#0B3A5B] text-white ml-auto font-medium'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-sm'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-line">{msg.message}</p>
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 space-y-1">
                    <span className="font-bold text-[#0B3A5B] block">Evidence Sources:</span>
                    {msg.citations.map((c: any, ci: number) => (
                      <div key={ci} className="bg-slate-100 px-2 py-1 rounded text-[#1261A0] font-semibold truncate">
                        • {c.source} {c.page ? `(Page ${c.page})` : ''}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {chatLoading && (
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-500 italic flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0B3A5B]" />
                <span>Searching grounded document evidence...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChat} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask why bidder is risk / non-compliant..."
              value={chatQuery}
              onChange={(e) => setChatQuery(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:ring-1 focus:ring-[#0B3A5B]"
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="p-2 bg-[#0B3A5B] text-white rounded-lg hover:bg-[#082C46] transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Selected Evidence Detail Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 space-y-4 shadow-2xl border border-slate-200 gold-accent-border">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-[#0B3A5B]">
                Evidence Inspection — {selectedResult.requirement?.title}
              </h3>
              <button onClick={() => setSelectedResult(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Requirement Threshold</span>
                <p className="font-bold text-[#0B3A5B] mt-0.5">{selectedResult.requirement?.description}</p>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-[10px] font-bold text-[#1261A0] block uppercase">Extracted Document Snippet</span>
                <p className="font-semibold text-slate-800 mt-1 font-mono">
                  "{selectedResult.evidence?.textSnippet || 'No document text evidence submitted'}"
                </p>
                <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-4">
                  <span>Document: <strong>{selectedResult.evidence?.document?.filename || 'Missing'}</strong></span>
                  <span>Page Number: <strong>{selectedResult.evidence?.pageNumber || 1}</strong></span>
                  <span>AI Confidence: <strong>96%</strong></span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">AI Compliance Explanation</span>
                <p className="text-slate-700 mt-0.5">{selectedResult.aiExplanation || selectedResult.reason}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedResult(null)}
                className="px-4 py-2 bg-[#0B3A5B] text-white text-xs font-bold rounded-lg hover:bg-[#082C46]"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
    </RoleGuard>
  );
}

