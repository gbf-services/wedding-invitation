'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream to-white px-4">
      <div className="text-center">
        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-charcoal mb-2">Something went wrong</h1>
        <p className="text-gray-500 mb-8">{error.message || 'An unexpected error occurred.'}</p>
        <button
          onClick={reset}
          className="bg-gold text-white px-6 py-3 rounded-full hover:bg-gold-dark transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
