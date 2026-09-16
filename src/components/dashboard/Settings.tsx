'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Check, X, Globe, Lock, Eye, EyeOff } from 'lucide-react';
import type { Invitation } from '@/lib/types';
import { themes } from '@/lib/themes';
import { generateSlug, cn } from '@/lib/utils';

interface SettingsProps {
  invitation: Invitation;
  onSave: (data: Partial<Invitation>) => Promise<void>;
}

export default function Settings({ invitation, onSave }: SettingsProps) {
  const [form, setForm] = useState({
    slug: invitation.slug,
    privacy: invitation.privacy as 'public' | 'private',
    password: invitation.password || '',
    language: invitation.language,
    theme: invitation.theme,
    primaryColor: invitation.primaryColor,
    secondaryColor: invitation.secondaryColor,
    rsvpEnabled: invitation.rsvpEnabled,
    wishesEnabled: invitation.wishesEnabled,
    galleryEnabled: invitation.galleryEnabled,
    storyEnabled: invitation.storyEnabled,
    scheduleEnabled: invitation.scheduleEnabled,
    venueEnabled: invitation.venueEnabled,
    countdownEnabled: invitation.countdownEnabled,
  });

  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (form.slug === invitation.slug) {
      setSlugStatus('idle');
      return;
    }

    const timer = setTimeout(() => {
      setSlugStatus('checking');
      setTimeout(() => {
        setSlugStatus(form.slug.length >= 3 ? 'available' : 'taken');
      }, 500);
    }, 500);

    return () => clearTimeout(timer);
  }, [form.slug, invitation.slug]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        slug: form.slug,
        privacy: form.privacy,
        password: form.password,
        language: form.language,
        theme: form.theme,
        primaryColor: form.primaryColor,
        secondaryColor: form.secondaryColor,
        rsvpEnabled: form.rsvpEnabled,
        wishesEnabled: form.wishesEnabled,
        galleryEnabled: form.galleryEnabled,
        storyEnabled: form.storyEnabled,
        scheduleEnabled: form.scheduleEnabled,
        venueEnabled: form.venueEnabled,
        countdownEnabled: form.countdownEnabled,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif text-charcoal">Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            'inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all',
            saved
              ? 'bg-green-500 text-white'
              : 'bg-gold text-white hover:bg-gold-dark shadow-lg shadow-gold/20'
          )}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved!
            </>
          ) : saving ? (
            'Saving...'
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-gold/10">
            <h3 className="font-semibold text-charcoal mb-4">Invitation URL</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-charcoal/40 whitespace-nowrap">
                weddinginv.com/
              </span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) =>
                  setForm({ ...form, slug: generateSlug(e.target.value) })
                }
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all"
              />
            </div>
            {slugStatus !== 'idle' && (
              <p
                className={cn(
                  'text-xs mt-2 flex items-center gap-1',
                  slugStatus === 'available'
                    ? 'text-green-600'
                    : slugStatus === 'taken'
                    ? 'text-red-500'
                    : 'text-charcoal/40'
                )}
              >
                {slugStatus === 'checking' && 'Checking availability...'}
                {slugStatus === 'available' && (
                  <>
                    <Check className="w-3 h-3" />
                    URL is available
                  </>
                )}
                {slugStatus === 'taken' && (
                  <>
                    <X className="w-3 h-3" />
                    URL is already taken
                  </>
                )}
              </p>
            )}
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gold/10">
            <h3 className="font-semibold text-charcoal mb-4">Privacy</h3>
            <div className="space-y-3">
              {(['public', 'private'] as const).map((option) => (
                <label
                  key={option}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all',
                    form.privacy === option
                      ? 'border-gold/40 bg-gold/5'
                      : 'border-gold/10 hover:border-gold/20'
                  )}
                >
                  <input
                    type="radio"
                    name="privacy"
                    value={option}
                    checked={form.privacy === option}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        privacy: e.target.value as 'public' | 'private',
                      })
                    }
                    className="sr-only"
                  />
                  {option === 'public' ? (
                    <Globe className="w-5 h-5 text-gold" />
                  ) : (
                    <Lock className="w-5 h-5 text-gold" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-charcoal capitalize">
                      {option === 'public' ? 'Public' : 'Private'}
                    </p>
                    <p className="text-xs text-charcoal/40">
                      {option === 'public'
                        ? 'Anyone with the link can view'
                        : 'Requires password'}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            {form.privacy === 'private' && (
              <div className="mt-4 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Set a password"
                  className="w-full px-3 py-2 pr-10 text-sm rounded-lg border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-charcoal/60"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gold/10">
            <h3 className="font-semibold text-charcoal mb-4">Language</h3>
            <div className="flex gap-3">
              {(['en', 'ar', 'both'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setForm({ ...form, language: lang })}
                  className={cn(
                    'flex-1 py-2.5 text-sm font-medium rounded-xl border transition-all',
                    form.language === lang
                      ? 'border-gold/40 bg-gold/10 text-gold'
                      : 'border-gold/10 text-charcoal/50 hover:border-gold/20'
                  )}
                >
                  {lang === 'en' ? 'English' : lang === 'ar' ? 'العربية' : 'Both'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-gold/10">
            <h3 className="font-semibold text-charcoal mb-4">Theme</h3>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(themes) as Array<keyof typeof themes>).map((id) => (
                <button
                  key={id}
                  onClick={() => {
                    const theme = themes[id];
                    setForm({
                      ...form,
                      theme: id,
                      primaryColor: theme.defaults.primaryColor,
                      secondaryColor: theme.defaults.secondaryColor,
                    });
                  }}
                  className={cn(
                    'p-3 rounded-xl border text-left transition-all',
                    form.theme === id
                      ? 'border-gold/40 bg-gold/5 shadow-sm'
                      : 'border-gold/10 hover:border-gold/20'
                  )}
                >
                  <div
                    className="w-full h-8 rounded-lg mb-2"
                    style={{
                      background: `linear-gradient(135deg, ${themes[id].defaults.primaryColor}, ${themes[id].defaults.secondaryColor})`,
                    }}
                  />
                  <p className="text-xs font-medium text-charcoal">
                    {themes[id].name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gold/10">
            <h3 className="font-semibold text-charcoal mb-4">Colors</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-charcoal/50 mb-2 block">
                  Primary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.primaryColor}
                    onChange={(e) =>
                      setForm({ ...form, primaryColor: e.target.value })
                    }
                    className="w-10 h-10 rounded-lg border border-gold/15 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={form.primaryColor}
                    onChange={(e) =>
                      setForm({ ...form, primaryColor: e.target.value })
                    }
                    className="flex-1 px-3 py-2 text-sm font-mono rounded-lg border border-gold/15 focus:border-gold outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-charcoal/50 mb-2 block">
                  Secondary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.secondaryColor}
                    onChange={(e) =>
                      setForm({ ...form, secondaryColor: e.target.value })
                    }
                    className="w-10 h-10 rounded-lg border border-gold/15 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={form.secondaryColor}
                    onChange={(e) =>
                      setForm({ ...form, secondaryColor: e.target.value })
                    }
                    className="flex-1 px-3 py-2 text-sm font-mono rounded-lg border border-gold/15 focus:border-gold outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gold/10">
            <h3 className="font-semibold text-charcoal mb-4">Sections</h3>
            <div className="space-y-3">
              {(
                [
                  { key: 'rsvpEnabled', label: 'RSVP' },
                  { key: 'wishesEnabled', label: 'Wishes' },
                  { key: 'galleryEnabled', label: 'Gallery' },
                  { key: 'storyEnabled', label: 'Our Story' },
                  { key: 'scheduleEnabled', label: 'Schedule' },
                  { key: 'venueEnabled', label: 'Venue' },
                  { key: 'countdownEnabled', label: 'Countdown' },
                ] as const
              ).map((section) => (
                <label
                  key={section.key}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-charcoal">{section.label}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        [section.key]: !form[section.key],
                      })
                    }
                    className={cn(
                      'relative w-11 h-6 rounded-full transition-colors',
                      form[section.key]
                        ? 'bg-gold'
                        : 'bg-charcoal/15'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform',
                        form[section.key] && 'translate-x-5'
                      )}
                    />
                  </button>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
