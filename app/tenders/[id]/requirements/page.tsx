'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { FileText, CheckCircle2, ShieldAlert, Sparkles, Plus, Edit2, Shield, ArrowRight } from 'lucide-react';

export default function TenderRequirementsPage() {
  const params = useParams();
  const tenderId = params?.id as string;

  const [tender, setTender] = useState<any>(null);
  const [requirements, setRequirements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenderId) return;
    fetch(`/api/tenders/${tenderId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setTender(json.tender);
          setRequirements(json.tender.requirements || []);
        }
      })
      .finally(() => setLoading(false));
  }, [tenderId]);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-blue-100 text-[#0B3A5B] font-bold text-[10px]">
                {tender?.tenderNumber || 'GEM-DEMO-2026-IT-001'}
              </span>
              <span className="text-xs text-slate-500 font-medium">8 AI-Extracted Rules</span>
            </div>
            <h1 className="text-2xl font-black text-[#0B3A5B] tracking-tight">{tender?.title || 'Tender Requirements'}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1 rounded bg-[#138A4B]/10 text-[#138A4B] border border-[#138A4B]/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Extractor Verified
            </span>
          </div>
        </div>

        {/* Requirements Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {requirements.map((req) => (
            <div key={req.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#0B3A5B] text-white text-xs font-bold rounded">
                      {req.requirementCode}
                    </span>
                    <span className="text-xs font-extrabold text-[#0B3A5B]">{req.title}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      req.mandatory
                        ? 'bg-red-50 text-[#C62828] border border-red-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {req.mandatory ? 'MANDATORY' : 'OPTIONAL'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-4 leading-relaxed">{req.description}</p>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                  <div>
                    <span className="text-slate-400 block text-[10px]">CATEGORY</span>
                    <span className="font-bold text-[#1261A0]">{req.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">RULE THRESHOLD</span>
                    <span className="font-bold text-slate-800">{req.threshold || 'N/A'} {req.thresholdUnit || ''}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">SOURCE CITATION</span>
                    <span className="text-slate-700">{req.sourceSection || `Page ${req.sourcePage}`}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">AI CONFIDENCE</span>
                    <span className="font-bold text-[#138A4B]">{(req.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Rule: <strong className="text-slate-700">{req.ruleType}</strong></span>
                <button className="text-[#1261A0] font-bold hover:underline flex items-center gap-1">
                  <Edit2 className="w-3 h-3" /> Edit Rule
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
