'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { RSVP, Wish, Guest } from '@/lib/types';
import { Users, UserPlus, Trash2, Copy, Check, Edit3, Save, X, Hash } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GuestsPage() {
  const { user, language } = useAppStore();
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [invitationId, setInvitationId] = useState('');
  const [slug, setSlug] = useState('');
  const [guestName, setGuestName] = useState('');
  const [maxGuestsInput, setMaxGuestsInput] = useState(3);
  const [copied, setCopied] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMaxGuests, setEditMaxGuests] = useState(3);
  const [totalGuestsCount, setTotalGuestsCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const invSnap = await getDocs(query(collection(db, 'invitations'), where('ownerId', '==', user!.id)));
      if (!invSnap.empty) {
        const inv = invSnap.docs[0];
        const invData = inv.data();
        const invSlug = invData.slug || inv.id;
        setInvitationId(inv.id);
        setSlug(invSlug);

        const [rsvpSnap, wishSnap, guestSnap] = await Promise.all([
          getDocs(query(collection(db, 'rsvps'), where('invitationId', '==', inv.id))),
          getDocs(query(collection(db, 'wishes'), where('invitationId', '==', inv.id))),
          getDocs(query(collection(db, 'guests'), where('invitationId', '==', inv.id))),
        ]);
        const rsvpData = rsvpSnap.docs.map((d) => ({ id: d.id, ...d.data() } as RSVP));
        setRsvps(rsvpData);
        setWishes(wishSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Wish)));
        setGuests(guestSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Guest)));

        const total = rsvpData.filter(r => r.attending === 'yes').reduce((sum, r) => sum + r.guestCount, 0);
        setTotalGuestsCount(total);
      }
    }
    load();
  }, [user]);

  const addGuest = async () => {
    if (!guestName.trim() || !invitationId) return;
    try {
      const docRef = await addDoc(collection(db, 'guests'), {
        invitationId,
        name: guestName.trim(),
        maxGuests: maxGuestsInput,
      });
      setGuests((prev) => [...prev, { 
        id: docRef.id, 
        invitationId, 
        name: guestName.trim(), 
        maxGuests: maxGuestsInput,
        personalizedSlug: guestName.trim().toLowerCase().replace(/\s+/g, '-'),
      }]);
      setGuestName('');
      setMaxGuestsInput(3);
      toast.success('Guest added');
    } catch {
      toast.error('Failed to add guest');
    }
  };

  const removeGuest = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'guests', id));
      setGuests((prev) => prev.filter((g) => g.id !== id));
      toast.success('Guest removed');
    } catch {
      toast.error('Failed to remove guest');
    }
  };

  const updateGuestMax = async (id: string, newMax: number) => {
    try {
      await updateDoc(doc(db, 'guests', id), { maxGuests: newMax });
      setGuests((prev) => prev.map(g => g.id === id ? { ...g, maxGuests: newMax } : g));
      setEditingId(null);
      toast.success('Updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  const copyLink = (name: string) => {
    const url = `${window.location.origin}/invitation/${slug}?guest=${encodeURIComponent(name)}`;
    navigator.clipboard.writeText(url);
    setCopied(name);
    toast.success('Link copied!');
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAllLinks = async () => {
    const links = guests.map(g => {
      const url = `${window.location.origin}/invitation/${slug}?guest=${encodeURIComponent(g.name)}`;
      return `${g.name}: ${url}`;
    }).join('\n');
    try {
      await navigator.clipboard.writeText(links);
      toast.success('All links copied!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const getRsvpForGuest = (guestName: string) => {
    return rsvps.find(r => r.guestName.toLowerCase() === guestName.toLowerCase());
  };

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">{t('guests', language)}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-gold/10">
          <p className="text-xs text-gray-400 mb-1">Total Guests Attending</p>
          <p className="text-3xl font-bold text-gold">{totalGuestsCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gold/10">
          <p className="text-xs text-gray-400 mb-1">Invited Guests</p>
          <p className="text-3xl font-bold text-charcoal">{guests.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gold/10">
          <p className="text-xs text-gray-400 mb-1">RSVPs Received</p>
          <p className="text-3xl font-bold text-charcoal">{rsvps.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-gold/10">
          <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-gold" /> RSVP Responses ({rsvps.length})
          </h3>
          {rsvps.length === 0 ? (
            <p className="text-sm text-gray-400">No RSVPs yet.</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {rsvps.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-charcoal truncate">{r.guestName}</p>
                    <p className="text-xs text-gray-400">
                      {r.guestCount} guest(s) • {r.meal || 'No meal preference'}
                    </p>
                    {r.message && <p className="text-xs text-gray-400 italic truncate">"{r.message}"</p>}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0 ${
                    r.attending === 'yes' ? 'bg-green-100 text-green-600' : 
                    r.attending === 'no' ? 'bg-red-100 text-red-600' : 
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {r.attending === 'yes' ? 'Attending' : r.attending === 'no' ? 'Not Attending' : 'Maybe'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gold/10">
          <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-pink-500" /> Wishes ({wishes.length})
          </h3>
          {wishes.length === 0 ? (
            <p className="text-sm text-gray-400">No wishes yet.</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {wishes.map((w) => (
                <div key={w.id} className="p-3 rounded-xl bg-gray-50 text-sm">
                  <p className="font-medium text-charcoal">{w.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{w.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl p-5 border border-gold/10">
        <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-gold" /> Guest List & Personalized Links
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          <input
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addGuest()}
            placeholder="Guest name (e.g., Michael)"
            className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl border border-gold/20 text-sm focus:border-gold outline-none"
          />
          <div className="flex items-center gap-1 bg-gray-50 rounded-xl px-3 border border-gold/20">
            <Hash className="w-3 h-3 text-gray-400" />
            <input
              type="number"
              min={1}
              max={20}
              value={maxGuestsInput}
              onChange={(e) => setMaxGuestsInput(Number(e.target.value))}
              className="w-14 py-2.5 bg-transparent text-sm outline-none text-center"
            />
          </div>
          <button
            onClick={addGuest}
            className="bg-gold text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gold-dark transition-colors"
          >
            Add Guest
          </button>
          {guests.length > 0 && (
            <button
              onClick={copyAllLinks}
              className="bg-gray-100 text-charcoal px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              Copy All Links
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 mb-4">The number next to the name is how many guests each person can bring.</p>

        {guests.length > 0 ? (
          <div className="space-y-2">
            {guests.map((g) => {
              const rsvp = getRsvpForGuest(g.name);
              const isEditing = editingId === g.id;
              return (
                <div key={g.id} className={`flex items-center gap-3 p-3 rounded-xl ${rsvp ? 'bg-green-50 border border-green-100' : 'bg-gray-50'}`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal truncate">{g.name}</p>
                    {rsvp && (
                      <p className="text-xs text-green-600">
                        RSVP: {rsvp.attending === 'yes' ? `${rsvp.guestCount} guest(s)` : rsvp.attending}
                      </p>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={editMaxGuests}
                        onChange={(e) => setEditMaxGuests(Number(e.target.value))}
                        className="w-14 px-2 py-1 rounded-lg border border-gold/20 text-sm text-center outline-none"
                      />
                      <button onClick={() => updateGuestMax(g.id, editMaxGuests)} className="p-1 text-green-500 hover:text-green-600">
                        <Save className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-1 text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setEditingId(g.id); setEditMaxGuests(g.maxGuests); }}
                        className="flex items-center gap-1 text-xs bg-white px-2 py-1 rounded-lg border border-gold/20 hover:bg-gold/5"
                      >
                        <Hash className="w-3 h-3 text-gold" />
                        <span className="font-medium">{g.maxGuests}</span>
                        <Edit3 className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => copyLink(g.name)}
                    className="flex items-center gap-1 text-xs bg-white px-3 py-1.5 rounded-lg border border-gold/20 hover:bg-gold/5 transition-colors"
                  >
                    {copied === g.name ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gold" />}
                    {copied === g.name ? 'Copied' : 'Copy Link'}
                  </button>

                  <button onClick={() => removeGuest(g.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <UserPlus className="w-10 h-10 text-gold/30 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No guests added yet. Add your first guest above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
