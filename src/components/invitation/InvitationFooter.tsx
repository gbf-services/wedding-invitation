'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';

interface InvitationFooterProps {
  primaryColor: string;
}

export default function InvitationFooter({ primaryColor }: InvitationFooterProps) {
  return (
    <footer className="py-8 text-center border-t border-gold/10">
      <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
        <span>Made with</span>
        <Heart className="w-3 h-3 fill-current" style={{ color: primaryColor }} />
        <span>by</span>
        <Link href="/" className="font-medium hover:opacity-80 transition-opacity" style={{ color: primaryColor }}>
          WeddingInvite
        </Link>
      </div>
    </footer>
  );
}
