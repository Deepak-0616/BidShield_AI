'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Upload, CheckCircle2, XCircle, AlertCircle, FileText, Send, Sparkles } from 'lucide-react';

export default function BidderDashboardPage() {
  const [submittedDocs, setSubmittedDocs] = useState({
    gst: true,
    pan: true,
    financial: true,
    experience: true,
    oem: false, // missing OEM
    iso: true,
    localContent: true,
    udyam: true,
  });

  const [preCheck, setPreCheck] = useState<any>(null);

  const runPreSubmissionCheck = () => {
    setPreCheck({
      complianceScore: 68.5,
      missingMandatory: ['OEM Authorization Letter'],
      failingThresholds: ['Local Content Declaration (42% vs 50%)', 'Experience Certificate (3 Yrs vs 5 Yrs)'],
      passedItems: ['GST Registration', 'PAN Registration', 'Financial Turnover (₹12.37 Cr)', 'ISO 9001:2015', 'MSME Udyam'],
    });
  };

  return (
    <DashboardLayout userRole="BIDDER" userName="Suresh Kumar (NovaTech)" department="Bidder Portal">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-black text-[#0B3A5B] tracking-tight">Bidder Self-Service Portal</h1>
          <p className="text-xs text-slate-500 mt-1">Upload tender eligibility documents & run pre-submission compliance check</p>
        </div>

        {/* Active Bid Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm gold-accent-border">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#0B3A5B]">GEM-DEMO-2026-IT-001</span>
              <h2 className="text-lg font-extrabold text-[#0B3A5B] mt-1">NovaTech Systems Private Limited</h2>
              <p className="text-xs text-slate-500">Enterprise Cloud & IT Infrastructure Modernization Tender</p>
            </div>
            <button
              onClick={runPreSubmissionCheck}
              className="px-4 py-2 bg-[#0B3A5B] text-white text-xs font-bold rounded-lg shadow hover:bg-[#082C46] transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#F4B400]" />
              <span>Run Pre-Submission Check</span>
            </button>
          </div>

          {/* Document Upload Checklist */}
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Mandatory Document Checklist</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { key: 'gst', label: 'GST Registration Certificate', req: 'R1 Mandatory' },
              { key: 'pan', label: 'Income Tax PAN Card', req: 'R2 Mandatory' },
              { key: 'financial', label: 'Audited Financial Turnover Statement', req: 'R3 Mandatory' },
              { key: 'experience', label: 'Work Experience Certificate', req: 'R4 Mandatory' },
              { key: 'oem', label: 'OEM Authorization Letter', req: 'R5 Mandatory' },
              { key: 'iso', label: 'ISO 9001:2015 Quality Certificate', req: 'R6 Optional' },
              { key: 'localContent', label: 'Make in India Local Content Declaration', req: 'R7 Mandatory' },
              { key: 'udyam', label: 'Udyam MSME Registration', req: 'R8 Optional' },
            ].map((doc) => {
              const isUploaded = (submittedDocs as any)[doc.key];
              return (
                <div key={doc.key} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isUploaded ? <CheckCircle2 className="w-5 h-5 text-[#138A4B]" /> : <XCircle className="w-5 h-5 text-[#C62828]" />}
                    <div>
                      <p className="text-xs font-bold text-slate-800">{doc.label}</p>
                      <span className="text-[10px] text-slate-400">{doc.req}</span>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-white border border-slate-300 text-xs font-bold text-[#0B3A5B] rounded hover:bg-slate-100 transition">
                    {isUploaded ? 'Replace' : 'Upload PDF'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pre Check Results */}
        {preCheck && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#0B3A5B] uppercase tracking-wider">Pre-Submission AI Evaluation Result</h3>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-2 text-amber-900">
              <p className="font-bold text-sm">Estimated Compliance Score: {preCheck.complianceScore}%</p>
              <p><strong>Missing Mandatory Document:</strong> {preCheck.missingMandatory.join(', ')}</p>
              <p><strong>Failing Thresholds:</strong> {preCheck.failingThresholds.join(' • ')}</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
