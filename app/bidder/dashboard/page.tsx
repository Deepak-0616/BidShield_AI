'use client';

import React, { useEffect, useRef, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RoleGuard from '@/components/auth/RoleGuard';
import { Upload, CheckCircle2, XCircle, AlertCircle, FileText, Send, Sparkles, RefreshCw, Check } from 'lucide-react';

export default function BidderDashboardPage() {
  const [activeBid, setActiveBid] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const [submittedDocs, setSubmittedDocs] = useState({
    gst: true,
    pan: true,
    financial: true,
    experience: true,
    oem: false,
    iso: true,
    localContent: true,
    udyam: true,
  });

  const [preCheck, setPreCheck] = useState<any>({
    complianceScore: 68.5,
    riskLevel: 'MEDIUM',
    missingMandatory: ['OEM Authorization Letter'],
    failingThresholds: ['Local Content Declaration (42% vs 50%)', 'Experience Certificate (3 Yrs vs 5 Yrs)'],
    passedItems: ['GST Registration', 'PAN Registration', 'Financial Turnover (₹12.37 Cr)', 'ISO 9001:2015', 'MSME Udyam'],
  });

  const fetchActiveBid = async () => {
    try {
      const res = await fetch('/api/bids');
      const data = await res.json();
      if (data.success && data.bids?.length > 0) {
        const bid = data.bids[0];
        setActiveBid(bid);

        if (bid.complianceScore) {
          setPreCheck((prev: any) => ({
            ...prev,
            complianceScore: bid.complianceScore,
            riskLevel: bid.riskLevel,
          }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveBid();
  }, []);

  const handleFileUpload = async (key: string, docType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingKey(key);
    setUploadSuccessMsg('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', docType);
      if (activeBid?.id) {
        formData.append('bidId', activeBid.id);
      }

      const res = await fetch('/api/bidder/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedDocs((prev) => ({ ...prev, [key]: true }));
        setUploadSuccessMsg(`Successfully uploaded ${file.name}! AI Re-Evaluation: Score ${data.complianceScore}%, Risk ${data.riskLevel}.`);
        setPreCheck((prev: any) => ({
          ...prev,
          complianceScore: data.complianceScore,
          riskLevel: data.riskLevel,
          missingMandatory: prev.missingMandatory.filter((m: string) => !m.toLowerCase().includes(key.toLowerCase())),
        }));
        fetchActiveBid();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingKey(null);
    }
  };

  const triggerFileInput = (key: string) => {
    fileInputRefs.current[key]?.click();
  };

  const checklistItems = [
    { key: 'gst', docType: 'GST_CERTIFICATE', label: 'GST Registration Certificate', req: 'R1 Mandatory' },
    { key: 'pan', docType: 'PAN', label: 'Income Tax PAN Card', req: 'R2 Mandatory' },
    { key: 'financial', docType: 'FINANCIAL_STATEMENT', label: 'Audited Financial Turnover Statement', req: 'R3 Mandatory' },
    { key: 'experience', docType: 'EXPERIENCE_CERTIFICATE', label: 'Work Experience Certificate', req: 'R4 Mandatory' },
    { key: 'oem', docType: 'OEM_AUTHORIZATION', label: 'OEM Authorization Letter', req: 'R5 Mandatory' },
    { key: 'iso', docType: 'ISO_CERTIFICATE', label: 'ISO 9001:2015 Quality Certificate', req: 'R6 Optional' },
    { key: 'localContent', docType: 'LOCAL_CONTENT_DECLARATION', label: 'Make in India Local Content Declaration', req: 'R7 Mandatory' },
    { key: 'udyam', docType: 'UDYAM', label: 'Udyam MSME Registration', req: 'R8 Optional' },
  ];

  return (
    <RoleGuard allowedRoles={['BIDDER', 'ADMIN']}>
      <DashboardLayout userRole="BIDDER" department="Bidder Portal">
        <div className="space-y-6 max-w-6xl mx-auto">
          <div className="border-b border-slate-200 pb-4">
            <h1 className="text-2xl font-black text-[#0B3A5B] tracking-tight">Bidder Self-Service Portal</h1>
            <p className="text-xs text-slate-500 mt-1">Upload tender eligibility documents & run pre-submission compliance check</p>
          </div>

          {uploadSuccessMsg && (
            <div className="p-4 bg-green-50 border border-green-200 text-[#138A4B] text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm">
              <Check className="w-5 h-5 shrink-0" />
              <span>{uploadSuccessMsg}</span>
            </div>
          )}

          {/* Active Bid Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm gold-accent-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-4">
              <div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-blue-100 text-[#0B3A5B]">
                  {activeBid?.tender?.tenderNumber || 'GEM-DEMO-2026-IT-001'}
                </span>
                <h2 className="text-lg font-extrabold text-[#0B3A5B] mt-1">
                  {activeBid?.bidderName || 'NovaTech Systems Private Limited'}
                </h2>
                <p className="text-xs text-slate-500">
                  {activeBid?.tender?.title || 'Enterprise Cloud & IT Infrastructure Modernization Tender'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500 block">AI Pre-Check Score</span>
                  <span className="text-xl font-black text-[#0B3A5B]">{preCheck.complianceScore}%</span>
                </div>
                <button
                  onClick={fetchActiveBid}
                  className="px-4 py-2 bg-[#0B3A5B] text-white text-xs font-bold rounded-lg shadow hover:bg-[#082C46] transition flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#F4B400]" />
                  <span>Run Pre-Submission Check</span>
                </button>
              </div>
            </div>

            {/* Document Upload Checklist */}
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Mandatory Document Checklist</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {checklistItems.map((doc) => {
                const isUploaded = (submittedDocs as any)[doc.key];
                const isUploading = uploadingKey === doc.key;

                return (
                  <div key={doc.key} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <input
                      type="file"
                      accept=".pdf"
                      ref={(el) => {
                        fileInputRefs.current[doc.key] = el;
                      }}
                      onChange={(e) => handleFileUpload(doc.key, doc.docType, e)}
                      className="hidden"
                    />

                    <div className="flex items-center gap-3">
                      {isUploaded ? <CheckCircle2 className="w-5 h-5 text-[#138A4B]" /> : <XCircle className="w-5 h-5 text-[#C62828]" />}
                      <div>
                        <p className="text-xs font-bold text-slate-800">{doc.label}</p>
                        <span className="text-[10px] text-slate-400">{doc.req}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => triggerFileInput(doc.key)}
                      disabled={isUploading}
                      className="px-3.5 py-1.5 bg-white border border-slate-300 text-xs font-bold text-[#0B3A5B] rounded-lg hover:bg-slate-100 transition shadow-sm flex items-center gap-1.5"
                    >
                      {isUploading ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5 text-[#1261A0]" />
                      )}
                      <span>{isUploading ? 'Analyzing...' : isUploaded ? 'Replace PDF' : 'Upload PDF'}</span>
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
                <p className="font-bold text-sm">Estimated Compliance Score: {preCheck.complianceScore}% ({preCheck.riskLevel} RISK)</p>
                {preCheck.missingMandatory?.length > 0 && (
                  <p><strong>Missing Mandatory Document:</strong> {preCheck.missingMandatory.join(', ')}</p>
                )}
                <p><strong>Failing Thresholds:</strong> {preCheck.failingThresholds.join(' • ')}</p>
                <p><strong>Verified Compliant Criteria:</strong> {preCheck.passedItems.join(' • ')}</p>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}
