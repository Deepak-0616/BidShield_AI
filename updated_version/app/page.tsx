'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  ArrowRight,
  CheckCircle2,
  Search,
  AlertTriangle,
  Bot,
  UserCheck,
  FileText,
  ShieldAlert,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#17202A]">
      {/* Top Banner */}
      <div className="bg-[#0B3A5B] text-white text-xs py-2 px-6 flex items-center justify-between border-b border-[#1261A0]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#F4B400]">SIH26100</span>
          <span>• Smart Automation for Procurement Compliance • Ministry of Petroleum & Natural Gas</span>
        </div>
        <div className="flex items-center gap-4 text-slate-300">
          <span>GeM Integrated Verification</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0B3A5B] text-white flex items-center justify-center font-extrabold shadow">
            <Shield className="w-6 h-6 text-[#F4B400]" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#0B3A5B] leading-none">BidShield AI</h1>
            <p className="text-xs text-slate-500 font-medium">Procurement Risk Intelligence Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-lg bg-[#0B3A5B] text-white font-bold text-sm shadow-md hover:bg-[#082C46] transition flex items-center gap-2"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-enterprise-gradient text-white py-20 px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#F4B400] text-xs font-semibold mb-6 border border-white/20">
            <Shield className="w-4 h-4" />
            <span>SIH26100 Official Solution Prototype</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-6">
            Verify Faster. Decide Smarter.<br />
            <span className="text-[#F4B400]">Procure with Confidence.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-200 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            AI-powered procurement compliance and risk-intelligence platform designed to perform instant first-level verification of GeM tender bids with deterministic accuracy and evidence-grounded explainability.
          </p>

          {/* 4 Dedicated Large Rectangular Role Login Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Link
              href="/login?role=officer"
              className="p-6 rounded-xl bg-[#F4B400] text-[#0B3A5B] font-extrabold text-base shadow-xl hover:bg-[#e0a500] hover:scale-105 transition-all duration-200 flex flex-col items-center justify-center gap-3 border border-white/20"
            >
              <UserCheck className="w-8 h-8 shrink-0" />
              <span className="tracking-wide">Officer Login</span>
            </Link>

            <Link
              href="/login?role=bidder"
              className="p-6 rounded-xl bg-[#138A4B] text-white font-extrabold text-base shadow-xl hover:bg-[#0f6f3c] hover:scale-105 transition-all duration-200 flex flex-col items-center justify-center gap-3 border border-white/20"
            >
              <FileText className="w-8 h-8 shrink-0" />
              <span className="tracking-wide">Bidder Login</span>
            </Link>

            <Link
              href="/login?role=admin"
              className="p-6 rounded-xl bg-[#D98200] text-white font-extrabold text-base shadow-xl hover:bg-[#b56d00] hover:scale-105 transition-all duration-200 flex flex-col items-center justify-center gap-3 border border-white/20"
            >
              <ShieldAlert className="w-8 h-8 shrink-0" />
              <span className="tracking-wide">Admin Login</span>
            </Link>

            <Link
              href="/login?role=audit"
              className="p-6 rounded-xl bg-[#C62828] text-white font-extrabold text-base shadow-xl hover:bg-[#a32020] hover:scale-105 transition-all duration-200 flex flex-col items-center justify-center gap-3 border border-white/20"
            >
              <CheckCircle2 className="w-8 h-8 shrink-0" />
              <span className="tracking-wide">Audit Login</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Principle Banner */}
      <section className="bg-[#1261A0] text-white py-4 px-6 text-center text-sm font-semibold border-t border-b border-white/10">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          <span className="bg-[#F4B400] text-[#0B3A5B] font-extrabold px-2.5 py-0.5 rounded text-xs">PRINCIPLE</span>
          <span>AI recommends. Rules validate. Humans decide. — Decision-Support System for Government Officers</span>
        </div>
      </section>

      {/* Execution Pipeline Workflow */}
      <section className="py-16 px-8 max-w-6xl mx-auto border-t border-slate-200">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B3A5B]">Platform Execution Pipeline</h2>
          <p className="text-slate-600 text-sm mt-2">End-to-end automated compliance process flow</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { step: '01', title: 'UPLOAD', desc: 'Tender & Bid PDFs' },
            { step: '02', title: 'UNDERSTAND', desc: '8 Extracted Reqs' },
            { step: '03', title: 'MATCH', desc: 'Document Evidence' },
            { step: '04', title: 'VERIFY', desc: 'Govt Adapter Checks' },
            { step: '05', title: 'DETECT', desc: 'Contradictions' },
            { step: '06', title: 'SCORE', desc: 'Compliance & Risk' },
            { step: '07', title: 'EXPLAIN', desc: 'Ask BidShield AI' },
            { step: '08', title: 'REPORT', desc: 'Downloadable PDF' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm hover:shadow-md transition">
              <span className="text-xs font-black text-[#F4B400] block mb-1">{item.step}</span>
              <h3 className="text-xs font-extrabold text-[#0B3A5B] mb-1">{item.title}</h3>
              <p className="text-[10px] text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-12 px-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm gold-accent-border">
            <div className="w-12 h-12 rounded-xl bg-[#0B3A5B]/10 text-[#0B3A5B] flex items-center justify-center mb-6">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0B3A5B] mb-3">Deterministic Compliance Engine</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Rules validate eligibility metrics like turnover thresholds, project experience years, and Make in India local content declarations without relying on probabilistic guesswork.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm gold-accent-border">
            <div className="w-12 h-12 rounded-xl bg-[#0B3A5B]/10 text-[#0B3A5B] flex items-center justify-center mb-6">
              <AlertTriangle className="w-6 h-6 text-[#D98200]" />
            </div>
            <h3 className="text-lg font-bold text-[#0B3A5B] mb-3">Contradiction & Inconsistency Detection</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Cross-evaluates corporate establishment profiles against experience project timelines and certificate issuance dates to highlight potential anomalies.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm gold-accent-border">
            <div className="w-12 h-12 rounded-xl bg-[#0B3A5B]/10 text-[#0B3A5B] flex items-center justify-center mb-6">
              <Bot className="w-6 h-6 text-[#1261A0]" />
            </div>
            <h3 className="text-lg font-bold text-[#0B3A5B] mb-3">Ask BidShield AI Procurement Assistant</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Grounded RAG chatbot answers officer queries with exact document page and requirement section citations. Zero hallucinations guaranteed.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B3A5B] text-white py-8 px-8 border-t border-[#1261A0]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#F4B400]" />
            <span className="font-bold text-white">BidShield AI</span>
            <span>• Ministry of Petroleum & Natural Gas Prototype</span>
          </div>
          <div>Verify Faster. Decide Smarter. Procure with Confidence.</div>
        </div>
      </footer>
    </div>
  );
}
