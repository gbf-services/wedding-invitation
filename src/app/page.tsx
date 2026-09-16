'use client';

import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Templates from '@/components/landing/Templates';
import Pricing from '@/components/landing/Pricing';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Header onNavigate={scrollTo} />
      <Hero />
      <div id="features"><Features /></div>
      <div id="templates"><Templates /></div>
      <div id="pricing"><Pricing /></div>
      <div id="faq"><FAQ /></div>
      <Footer />
    </div>
  );
}
