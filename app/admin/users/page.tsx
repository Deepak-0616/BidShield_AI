'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RoleGuard from '@/components/auth/RoleGuard';
import { Users, UserPlus, Shield, CheckCircle2, RefreshCw } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.users);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/realtime');
      eventSource.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data);
          if (event.type === 'USER_REGISTERED') {
            fetchUsers();
          }
        } catch {}
      };
    } catch {}

    const poll = setInterval(() => fetchUsers(), 5000);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(poll);
    };
  }, []);

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <DashboardLayout>
        <div className="space-y-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl font-black text-[#0B3A5B] tracking-tight">Admin User Management</h1>
              <p className="text-xs text-slate-500 mt-1">Manage user accounts, roles & department permissions</p>
            </div>
            <button className="px-4 py-2 bg-[#0B3A5B] text-white text-xs font-bold rounded-lg shadow hover:bg-[#082C46] flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              <span>Add System User</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden gold-accent-border">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                  <th className="p-4">User Name & Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Designation</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="p-4">
                      <span className="font-bold text-[#0B3A5B] block">{u.name}</span>
                      <span className="text-[10px] text-slate-400">{u.email}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded bg-blue-100 text-[#0B3A5B] font-bold text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{u.designation}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-green-100 text-[#138A4B] font-bold text-[10px]">
                        ACTIVE
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-xs font-bold text-[#1261A0] hover:underline">Edit Role</button>
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

