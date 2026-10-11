import Link from 'next/link';
import { wedding } from '@/lib/wedding-config';

export default function NotFound() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: wedding.colors.bg }}
    >
      <p
        className="font-script text-5xl"
        style={{ color: wedding.colors.accent }}
      >
        Oops
      </p>
      <h1
        className="mt-4 font-serif text-3xl tracking-wide"
        style={{ color: wedding.colors.dark }}
      >
        Page Not Found
      </h1>
      <p
        className="mt-3 max-w-sm text-sm leading-relaxed"
        style={{ color: wedding.colors.text, opacity: 0.7 }}
      >
        The page you are looking for has moved or does not exist.
      </p>
      <Link
        href="/"
        className="mt-10 rounded-full px-10 py-3.5 text-xs font-medium uppercase tracking-[0.25em] transition-opacity hover:opacity-90"
        style={{
          backgroundColor: wedding.colors.primary,
          color: wedding.colors.bg,
        }}
      >
        Return home
      </Link>
    </main>
  );
}
