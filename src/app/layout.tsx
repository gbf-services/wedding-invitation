import type { Metadata } from 'next';
import Providers from '@/components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'WeddingInv - Digital Wedding Invitation Platform',
  description: 'Create beautiful digital wedding invitations that your guests will remember. Elegant templates, RSVP management, photo galleries, and more.',
  keywords: ['wedding', 'invitation', 'digital', 'RSVP', 'e-invite', 'wedding invitation', 'online invitation'],
  openGraph: {
    title: 'WeddingInv - Digital Wedding Invitation Platform',
    description: 'Create beautiful digital wedding invitations that your guests will remember.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Great+Vibes&family=Montserrat:wght@300;400;500;600;700&family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Noto+Kufi+Arabic:wght@300;400;500;600;700&family=Cairo:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
