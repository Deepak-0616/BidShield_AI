'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RoleGuard from '@/components/auth/RoleGuard';
import { Settings, Save, CheckCircle2, RefreshCw } from 'lucide-react';

export default function AdminRulesPage() {
  const [rules, setRules] = useState<any[]>([
    { category: 'LEGAL', weight: 1.0, mandatoryImpact: 30.0, desc: 'GST, PAN, Company Registration' },
    { category: 'FINANCIAL', weight: 1.0, mandatoryImpact: 30.0, desc: 'Annual Turnover & Audited Statements' },
    { category: 'TECHNICAL', weight: 1.0, mandatoryImpact: 30.0, desc: 'OEM Authorization & Tech Specs' },
    { category: 'EXPERIENCE', weight: 1.0, mandatoryImpact: 30.0, desc: 'Past Contract Years & Scope' },
    { category: 'LOCAL_CONTENT', weight: 1.0, mandatoryImpact: 30.0, desc: 'Make in India Class-I Threshold' },
    { category: 'CERTIFICATION', weight: 0.8, mandatoryImpact: 15.0, desc: 'ISO 9001:2015 & Quality Systems' },
    { category: 'DOCUMENTATION', weight: 0.8, mandatoryImpact: 15.0, desc: 'Udyam / MSME Certificate' },
  ]);

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/rules')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.rules?.length > 0) {
          setRules((prev) =>
            prev.map((pr) => {
              const matched = data.rules.find((dr: any) => dr.category === pr.category);
              if (matched) {
                return { ...pr, weight: matched.weight, mandatoryImpact: matched.mandatoryImpact };
              }
              return pr;
            })
          );
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rules }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <DashboardLayout>
        <div className="space-y-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl font-black text-[#0B3A5B] tracking-tight">Compliance Rule Engine Configuration</h1>
              <p className="text-xs text-slate-500 mt-1">Configure risk scoring weights, threshold impact & mandatory penalties</p>
            </div>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#0B3A5B] text-white text-xs font-bold rounded-lg shadow hover:bg-[#082C46] flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-[#F4B400]" />
              <span>Save Configuration</span>
            </button>
          </div>

          {saved && (
            <div className="p-3 bg-green-50 border border-green-200 text-[#138A4B] text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Rule weights updated successfully in database!</span>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden gold-accent-border">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                  <th className="p-4">Requirement Category</th>
                  <th className="p-4">Category Description</th>
                  <th className="p-4">Risk Weight (0.1 - 2.0)</th>
                  <th className="p-4">Missing Penalty (% Risk)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {rules.map((r, i) => (
                  <tr key={r.category} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-bold text-[#0B3A5B]">{r.category}</td>
                    <td className="p-4 text-slate-600">{r.desc}</td>
                    <td className="p-4">
                      <input
                        type="number"
                        step="0.1"
                        value={r.weight}
                        onChange={(e) => {
                          const updated = [...rules];
                          updated[i].weight = parseFloat(e.target.value);
                          setRules(updated);
                        }}
                        className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded font-bold outline-none"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        value={r.mandatoryImpact}
                        onChange={(e) => {
                          const updated = [...rules];
                          updated[i].mandatoryImpact = parseFloat(e.target.value);
                          setRules(updated);
                        }}
                        className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded font-bold outline-none"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}

