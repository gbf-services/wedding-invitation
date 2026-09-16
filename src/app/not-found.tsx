'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream to-white px-4">
      <div className="text-center">
        <div className="text-8xl font-serif text-gold mb-4">404</div>
        <h1 className="text-2xl font-semibold text-charcoal mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-8">The page you are looking for does not exist.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gold text-white px-6 py-3 rounded-full hover:bg-gold-dark transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
