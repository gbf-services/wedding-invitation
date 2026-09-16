'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { Invitation, User } from '@/lib/types';
import { Users, FileText, Eye, TrendingUp } from 'lucide-react';

export default function SuperAdminOverview() {
  const { language } = useAppStore();
  const [users, setUsers] = useState<User[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  useEffect(() => {
    async function load() {
      const [userSnap, invSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'invitations')),
      ]);
      setUsers(userSnap.docs.map((d) => ({ id: d.id, ...d.data() } as User)));
      setInvitations(invSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Invitation)));
    }
    load();
  }, []);

  const published = invitations.filter((i) => i.status === 'published').length;
  const premiumUsers = users.filter((u) => u.role === 'admin' || u.role === 'superadmin').length;

  const stats = [
    { icon: Users, label: t('allUsers', language), value: users.length, color: '#6366f1' },
    { icon: FileText, label: t('allInvitations', language), value: invitations.length, color: '#C9A96E' },
    { icon: Eye, label: 'Published', value: published, color: '#22c55e' },
    { icon: TrendingUp, label: 'Premium Users', value: premiumUsers, color: '#f59e0b' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">{t('platformStats', language)}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gold/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <span className="text-sm text-gray-500">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-charcoal">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-gold/10">
          <h3 className="font-semibold text-charcoal mb-4">Recent Invitations</h3>
          <div className="space-y-2">
            {invitations.slice(0, 5).map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 text-sm">
                <div>
                  <p className="font-medium text-charcoal">{inv.groom} & {inv.bride}</p>
                  <p className="text-xs text-gray-400">/{inv.slug}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${inv.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                  {inv.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gold/10">
          <h3 className="font-semibold text-charcoal mb-4">Recent Users</h3>
          <div className="space-y-2">
            {users.slice(0, 5).map((u) => (
              <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 text-sm">
                <div>
                  <p className="font-medium text-charcoal">{u.name || 'Unnamed'}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-gold/10 text-gold capitalize">{u.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
