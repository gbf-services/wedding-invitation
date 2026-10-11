'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserPlus, Trash2, Copy, Check, Hash, RefreshCw, Download, Pencil, X } from 'lucide-react';
import { wedding } from '@/lib/wedding-config';

interface WeddingGuest {
  id: string;
  name: string;
  maxGuests: number;
}

export default function GuestManagerPage() {
  const [guests, setGuests] = useState<WeddingGuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [copied, setCopied] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCount, setEditCount] = useState(1);

  const checkPassword = () => {
    if (password === 'christian2027') {
      setAuthed(true);
    } else {
      alert('Wrong password');
    }
  };

  const loadGuests = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'wedding_guests'));
      setGuests(snap.docs.map((d) => ({ id: d.id, ...d.data() } as WeddingGuest)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) loadGuests();
  }, [authed]);

  const addGuest = async () => {
    if (!guestName.trim()) return;
    try {
      const docRef = await addDoc(collection(db, 'wedding_guests'), {
        name: guestName.trim(),
        maxGuests: guestCount,
      });
      setGuests((prev) => [...prev, { id: docRef.id, name: guestName.trim(), maxGuests: guestCount }]);
      setGuestName('');
      setGuestCount(1);
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (g: WeddingGuest) => {
    setEditingId(g.id);
    setEditName(g.name);
    setEditCount(g.maxGuests);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditCount(1);
  };

  const saveEdit = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await updateDoc(doc(db, 'wedding_guests', id), {
        name: editName.trim(),
        maxGuests: editCount,
      });
      setGuests((prev) =>
        prev.map((g) => (g.id === id ? { ...g, name: editName.trim(), maxGuests: editCount } : g))
      );
      cancelEdit();
    } catch (err) {
      console.error(err);
    }
  };

  const removeGuest = async (id: string) => {
    if (!confirm('Remove this guest?')) return;
    await deleteDoc(doc(db, 'wedding_guests', id));
    setGuests((prev) => prev.filter((g) => g.id !== id));
  };

  const getLink = (name: string, maxGuests: number) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const params = new URLSearchParams({
      gn: name,
      np: String(maxGuests),
    });
    return `${origin}?${params.toString()}`;
  };

  const copyLink = (name: string, maxGuests: number) => {
    const url = getLink(name, maxGuests);
    navigator.clipboard.writeText(url);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAllLinks = () => {
    const text = guests
      .map((g) => `${g.name} (${g.maxGuests} people):\n${getLink(g.name, g.maxGuests)}\n`)
      .join('\n');
    navigator.clipboard.writeText(text);
    alert('All links copied!');
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: wedding.colors.bg }}>
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gold/10 w-96">
          <h1 className="text-xl font-serif font-bold text-center mb-6" style={{ color: wedding.colors.dark }}>
            Guest Manager
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

  return (
    <div className="min-h-screen" style={{ background: wedding.colors.bg }}>
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-serif font-bold" style={{ color: wedding.colors.dark }}>
            Guest Manager
          </h1>
          <div className="flex gap-2">
            <button
              onClick={loadGuests}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gold/20 hover:bg-gold/5"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            {guests.length > 0 && (
              <button
                onClick={copyAllLinks}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gold/20 hover:bg-gold/5"
              >
                <Download className="w-4 h-4" />
                Copy All Links
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gold/10 mb-6">
          <h2 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4" style={{ color: wedding.colors.primary }} />
            Add Guest
          </h2>
          <div className="flex flex-wrap gap-2">
            <input
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addGuest()}
              placeholder="Guest name"
              className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl border border-gold/20 text-sm focus:border-gold outline-none"
            />
            <div className="flex items-center gap-1 bg-gray-50 rounded-xl px-3 border border-gold/20">
              <Hash className="w-3 h-3 text-gray-400" />
              <input
                type="number"
                min={1}
                max={20}
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-14 py-2.5 bg-transparent text-sm outline-none text-center"
              />
              <span className="text-xs text-gray-400">people</span>
            </div>
            <button
              onClick={addGuest}
              className="text-white px-5 py-2.5 rounded-xl text-sm font-medium"
              style={{ backgroundColor: wedding.colors.primary }}
            >
              Add
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Max people this guest can bring (including themselves). Example: 3 = them + 2 others.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
          </div>
        ) : guests.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gold/10 text-center">
            <UserPlus className="w-12 h-12 text-gold/30 mx-auto mb-3" />
            <p className="text-gray-400">No guests yet. Add your first guest above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {guests.map((g) => (
              <div key={g.id} className="bg-white rounded-2xl border border-gold/10 p-4">
                {editingId === g.id ? (
                  <div className="flex flex-wrap gap-2 items-center">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(g.id)}
                      className="flex-1 min-w-[160px] px-3 py-2 rounded-xl border border-gold/20 text-sm focus:border-gold outline-none"
                    />
                    <div className="flex items-center gap-1 bg-gray-50 rounded-xl px-3 border border-gold/20">
                      <Hash className="w-3 h-3 text-gray-400" />
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={editCount}
                        onChange={(e) => setEditCount(Number(e.target.value))}
                        className="w-14 py-2 bg-transparent text-sm outline-none text-center"
                      />
                      <span className="text-xs text-gray-400">people</span>
                    </div>
                    <button
                      onClick={() => saveEdit(g.id)}
                      className="flex items-center gap-1 text-xs text-white px-3 py-2 rounded-lg"
                      style={{ backgroundColor: wedding.colors.primary }}
                    >
                      <Check className="w-3 h-3" />
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-1 text-xs border border-gold/20 px-3 py-2 rounded-lg hover:bg-gold/5"
                    >
                      <X className="w-3 h-3" />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-charcoal">{g.name}</p>
                      <p className="text-xs text-gray-400">
                        Allowed: up to {g.maxGuests} {g.maxGuests === 1 ? 'person' : 'people'}
                      </p>
                    </div>

                    <span className="flex items-center gap-1 text-xs bg-gray-50 px-3 py-1.5 rounded-lg border border-gold/10">
                      <Hash className="w-3 h-3" style={{ color: wedding.colors.primary }} />
                      <span className="font-medium">{g.maxGuests}</span>
                    </span>

                    <button
                      onClick={() => copyLink(g.name, g.maxGuests)}
                      className="flex items-center gap-1 text-xs border border-gold/20 px-3 py-1.5 rounded-lg hover:bg-gold/5 transition-colors"
                    >
                      {copied === g.name ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3" style={{ color: wedding.colors.primary }} />
                      )}
                      {copied === g.name ? 'Copied!' : 'Copy Link'}
                    </button>

                    <button
                      onClick={() => startEdit(g)}
                      className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => removeGuest(g.id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
