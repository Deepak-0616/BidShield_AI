'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { History, Search, Shield, User, Clock, FileText } from 'lucide-react';

export default function AuditTrailPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/audit-logs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLogs(data.logs);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-black text-[#0B3A5B] tracking-tight">System Audit Trail</h1>
          <p className="text-xs text-slate-500 mt-1">Complete immutable audit trail of all platform activities</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden gold-accent-border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                <th className="p-4">Timestamp</th>
                <th className="p-4">User</th>
                <th className="p-4">Action Performed</th>
                <th className="p-4">Entity Type</th>
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
                    <span className="text-[10px] text-slate-400">{log.user?.email || 'System Action'}</span>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded bg-blue-50 text-[#0B3A5B] font-bold text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 font-semibold">{log.entityType}</td>
                  <td className="p-4 font-mono text-[10px] text-slate-600 max-w-xs truncate">
                    {log.metadata || '{}'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
