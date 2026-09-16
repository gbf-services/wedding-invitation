'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { Invitation, ThemeId } from '@/lib/types';
import { themes } from '@/lib/themes';
import { Save, Eye, Monitor, Tablet, Smartphone, ArrowUp, ArrowDown, Palette, ExternalLink, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const sectionLabels: Record<string, Record<string, string>> = {
  couple: { en: 'Couple Names', ar: 'اسماء العروسين' },
  countdown: { en: 'Countdown', ar: 'العد التنازلي' },
  details: { en: 'Wedding Details', ar: 'تفاصيل الحفل' },
  schedule: { en: 'Schedule', ar: 'الجدول' },
  story: { en: 'Our Story', ar: 'قصتنا' },
  venue: { en: 'Venue', ar: 'المكان' },
  gallery: { en: 'Gallery', ar: 'المعرض' },
  rsvp: { en: 'RSVP', ar: 'تأكيد الحضور' },
  wishes: { en: 'Wishes', ar: 'التهاني' },
  qr: { en: 'QR Code', ar: 'رمز QR' },
  share: { en: 'Share', ar: 'مشاركة' },
  dresscode: { en: 'Dress Code', ar: 'ال dress code' },
  contact: { en: 'Contact', ar: 'تواصل' },
};

const fonts = ['Playfair Display', 'Cormorant Garamond', 'Great Vibes', 'Montserrat', 'Amiri', 'Cairo'];

function generateSlug(groom: string, bride: string): string {
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
  const g = clean(groom);
  const b = clean(bride);
  if (g && b) return `${g}-and-${b}`;
  if (g) return g;
  if (b) return b;
  return `inv-${Date.now()}`;
}

export default function EditorPage() {
  const { user, language } = useAppStore();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [form, setForm] = useState({
    bride: '', groom: '', brideAr: '', groomAr: '',
    date: '', time: '', venue: '', venueAr: '',
    venueAddress: '', venueAddressAr: '',
    description: '', descriptionAr: '',
    dressCode: '', dressCodeAr: '',
    contactInfo: '', googleMapsUrl: '',
    primaryColor: '#C9A96E', secondaryColor: '#F5F0E8',
    fontFamily: 'Playfair Display', theme: 'elegant' as ThemeId,
    slug: '',
    sectionOrder: ['couple', 'countdown', 'details', 'schedule', 'story', 'venue', 'gallery', 'rsvp', 'wishes', 'qr', 'share', 'dresscode', 'contact'],
    rsvpEnabled: true, wishesEnabled: true, galleryEnabled: true,
    storyEnabled: true, scheduleEnabled: true, venueEnabled: true, countdownEnabled: true,
    guestPersonalization: false, privacy: 'public' as 'public' | 'private',
    password: '', maxGuests: 100, maxGuestsPerRsvp: 4,
  });
  const [previewSize, setPreviewSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const snap = await getDocs(query(collection(db, 'invitations'), where('ownerId', '==', user!.id)));
      if (!snap.empty) {
        const inv = { id: snap.docs[0].id, ...snap.docs[0].data() } as Invitation;
        setInvitation(inv);
        setForm({
          bride: inv.bride || '', groom: inv.groom || '',
          brideAr: inv.brideAr || '', groomAr: inv.groomAr || '',
          date: inv.date || '', time: inv.time || '',
          venue: inv.venue || '', venueAr: inv.venueAr || '',
          venueAddress: inv.venueAddress || '', venueAddressAr: inv.venueAddressAr || '',
          description: inv.description || '', descriptionAr: inv.descriptionAr || '',
          dressCode: inv.dressCode || '', dressCodeAr: inv.dressCodeAr || '',
          contactInfo: inv.contactInfo || '', googleMapsUrl: inv.googleMapsUrl || '',
          primaryColor: inv.primaryColor || '#C9A96E', secondaryColor: inv.secondaryColor || '#F5F0E8',
          fontFamily: inv.fontFamily || 'Playfair Display', theme: (inv.theme as ThemeId) || 'elegant',
          slug: inv.slug || '',
          sectionOrder: inv.sectionOrder || ['couple', 'countdown', 'details', 'schedule', 'story', 'venue', 'gallery', 'rsvp', 'wishes', 'qr', 'share', 'dresscode', 'contact'],
          rsvpEnabled: inv.rsvpEnabled, wishesEnabled: inv.wishesEnabled,
          galleryEnabled: inv.galleryEnabled, storyEnabled: inv.storyEnabled,
          scheduleEnabled: inv.scheduleEnabled, venueEnabled: inv.venueEnabled,
          countdownEnabled: inv.countdownEnabled, guestPersonalization: inv.guestPersonalization,
          privacy: inv.privacy, password: inv.password || '',
          maxGuests: inv.maxGuests || 100, maxGuestsPerRsvp: inv.maxGuestsPerRsvp || 4,
        });
      }
    }
    load();
  }, [user]);

  const update = (key: string, value: string | boolean | string[] | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const moveSection = (index: number, dir: -1 | 1) => {
    const arr = [...form.sectionOrder];
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= arr.length) return;
    [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
    update('sectionOrder', arr);
  };

  const applyTheme = (themeId: ThemeId) => {
    const theme = themes[themeId];
    setForm((prev) => ({
      ...prev,
      theme: themeId,
      primaryColor: theme.defaults.primaryColor,
      secondaryColor: theme.defaults.secondaryColor,
      fontFamily: theme.defaults.fontFamily,
    }));
  };

  const handleSave = async (publish = false) => {
    if (!user) return;
    if (!form.groom && !form.bride) {
      toast.error('Please enter at least the groom or bride name');
      return;
    }
    setSaving(true);
    try {
      const slug = form.slug || generateSlug(form.groom, form.bride);
      const data = {
        ...form,
        slug,
        status: publish ? 'published' : (invitation?.status || 'draft'),
        ownerId: user.id,
        language: 'both',
        plan: invitation?.plan || 'free',
        createdAt: invitation?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (invitation) {
        await setDoc(doc(db, 'invitations', invitation.id), data, { merge: true });
        setInvitation({ ...invitation, ...data } as Invitation);
      } else {
        await setDoc(doc(db, 'invitations', slug), data);
        setInvitation({ id: slug, ...data } as Invitation);
        setForm((prev) => ({ ...prev, slug }));
      }

      if (publish) {
        toast.success('Invitation published!');
      } else {
        toast.success(t('save', language));
      }
    } catch (err) {
      console.error('Save error:', err);
      toast.error(t('somethingWrong', language));
    } finally {
      setSaving(false);
    }
  };

  const currentSlug = form.slug || generateSlug(form.groom, form.bride);
  const invitationUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/invitation/${currentSlug}`;
  const isPublished = invitation?.status === 'published';

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(invitationUrl);
      setCopied(true);
      toast.success('URL copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const previewWidth = previewSize === 'desktop' ? '100%' : previewSize === 'tablet' ? '768px' : '375px';

  const toggleFields = [
    { key: 'rsvpEnabled', label: 'RSVP' },
    { key: 'wishesEnabled', label: t('wishes', language) },
    { key: 'galleryEnabled', label: t('gallery', language) },
    { key: 'storyEnabled', label: t('ourStory', language) },
    { key: 'scheduleEnabled', label: t('weddingSchedule', language) },
    { key: 'venueEnabled', label: t('venue', language) },
    { key: 'countdownEnabled', label: t('weddingCountdown', language) },
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      <div className="flex-1 space-y-6 min-w-0">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl font-serif font-bold text-charcoal">{t('editor', language)}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex items-center gap-2 bg-gray-100 text-charcoal px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? '...' : t('save', language)}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex items-center gap-2 bg-gold text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gold-dark transition-colors disabled:opacity-50"
            >
              {isPublished ? 'Update & Publish' : 'Publish'}
            </button>
          </div>
        </div>

        {invitation && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-sm font-medium text-green-800">
                  {isPublished ? 'Your invitation is live!' : 'Draft - Not yet published'}
                </p>
                <p className="text-xs text-green-600 mt-1 break-all">{invitationUrl}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={copyUrl} className="flex items-center gap-1 text-xs bg-white px-3 py-1.5 rounded-lg border border-green-200 hover:bg-green-100">
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy URL'}
                </button>
                {isPublished && (
                  <Link href={`/invitation/${currentSlug}`} target="_blank" className="flex items-center gap-1 text-xs bg-white px-3 py-1.5 rounded-lg border border-green-200 hover:bg-green-100">
                    <ExternalLink className="w-3 h-3" />
                    View
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-5 border border-gold/10 space-y-4">
          <h3 className="font-semibold text-charcoal flex items-center gap-2">
            <Palette className="w-4 h-4 text-gold" /> {t('template', language)}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Object.values(themes).map((th) => (
              <button
                key={th.id}
                onClick={() => applyTheme(th.id)}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  form.theme === th.id ? 'border-gold shadow-md' : 'border-gold/10 hover:border-gold/30'
                }`}
              >
                <div className="w-full h-8 rounded-lg mb-2" style={{ background: th.defaults.background }}>
                  <div className="flex items-center justify-center h-full">
                    <div className="w-3 h-3 rounded-full" style={{ background: th.defaults.primaryColor }} />
                  </div>
                </div>
                <span className="text-xs font-medium">{language === 'ar' ? th.nameAr : th.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gold/10 space-y-4">
          <h3 className="font-semibold text-charcoal">Couple Names</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Groom (EN)</label>
              <input value={form.groom} onChange={(e) => update('groom', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gold/20 text-sm focus:border-gold outline-none" placeholder="Ahmad" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Bride (EN)</label>
              <input value={form.bride} onChange={(e) => update('bride', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gold/20 text-sm focus:border-gold outline-none" placeholder="Sarah" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Groom (AR)</label>
              <input value={form.groomAr} onChange={(e) => update('groomAr', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gold/20 text-sm focus:border-gold outline-none" dir="rtl" placeholder="أحمد" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Bride (AR)</label>
              <input value={form.brideAr} onChange={(e) => update('brideAr', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gold/20 text-sm focus:border-gold outline-none" dir="rtl" placeholder="سارة" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gold/10 space-y-4">
          <h3 className="font-semibold text-charcoal">{t('weddingDetails', language)}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Date</label>
              <input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gold/20 text-sm focus:border-gold outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Time</label>
              <input type="time" value={form.time} onChange={(e) => update('time', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gold/20 text-sm focus:border-gold outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Venue (EN)</label>
              <input value={form.venue} onChange={(e) => update('venue', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gold/20 text-sm focus:border-gold outline-none" placeholder="Four Seasons Hotel" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Venue (AR)</label>
              <input value={form.venueAr} onChange={(e) => update('venueAr', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gold/20 text-sm focus:border-gold outline-none" dir="rtl" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Address (EN)</label>
              <input value={form.venueAddress} onChange={(e) => update('venueAddress', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gold/20 text-sm focus:border-gold outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Address (AR)</label>
              <input value={form.venueAddressAr} onChange={(e) => update('venueAddressAr', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gold/20 text-sm focus:border-gold outline-none" dir="rtl" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Description (EN)</label>
            <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={2} className="w-full px-3 py-2 rounded-xl border border-gold/20 text-sm focus:border-gold outline-none resize-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Description (AR)</label>
            <textarea value={form.descriptionAr} onChange={(e) => update('descriptionAr', e.target.value)} rows={2} className="w-full px-3 py-2 rounded-xl border border-gold/20 text-sm focus:border-gold outline-none resize-none" dir="rtl" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Dress Code</label>
              <input value={form.dressCode} onChange={(e) => update('dressCode', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gold/20 text-sm focus:border-gold outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Contact Info</label>
              <input value={form.contactInfo} onChange={(e) => update('contactInfo', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gold/20 text-sm focus:border-gold outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Google Maps URL</label>
            <input value={form.googleMapsUrl} onChange={(e) => update('googleMapsUrl', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gold/20 text-sm focus:border-gold outline-none" placeholder="https://maps.google.com/..." />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gold/10 space-y-4">
          <h3 className="font-semibold text-charcoal">Appearance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">{t('primaryColor', language)}</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.primaryColor} onChange={(e) => update('primaryColor', e.target.value)} className="w-10 h-10 rounded-lg border-0 cursor-pointer" />
                <input value={form.primaryColor} onChange={(e) => update('primaryColor', e.target.value)} className="flex-1 px-3 py-2 rounded-xl border border-gold/20 text-sm focus:border-gold outline-none font-mono" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">{t('secondaryColor', language)}</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.secondaryColor} onChange={(e) => update('secondaryColor', e.target.value)} className="w-10 h-10 rounded-lg border-0 cursor-pointer" />
                <input value={form.secondaryColor} onChange={(e) => update('secondaryColor', e.target.value)} className="flex-1 px-3 py-2 rounded-xl border border-gold/20 text-sm focus:border-gold outline-none font-mono" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('font', language)}</label>
            <select value={form.fontFamily} onChange={(e) => update('fontFamily', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gold/20 text-sm focus:border-gold outline-none bg-white">
              {fonts.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gold/10 space-y-3">
          <h3 className="font-semibold text-charcoal">Sections</h3>
          {form.sectionOrder.map((key, i) => (
            <div key={key} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <div className="flex flex-col gap-0.5">
                <button onClick={() => moveSection(i, -1)} disabled={i === 0} className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30">
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button onClick={() => moveSection(i, 1)} disabled={i === form.sectionOrder.length - 1} className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30">
                  <ArrowDown className="w-3 h-3" />
                </button>
              </div>
              <span className="text-sm font-medium flex-1">{sectionLabels[key]?.[language] || key}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gold/10 space-y-4">
          <h3 className="font-semibold text-charcoal">Guest Limits</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Max Total Guests</label>
              <input
                type="number"
                min={1}
                max={1000}
                value={form.maxGuests}
                onChange={(e) => update('maxGuests', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gold/20 text-sm focus:border-gold outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Total guests allowed across all RSVPs</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Max Guests Per RSVP</label>
              <input
                type="number"
                min={1}
                max={20}
                value={form.maxGuestsPerRsvp}
                onChange={(e) => update('maxGuestsPerRsvp', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gold/20 text-sm focus:border-gold outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Max guests each person can bring</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gold/10 space-y-3">
          <h3 className="font-semibold text-charcoal">Enable/Disable</h3>
          {toggleFields.map((f) => (
            <label key={f.key} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 cursor-pointer">
              <span className="text-sm font-medium">{f.label}</span>
              <input
                type="checkbox"
                checked={form[f.key as keyof typeof form] as boolean}
                onChange={(e) => update(f.key, e.target.checked)}
                className="w-5 h-5 rounded border-gold/30 text-gold focus:ring-gold accent-gold"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="w-full xl:w-[420px] flex-shrink-0">
        <div className="sticky top-20">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-charcoal">{t('preview', language)}</span>
            <div className="flex-1" />
            {(['desktop', 'tablet', 'mobile'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setPreviewSize(size)}
                className={`p-2 rounded-lg transition-colors ${previewSize === size ? 'bg-gold/10 text-gold' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {size === 'desktop' ? <Monitor className="w-4 h-4" /> : size === 'tablet' ? <Tablet className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-gold/10 overflow-hidden shadow-lg" style={{ maxWidth: previewWidth, margin: '0 auto' }}>
            <div className="p-6 text-center" style={{ background: `linear-gradient(135deg, ${form.primaryColor}10, white)` }}>
              <div className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: form.primaryColor }}>
                {t('youAreInvited', 'en')}
              </div>
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-1">
                {form.groom || 'Groom'} & {form.bride || 'Bride'}
              </h2>
              {form.date && (
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(form.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              )}
              {form.time && <p className="text-xs text-gray-400">at {form.time}</p>}
              {form.venue && <p className="text-xs text-gray-400 mt-1">{form.venue}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
