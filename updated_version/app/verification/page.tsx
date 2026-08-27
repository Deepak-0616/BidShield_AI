'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Link2, CheckCircle2, ShieldCheck, RefreshCw, Send, AlertCircle } from 'lucide-react';

export default function VerificationCenterPage() {
  const [provider, setProvider] = useState('GST');
  const [inputValue, setInputValue] = useState('27AAACN1234Q1Z5');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const adapters = [
    { name: 'GST Portal API', code: 'GST', status: 'CONNECTED — DEMO', badge: 'DEMO', color: '#138A4B' },
    { name: 'Income Tax PAN Service', code: 'PAN', status: 'CONNECTED — DEMO', badge: 'DEMO', color: '#138A4B' },
    { name: 'MSME Udyam Portal', code: 'UDYAM', status: 'CONNECTED — DEMO', badge: 'DEMO', color: '#138A4B' },
    { name: 'MCA Corporate Registry', code: 'MCA', status: 'SIMULATED ADAPTER', badge: 'SIMULATED', color: '#D98200' },
    { name: 'OEM Partner Database', code: 'OEM', status: 'SIMULATED ADAPTER', badge: 'SIMULATED', color: '#D98200' },
    { name: 'DigiLocker Verification', code: 'DIGILOCKER', status: 'SIMULATED ADAPTER', badge: 'SIMULATED', color: '#D98200' },
  ];

  const handleRunVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch(`/api/verification/${provider.toLowerCase()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gstin: inputValue, pan: inputValue, legalName: 'NovaTech Systems Private Limited' }),
      });
      const data = await res.json();
      if (data.success) {
        setResponse(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-black text-[#0B3A5B] tracking-tight">Government Verification Center</h1>
          <p className="text-xs text-slate-500 mt-1">Simulated government adapters & API verification interfaces</p>
        </div>

        {/* Disclaimer Alert */}
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[#D98200] shrink-0" />
          <span>
            <strong>DEMO / SIMULATED ENVIRONMENT:</strong> Connectors simulate government API responses for hackathon demonstration. Production deployment supports direct API integration with GSTN, Income Tax, and MCA gateways.
          </span>
        </div>

        {/* Adapters Status Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {adapters.map((ad) => (
            <div key={ad.code} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#0B3A5B]">{ad.name}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-[#D98200] text-[9px] font-black">{ad.badge}</span>
                </div>
                <p className="text-[11px] text-slate-500">Adapter Interface: {ad.code}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-[#138A4B] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {ad.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Adapter Testing Console */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm gold-accent-border space-y-6">
          <h2 className="text-base font-bold text-[#0B3A5B]">Test Verification Adapter Query</h2>

          <form onSubmit={handleRunVerification} className="grid md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Select Adapter</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
              >
                <option value="GST">GST Verification (GSTIN)</option>
                <option value="PAN">PAN Verification</option>
                <option value="UDYAM">Udyam MSME Verification</option>
                <option value="MCA">MCA Company Registry</option>
                <option value="OEM">OEM Authorization Registry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Registration Reference Number</label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-semibold text-slate-800 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="py-2.5 bg-[#0B3A5B] text-white text-xs font-bold rounded-lg hover:bg-[#082C46] transition shadow flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Execute Adapter Verification</span>
            </button>
          </form>

          {response && (
            <div className="bg-slate-900 text-green-400 p-4 rounded-xl text-xs font-mono overflow-x-auto shadow-inner">
              <span className="text-slate-400 block mb-2">// Response payload returned by {response.provider}:</span>
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
