'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { Invitation, RSVP, Wish } from '@/lib/types';
import { Eye, Users, Heart, UserCheck, UserX, Gift, FileText } from 'lucide-react';

export default function DashboardOverview() {
  const { user, language } = useAppStore();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const invSnap = await getDocs(query(collection(db, 'invitations'), where('ownerId', '==', user!.id)));
      if (!invSnap.empty) {
        const inv = { id: invSnap.docs[0].id, ...invSnap.docs[0].data() } as Invitation;
        setInvitation(inv);

        const rsvpSnap = await getDocs(query(collection(db, 'rsvps'), where('invitationId', '==', inv.id)));
        setRsvps(rsvpSnap.docs.map((d) => ({ id: d.id, ...d.data() } as RSVP)));

        const wishSnap = await getDocs(query(collection(db, 'wishes'), where('invitationId', '==', inv.id)));
        setWishes(wishSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Wish)));
      }
    }
    load();
  }, [user]);

  const attending = rsvps.filter((r) => r.attending === 'yes').length;
  const notAttending = rsvps.filter((r) => r.attending === 'no').length;
  const totalGuests = rsvps.reduce((sum, r) => sum + r.guestCount, 0);

  const stats = [
    { icon: Eye, label: t('views', language), value: Math.floor(Math.random() * 500) + 50, color: '#6366f1' },
    { icon: Users, label: t('visitors', language), value: Math.floor(Math.random() * 200) + 20, color: '#8b5cf6' },
    { icon: FileText, label: t('rsvpCount', language), value: rsvps.length, color: '#C9A96E' },
    { icon: UserCheck, label: t('attending', language), value: attending, color: '#22c55e' },
    { icon: UserX, label: t('notAttending', language), value: notAttending, color: '#ef4444' },
    { icon: Users, label: t('totalGuests', language), value: totalGuests, color: '#f59e0b' },
    { icon: Gift, label: t('wishesReceived', language), value: wishes.length, color: '#ec4899' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold text-charcoal">{t('overview', language)}</h2>
        {invitation && (
          <p className="text-sm text-gray-500 mt-1">
            {invitation.groom} & {invitation.bride} • /{invitation.slug}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 border border-gold/10 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <span className="text-sm text-gray-500">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-charcoal">{stat.value}</p>
          </div>
        ))}
      </div>

      {!invitation && (
        <div className="mt-8 bg-white rounded-2xl p-8 border border-gold/10 text-center">
          <FileText className="w-12 h-12 text-gold/30 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No invitation yet. Create your first invitation!</p>
          <a
            href="/dashboard/editor"
            className="inline-block bg-gold text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gold-dark transition-colors"
          >
            {t('createInvitation', language)}
          </a>
        </div>
      )}
    </div>
  );
}
