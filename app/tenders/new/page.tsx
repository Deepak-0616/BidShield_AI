'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Upload, FileText, CheckCircle2, ArrowRight, Loader2, Sparkles, Shield } from 'lucide-react';

export default function CreateTenderPage() {
  const router = useRouter();
  const [title, setTitle] = useState('Enterprise Cloud & IT Infrastructure Modernization');
  const [tenderNumber, setTenderNumber] = useState('GEM-DEMO-2026-IT-002');
  const [estimatedValue, setEstimatedValue] = useState('250000000');
  const [category, setCategory] = useState('Software & IT Infrastructure');
  const [description, setDescription] = useState('Comprehensive cloud compute, database clusters and managed security for GeM procurement.');

  const [step, setStep] = useState(1); // 1 = Form, 2 = AI Extraction Pipeline, 3 = Complete
  const [pipelineProgress, setPipelineProgress] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const startExtractionPipeline = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    setLoading(true);

    const steps = [
      'Document Uploaded Successfully...',
      'Extracting Raw PDF Text & OCR Scanning...',
      'Discovering Mandatory Tender Eligibility Requirements...',
      'Classifying Categories (Legal, Financial, Experience, Local Content)...',
      'Generating Deterministic Compliance Rules & Thresholds...',
      'Tender Notice Analysis Ready!'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 600));
      setPipelineProgress((prev) => [...prev, steps[i]]);
    }

    try {
      const res = await fetch('/api/tenders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenderNumber,
          title,
          category,
          description,
          estimatedValue,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStep(3);
        setTimeout(() => {
          router.push(`/tenders/${data.tender.id}/requirements`);
        }, 1200);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-black text-[#0B3A5B] tracking-tight">Create Tender & Extract Requirements</h1>
          <p className="text-xs text-slate-500 mt-1">Upload GeM Tender document PDF for automated AI extraction</p>
        </div>

        {step === 1 && (
          <form onSubmit={startExtractionPipeline} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 gold-accent-border">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Tender Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:bg-white focus:ring-1 focus:ring-[#0B3A5B] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Tender Number</label>
                <input
                  type="text"
                  value={tenderNumber}
                  onChange={(e) => setTenderNumber(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:bg-white focus:ring-1 focus:ring-[#0B3A5B] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Estimated Value (INR)</label>
                <input
                  type="number"
                  value={estimatedValue}
                  onChange={(e) => setEstimatedValue(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:bg-white focus:ring-1 focus:ring-[#0B3A5B] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:bg-white focus:ring-1 focus:ring-[#0B3A5B] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Scope Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:bg-white focus:ring-1 focus:ring-[#0B3A5B] outline-none"
              ></textarea>
            </div>

            {/* Drag Drop File Upload Area */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Tender Notice PDF</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-white hover:border-[#0B3A5B] transition cursor-pointer">
                <Upload className="w-8 h-8 text-[#0B3A5B] mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">01_Tender_GeM_IT_Infrastructure.pdf</p>
                <p className="text-[10px] text-slate-400 mt-1">Synthetic GeM tender notice selected for demo</p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0B3A5B] text-white font-bold rounded-xl shadow-md hover:bg-[#082C46] transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              <Sparkles className="w-4 h-4 text-[#F4B400]" />
              <span>Run AI Requirement Extractor</span>
            </button>
          </form>
        )}

        {step >= 2 && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#0B3A5B]/10 text-[#0B3A5B] flex items-center justify-center mx-auto">
              {step === 2 ? <Loader2 className="w-8 h-8 animate-spin" /> : <CheckCircle2 className="w-8 h-8 text-[#138A4B]" />}
            </div>
            <h2 className="text-xl font-extrabold text-[#0B3A5B]">
              {step === 2 ? 'AI Processing Pipeline Active' : 'Requirements Extracted Successfully!'}
            </h2>

            <div className="max-w-md mx-auto space-y-3 text-left">
              {pipelineProgress.map((msg, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs font-medium text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-[#138A4B] shrink-0" />
                  <span>{msg}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
