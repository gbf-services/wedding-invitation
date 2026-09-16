'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Invitation, WeddingEvent, GalleryImage, StoryEvent, Wish, RSVP } from '@/lib/types';
import { t, Language } from '@/lib/translations';
import { useAppStore } from '@/lib/store';
import PasswordGate from '@/components/invitation/PasswordGate';
import OpeningScreen from '@/components/invitation/OpeningScreen';
import LanguageSwitcher from '@/components/invitation/LanguageSwitcher';
import MusicPlayer from '@/components/invitation/MusicPlayer';
import CountdownTimer from '@/components/invitation/CountdownTimer';
import WeddingDetails from '@/components/invitation/WeddingDetails';
import WeddingSchedule from '@/components/invitation/WeddingSchedule';
import CoupleStory from '@/components/invitation/CoupleStory';
import VenueSection from '@/components/invitation/VenueSection';
import PhotoGallery from '@/components/invitation/PhotoGallery';
import RSVPForm from '@/components/invitation/RSVPForm';
import WishesSection from '@/components/invitation/WishesSection';
import QRCodeSection from '@/components/invitation/QRCodeSection';
import SocialSharing from '@/components/invitation/SocialSharing';
import InvitationFooter from '@/components/invitation/InvitationFooter';
import InvitationSkeleton from '@/components/invitation/InvitationSkeleton';
import ErrorState from '@/components/invitation/ErrorState';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function AnimatedSection({ children, primaryColor }: { children: React.ReactNode; primaryColor: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}

export default function InvitationPage({ params }: PageProps) {
  const { slug } = React.use(params);
  const searchParams = useSearchParams();
  const guestParam = searchParams.get('guest');

  const { language, setLanguage } = useAppStore();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [storyEvents, setStoryEvents] = useState<StoryEvent[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [opened, setOpened] = useState(false);
  const [guestMaxGuests, setGuestMaxGuests] = useState<number>(4);

  useEffect(() => {
    async function load() {
      try {
        // First try to find by document ID matching the slug
        let snap = await getDoc(doc(db, 'invitations', slug));
        
        // If not found by ID, search by slug field
        if (!snap.exists()) {
          const slugQuery = await getDocs(query(collection(db, 'invitations'), where('slug', '==', slug)));
          if (!slugQuery.empty) {
            snap = slugQuery.docs[0];
          }
        }

        if (!snap.exists()) {
          setError('not_found');
          setLoading(false);
          return;
        }
        const data = { id: snap.id, ...snap.data() } as Invitation;
        if (data.status !== 'published') {
          setError('draft');
          setLoading(false);
          return;
        }
        setInvitation(data);

        if (data.language === 'ar') setLanguage('ar');
        else if (data.language === 'en') setLanguage('en');

        if (data.password && data.privacy === 'private') {
          setUnlocked(false);
        } else {
          setUnlocked(true);
        }

        const [eventsSnap, gallerySnap, storySnap, wishesSnap] = await Promise.all([
          getDocs(query(collection(db, 'events'), where('invitationId', '==', data.id))),
          data.galleryEnabled
            ? getDocs(query(collection(db, 'gallery'), where('invitationId', '==', data.id)))
            : Promise.resolve(null),
          data.storyEnabled
            ? getDocs(query(collection(db, 'storyEvents'), where('invitationId', '==', data.id)))
            : Promise.resolve(null),
          data.wishesEnabled
            ? getDocs(query(collection(db, 'wishes'), where('invitationId', '==', data.id), where('approved', '==', true)))
            : Promise.resolve(null),
        ]);

        setEvents(eventsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as WeddingEvent)));
        if (gallerySnap) setGalleryImages(gallerySnap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryImage)));
        if (storySnap) setStoryEvents(storySnap.docs.map((d) => ({ id: d.id, ...d.data() } as StoryEvent)));
        if (wishesSnap) setWishes(wishesSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Wish)));

        // Fetch guest's max guests limit if guest param is present
        if (guestParam) {
          // Try multiple approaches to find the guest
          // 1. Try by invitation document ID
          let guestSnap = await getDocs(query(
            collection(db, 'guests'), 
            where('invitationId', '==', data.id),
            where('name', '==', guestParam)
          ));
          
          // 2. If not found, try searching all guests for this invitation
          if (guestSnap.empty) {
            const allGuests = await getDocs(query(
              collection(db, 'guests'),
              where('invitationId', '==', data.id)
            ));
            const match = allGuests.docs.find(d => {
              const g = d.data();
              return g.name && g.name.toLowerCase() === guestParam.toLowerCase();
            });
            if (match) {
              const guestData = match.data();
              setGuestMaxGuests(guestData.maxGuests || 4);
            }
          } else {
            const guestData = guestSnap.docs[0].data();
            setGuestMaxGuests(guestData.maxGuests || 4);
          }
        }
      } catch {
        setError('load_error');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, setLanguage, guestParam]);

  const handlePassword = useCallback(
    async (password: string): Promise<boolean> => {
      if (invitation?.password === password) {
        setUnlocked(true);
        return true;
      }
      return false;
    },
    [invitation]
  );

  const handleRSVP = useCallback(
    async (data: Omit<RSVP, 'id' | 'invitationId' | 'createdAt'>) => {
      if (!invitation) return;
      try {
        await addDoc(collection(db, 'rsvps'), {
          invitationId: invitation.id,
          ...data,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error('RSVP error:', err);
        throw err;
      }
    },
    [invitation]
  );

  const handleWish = useCallback(
    async (data: { name: string; message: string }) => {
      if (!invitation) return;
      await addDoc(collection(db, 'wishes'), {
        invitationId: invitation.id,
        ...data,
        approved: false,
        createdAt: new Date().toISOString(),
      });
    },
    [invitation]
  );

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  if (loading) return <InvitationSkeleton />;
  if (error === 'not_found') return <ErrorState message={t('invitationNotFound', language)} language={language} />;
  if (error === 'draft') return <ErrorState message={language === 'ar' ? 'هذه الدعوة لم تُنشر بعد. يرجى النشر أولاً من لوحة التحكم.' : 'This invitation has not been published yet. Please publish it from the dashboard.'} language={language} />;
  if (error) return <ErrorState message={t('somethingWrong', language)} language={language} />;
  if (!invitation) return <InvitationSkeleton />;

  if (invitation.password && invitation.privacy === 'private' && !unlocked) {
    return (
      <PasswordGate
        onSubmit={handlePassword}
        language={language}
        primaryColor={invitation.primaryColor}
      />
    );
  }

  if (!opened) {
    return (
      <OpeningScreen
        groom={invitation.groom}
        bride={invitation.bride}
        groomAr={invitation.groomAr}
        brideAr={invitation.brideAr}
        date={invitation.date}
        language={language}
        primaryColor={invitation.primaryColor}
        onOpen={() => setOpened(true)}
      />
    );
  }

  const displayGroom = language === 'ar' && invitation.groomAr ? invitation.groomAr : invitation.groom;
  const displayBride = language === 'ar' && invitation.brideAr ? invitation.brideAr : invitation.bride;
  const displayDesc = language === 'ar' && invitation.descriptionAr ? invitation.descriptionAr : invitation.description;

  const sectionMap: Record<string, React.ReactNode> = {
    couple: (
      <AnimatedSection primaryColor={invitation.primaryColor}>
        <div className="py-16 text-center px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-px" style={{ backgroundColor: invitation.primaryColor }} />
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: invitation.primaryColor }}>
              {t('weddingOf', language)}
            </span>
            <div className="w-12 h-px" style={{ backgroundColor: invitation.primaryColor }} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-charcoal">
            {displayGroom} <span className="text-3xl">&</span> {displayBride}
          </h1>
          <p className="mt-4 text-gray-500 max-w-md mx-auto">{displayDesc}</p>
        </div>
      </AnimatedSection>
    ),
    countdown: invitation.countdownEnabled ? (
      <AnimatedSection primaryColor={invitation.primaryColor}>
        <CountdownTimer
          date={invitation.date}
          time={invitation.time}
          language={language}
          primaryColor={invitation.primaryColor}
        />
      </AnimatedSection>
    ) : null,
    details: (
      <AnimatedSection primaryColor={invitation.primaryColor}>
        <WeddingDetails
          date={invitation.date}
          time={invitation.time}
          venue={invitation.venue}
          venueAr={invitation.venueAr}
          venueAddress={invitation.venueAddress}
          venueAddressAr={invitation.venueAddressAr}
          language={language}
          primaryColor={invitation.primaryColor}
        />
      </AnimatedSection>
    ),
    schedule: invitation.scheduleEnabled ? (
      <AnimatedSection primaryColor={invitation.primaryColor}>
        <WeddingSchedule events={events} language={language} primaryColor={invitation.primaryColor} />
      </AnimatedSection>
    ) : null,
    story: invitation.storyEnabled ? (
      <AnimatedSection primaryColor={invitation.primaryColor}>
        <CoupleStory events={storyEvents} language={language} primaryColor={invitation.primaryColor} />
      </AnimatedSection>
    ) : null,
    venue: invitation.venueEnabled ? (
      <AnimatedSection primaryColor={invitation.primaryColor}>
        <VenueSection
          venue={invitation.venue}
          venueAr={invitation.venueAr}
          venueAddress={invitation.venueAddress}
          venueAddressAr={invitation.venueAddressAr}
          googleMapsUrl={invitation.googleMapsUrl}
          venueImageUrl={invitation.venueImageUrl}
          language={language}
          primaryColor={invitation.primaryColor}
        />
      </AnimatedSection>
    ) : null,
    gallery: invitation.galleryEnabled ? (
      <AnimatedSection primaryColor={invitation.primaryColor}>
        <PhotoGallery images={galleryImages} language={language} primaryColor={invitation.primaryColor} />
      </AnimatedSection>
    ) : null,
    rsvp: invitation.rsvpEnabled ? (
      <AnimatedSection primaryColor={invitation.primaryColor}>
        <RSVPForm invitationId={invitation.id} language={language} primaryColor={invitation.primaryColor} maxGuestsPerRsvp={guestMaxGuests} guestName={guestParam || undefined} onSubmit={handleRSVP} />
      </AnimatedSection>
    ) : null,
    wishes: invitation.wishesEnabled ? (
      <AnimatedSection primaryColor={invitation.primaryColor}>
        <WishesSection wishes={wishes} language={language} primaryColor={invitation.primaryColor} onSubmit={handleWish} />
      </AnimatedSection>
    ) : null,
    qr: (
      <AnimatedSection primaryColor={invitation.primaryColor}>
        <QRCodeSection slug={invitation.slug} language={language} primaryColor={invitation.primaryColor} />
      </AnimatedSection>
    ),
    share: (
      <AnimatedSection primaryColor={invitation.primaryColor}>
        <SocialSharing slug={invitation.slug} language={language} primaryColor={invitation.primaryColor} />
      </AnimatedSection>
    ),
    dresscode: invitation.dressCode ? (
      <AnimatedSection primaryColor={invitation.primaryColor}>
        <div className="py-8 px-4 text-center">
          <p className="text-sm text-gray-500">{t('dressCode', language)}</p>
          <p className="text-charcoal font-medium mt-1">
            {language === 'ar' && invitation.dressCodeAr ? invitation.dressCodeAr : invitation.dressCode}
          </p>
        </div>
      </AnimatedSection>
    ) : null,
    contact: invitation.contactInfo ? (
      <AnimatedSection primaryColor={invitation.primaryColor}>
        <div className="py-8 px-4 text-center">
          <p className="text-sm text-gray-500">{t('contactUs', language)}</p>
          <p className="text-charcoal font-medium mt-1">{invitation.contactInfo}</p>
        </div>
      </AnimatedSection>
    ) : null,
  };

  const sections = invitation.sectionOrder
    .map((key) => ({ key, node: sectionMap[key] }))
    .filter((s) => s.node);

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen"
      style={{
        fontFamily: invitation.fontFamily ? `${invitation.fontFamily}, sans-serif` : undefined,
        background: invitation.primaryColor ? `linear-gradient(180deg, ${invitation.primaryColor}05, white)` : undefined,
      }}
    >
      <LanguageSwitcher language={language} onToggle={toggleLanguage} />
      <MusicPlayer musicUrl={invitation.musicUrl} primaryColor={invitation.primaryColor} />

      <main>
        {guestParam && (
          <div className="py-4 text-center">
            <span className="text-sm" style={{ color: invitation.primaryColor }}>
              {t('dear', language)} {guestParam}
            </span>
            <p className="text-xs text-gray-400 mt-1">{t('wouldBeDelighted', language)}</p>
          </div>
        )}

        {sections.map((s) => (
          <div key={s.key}>{s.node}</div>
        ))}

        <InvitationFooter primaryColor={invitation.primaryColor} />
      </main>
    </div>
  );
}
