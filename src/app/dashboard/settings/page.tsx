'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { Settings as SettingsIcon, Globe, Lock, Link, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, language } = useAppStore();
  const [invitationId, setInvitationId] = useState('');
  const [slug, setSlug] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
  const [password, setPassword] = useState('');
  const [invitationLang, setInvitationLang] = useState<'en' | 'ar' | 'both'>('both');
  const [plan, setPlan] = useState('free');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const snap = await getDocs(query(collection(db, 'invitations'), where('ownerId', '==', user!.id)));
      if (!snap.empty) {
        const inv = snap.docs[0];
        setInvitationId(inv.id);
        const data = inv.data();
        setSlug(data.slug || '');
        setPrivacy(data.privacy || 'public');
        setPassword(data.password || '');
        setInvitationLang(data.language || 'both');
        setPlan(data.plan || 'free');
      }
    }
    load();
  }, [user]);

  const handleSave = async () => {
    if (!invitationId) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'invitations', invitationId), {
        slug,
        privacy,
        password: privacy === 'private' ? password : '',
        language: invitationLang,
      }, { merge: true });
      toast.success(t('save', language));
    } catch {
      toast.error(t('somethingWrong', language));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">{t('settings', language)}</h2>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-5 border border-gold/10 space-y-4">
          <h3 className="font-semibold text-charcoal flex items-center gap-2">
            <Link className="w-4 h-4 text-gold" /> {t('slug', language)}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">/invitation/</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              className="flex-1 px-3 py-2 rounded-xl border border-gold/20 text-sm focus:border-gold outline-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gold/10 space-y-4">
          <h3 className="font-semibold text-charcoal flex items-center gap-2">
            <Lock className="w-4 h-4 text-gold" /> {t('privacySetting', language)}
          </h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="privacy"
                checked={privacy === 'public'}
                onChange={() => setPrivacy('public')}
                className="accent-gold"
              />
              <div>
                <p className="text-sm font-medium text-charcoal">Public</p>
                <p className="text-xs text-gray-400">{t('publicInvitation', language)}</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="privacy"
                checked={privacy === 'private'}
                onChange={() => setPrivacy('private')}
                className="accent-gold"
              />
              <div>
                <p className="text-sm font-medium text-charcoal">Private</p>
                <p className="text-xs text-gray-400">{t('privateInvitation', language)}</p>
              </div>
            </label>
          </div>
          {privacy === 'private' && (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('password', language)}
              className="w-full px-3 py-2 rounded-xl border border-gold/20 text-sm focus:border-gold outline-none"
            />
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gold/10 space-y-4">
          <h3 className="font-semibold text-charcoal flex items-center gap-2">
            <Globe className="w-4 h-4 text-gold" /> {t('email', language)} {t('language', language) || 'Language'}
          </h3>
          <select
            value={invitationLang}
            onChange={(e) => setInvitationLang(e.target.value as 'en' | 'ar' | 'both')}
            className="w-full px-3 py-2 rounded-xl border border-gold/20 text-sm focus:border-gold outline-none bg-white"
          >
            <option value="en">English Only</option>
            <option value="ar">Arabic Only</option>
            <option value="both">Both (EN + AR)</option>
          </select>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gold/10">
          <h3 className="font-semibold text-charcoal flex items-center gap-2 mb-3">
            <CreditCard className="w-4 h-4 text-gold" /> {t('currentPlan', language)}
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-charcoal capitalize">{plan}</span>
              {plan !== 'luxury' && (
                <button className="ml-3 text-sm text-gold font-medium hover:text-gold-dark transition-colors">
                  {t('upgrade', language)}
                </button>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-gold text-white py-3 rounded-xl font-medium hover:bg-gold-dark transition-colors disabled:opacity-50"
        >
          {saving ? '...' : t('save', language)}
        </button>
      </div>
    </div>
  );
}
