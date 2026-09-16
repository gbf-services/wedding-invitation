'use client';

import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';
import { t, Language } from '@/lib/translations';

interface QRCodeSectionProps {
  slug: string;
  language: Language;
  primaryColor: string;
}

export default function QRCodeSection({ slug, language, primaryColor }: QRCodeSectionProps) {
  const url = typeof window !== 'undefined' ? `${window.location.origin}/invitation/${slug}` : '';

  const download = () => {
    const svg = document.querySelector('#qr-code svg') as SVGElement;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const a = document.createElement('a');
      a.download = `qr-${slug}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="py-12 px-4 text-center">
      <div id="qr-code" className="inline-block p-4 bg-white rounded-2xl shadow-lg border border-gold/10">
        <QRCodeSVG value={url} size={160} bgColor="#ffffff" fgColor={primaryColor} level="M" />
      </div>
      <button
        onClick={download}
        className="mt-4 inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border border-gold/20 hover:bg-gold/5 transition-colors"
        style={{ color: primaryColor }}
      >
        <Download className="w-4 h-4" />
        {t('downloadQR', language)}
      </button>
    </div>
  );
}
