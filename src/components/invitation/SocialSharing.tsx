'use client';

import { useState } from 'react';
import { Copy, Check, MessageCircle } from 'lucide-react';
import { t, Language } from '@/lib/translations';
import toast from 'react-hot-toast';

interface SocialSharingProps {
  slug: string;
  language: Language;
  primaryColor: string;
}

export default function SocialSharing({ slug, language, primaryColor }: SocialSharingProps) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== 'undefined' ? `${window.location.origin}/invitation/${slug}` : '';
  const shareText = language === 'ar'
    ? 'أنت مدعو لحضور حفل الزفاف! افتح الدعوة للتفاصيل.'
    : 'You are invited to our wedding! Open the invitation for details.';

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + url)}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success(t('linkCopied', language));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t('somethingWrong', language));
    }
  };

  return (
    <div className="py-8 px-4 text-center">
      <h4 className="text-sm font-medium text-charcoal mb-6">{t('shareInvitation', language)}</h4>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <button
          onClick={shareWhatsApp}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white transition-all hover:scale-105"
          style={{ backgroundColor: '#25D366' }}
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </button>
        <button
          onClick={shareFacebook}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white transition-all hover:scale-105"
          style={{ backgroundColor: '#1877F2' }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </button>
        <button
          onClick={shareTelegram}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white transition-all hover:scale-105"
          style={{ backgroundColor: '#0088cc' }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          Telegram
        </button>
        <button
          onClick={copyLink}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all hover:scale-105"
          style={{ borderColor: `${primaryColor}40`, color: primaryColor }}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? t('linkCopied', language) : t('copyLink', language)}
        </button>
      </div>
    </div>
  );
}
