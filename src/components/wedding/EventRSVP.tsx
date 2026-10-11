'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Users, Send } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface EventRSVPProps {
  primaryColor?: string;
}

export default function EventRSVP({ primaryColor = '#C9A96E' }: EventRSVPProps) {
  const searchParams = useSearchParams();
  const gn = searchParams.get('gn');
  const np = searchParams.get('np');
  const gr = searchParams.get('gr');

  const maxGuests = np ? Math.min(parseInt(np, 10) || 1, 20) : 7;
  const [name, setName] = useState(gn ?? '');
  const [guestCount, setGuestCount] = useState(1);
  const [attending, setAttending] = useState<'yes' | 'no'>(gr?.toLowerCase() === 'n' ? 'no' : 'yes');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const prefilled = Boolean(gn || np || gr);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'event_rsvps'), {
        guestName: name.trim(),
        guestCount,
        attending,
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
    } catch (error) {
      console.error('RSVP submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9 }}
          className="rounded-3xl border overflow-hidden"
          style={{
            borderColor: `${primaryColor}25`,
            backgroundColor: 'rgba(255,255,255,0.9)',
            boxShadow: '0 20px 50px rgba(61, 43, 31, 0.08)',
          }}
        >
          <div className="px-6 sm:px-8 pt-10 pb-2 text-center">
            <p
              className="text-[11px] tracking-[0.35em] uppercase mb-3"
              style={{ color: primaryColor }}
            >
              Kindly Respond
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl" style={{ color: '#3D2B1F' }}>
              RSVP
            </h2>
            <div className="flex items-center justify-center gap-3 mt-5 mb-8">
              <div className="h-px w-12" style={{ backgroundColor: primaryColor }} />
              <span className="text-sm" style={{ color: primaryColor }}>✦</span>
              <div className="h-px w-12" style={{ backgroundColor: primaryColor }} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="px-6 sm:px-8 pb-12 text-center"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ backgroundColor: `${primaryColor}18` }}
                >
                  <Check className="w-8 h-8" style={{ color: primaryColor }} />
                </div>
                <p className="font-serif text-xl mb-2" style={{ color: '#3D2B1F' }}>
                  Thank you, {name || 'friend'}!
                </p>
                <p className="text-sm" style={{ color: '#8B6F5C' }}>
                  {attending === 'yes'
                    ? 'Your response has been received. We look forward to celebrating with you!'
                    : 'Your response has been received. You will be missed!'}
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleSubmit}
                className="px-6 sm:px-8 pb-10 space-y-5"
              >
                {prefilled && (
                  <p className="text-[11px] tracking-wide text-center" style={{ color: primaryColor }}>
                    Your invitation details have been filled in for you
                  </p>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#3D2B1F' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    readOnly={!!gn}
                    required
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-xl border outline-none text-sm bg-white transition-colors focus:ring-1"
                    style={{
                      borderColor: `${primaryColor}35`,
                      color: '#3D2B1F',
                      opacity: gn ? 0.6 : 1,
                      cursor: gn ? 'default' : 'text',
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#3D2B1F' }}>
                    How many people? (including yourself)
                  </label>
                  <div className="relative">
                    <Users
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: primaryColor }}
                    />
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border outline-none text-sm bg-white appearance-none"
                      style={{ borderColor: `${primaryColor}35`, color: '#3D2B1F' }}
                    >
                      {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'person (just me)' : 'people'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-[11px] mt-1.5" style={{ color: primaryColor }}>
                    You can bring up to {maxGuests} {maxGuests === 1 ? 'person' : 'people'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: '#3D2B1F' }}>
                    Are you attending?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['yes', 'no'] as const).map((opt) => (
                      <label
                        key={opt}
                        className={`relative flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium cursor-pointer transition-all ${
                          attending === opt ? 'text-white border-transparent' : ''
                        }`}
                        style={
                          attending === opt
                            ? { backgroundColor: primaryColor }
                            : { borderColor: `${primaryColor}30`, color: '#8B6F5C' }
                        }
                      >
                        <input
                          type="radio"
                          name="attending"
                          value={opt}
                          checked={attending === opt}
                          onChange={() => setAttending(opt)}
                          className="sr-only"
                        />
                        {opt === 'yes' ? 'Yes, I will attend' : 'No, cannot attend'}
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Sending...' : 'Submit RSVP'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
