'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Users, Trash2, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { wedding } from '@/lib/wedding-config';

interface EventRSVP {
  id: string;
  guestName: string;
  guestCount: number;
  attending: 'yes' | 'no';
  createdAt: string;
}

export default function RSVPAdminPage() {
  const [rsvps, setRsvps] = useState<EventRSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');

  const checkPassword = () => {
    if (password === 'christian2027') {
      setAuthed(true);
    } else {
      alert('Wrong password');
    }
  };

  const loadRsvps = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, 'event_rsvps'), orderBy('createdAt', 'desc')));
      setRsvps(snap.docs.map((d) => ({ id: d.id, ...d.data() } as EventRSVP)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) loadRsvps();
  }, [authed]);

  const removeRsvp = async (id: string) => {
    await deleteDoc(doc(db, 'event_rsvps', id));
    setRsvps((prev) => prev.filter((r) => r.id !== id));
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: wedding.colors.bg }}>
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gold/10 w-96">
          <h1 className="text-xl font-serif font-bold text-center mb-6" style={{ color: wedding.colors.dark }}>
            RSVP Dashboard
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && checkPassword()}
            placeholder="Enter password"
            className="w-full px-4 py-3 rounded-xl border border-gold/20 text-sm focus:border-gold outline-none mb-4"
          />
          <button
            onClick={checkPassword}
            className="w-full text-white py-3 rounded-xl font-medium"
            style={{ backgroundColor: wedding.colors.primary }}
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  const attending = rsvps.filter((r) => r.attending === 'yes');
  const notAttending = rsvps.filter((r) => r.attending === 'no');
  const totalGuests = attending.reduce((sum, r) => sum + r.guestCount, 0);

  return (
    <div className="min-h-screen" style={{ background: wedding.colors.bg }}>
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-serif font-bold" style={{ color: wedding.colors.dark }}>
            RSVP Dashboard
          </h1>
          <button
            onClick={loadRsvps}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gold/20 hover:bg-gold/5"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gold/10">
            <p className="text-xs text-gray-400 mb-1">Total Responses</p>
            <p className="text-3xl font-bold" style={{ color: wedding.colors.primary }}>{rsvps.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gold/10">
            <p className="text-xs text-gray-400 mb-1">Attending</p>
            <p className="text-3xl font-bold text-green-600">{attending.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gold/10">
            <p className="text-xs text-gray-400 mb-1">Not Attending</p>
            <p className="text-3xl font-bold text-red-500">{notAttending.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gold/10">
            <p className="text-xs text-gray-400 mb-1">Total Guests</p>
            <p className="text-3xl font-bold text-charcoal">{totalGuests}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
          </div>
        ) : rsvps.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gold/10 text-center">
            <Users className="w-12 h-12 text-gold/30 mx-auto mb-3" />
            <p className="text-gray-400">No RSVPs yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rsvps.map((r) => (
              <div
                key={r.id}
                className={`flex items-center gap-3 p-4 rounded-2xl border ${
                  r.attending === 'yes'
                    ? 'bg-green-50 border-green-100'
                    : 'bg-red-50 border-red-100'
                }`}
              >
                {r.attending === 'yes' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-charcoal">{r.guestName}</p>
                  <p className="text-xs text-gray-400">
                    {r.attending === 'yes' ? `${r.guestCount} guest(s)` : 'Cannot attend'} •{' '}
                    {new Date(r.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    r.attending === 'yes'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-500'
                  }`}
                >
                  {r.attending === 'yes' ? 'Attending' : 'No'}
                </span>
                <button
                  onClick={() => removeRsvp(r.id)}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
