export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  role: 'user' | 'admin' | 'superadmin';
  createdAt: string;
}

export interface Invitation {
  id: string;
  ownerId: string;
  slug: string;
  status: 'draft' | 'published' | 'archived' | 'suspended';
  language: 'en' | 'ar' | 'both';
  theme: string;
  bride: string;
  groom: string;
  brideAr?: string;
  groomAr?: string;
  date: string;
  time: string;
  venue: string;
  venueAr?: string;
  venueAddress: string;
  venueAddressAr?: string;
  description: string;
  descriptionAr?: string;
  dressCode?: string;
  dressCodeAr?: string;
  contactInfo?: string;
  googleMapsUrl?: string;
  venueImageUrl?: string;
  coverImageUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  privacy: 'public' | 'private';
  password?: string;
  guestPersonalization: boolean;
  maxGuests?: number;
  maxGuestsPerRsvp?: number;
  rsvpEnabled: boolean;
  wishesEnabled: boolean;
  galleryEnabled: boolean;
  storyEnabled: boolean;
  scheduleEnabled: boolean;
  venueEnabled: boolean;
  countdownEnabled: boolean;
  sectionOrder: string[];
  plan: 'free' | 'premium' | 'luxury';
  musicUrl?: string;
  musicName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeddingEvent {
  id: string;
  invitationId: string;
  title: string;
  titleAr?: string;
  time: string;
  description?: string;
  descriptionAr?: string;
  order: number;
}

export interface GalleryImage {
  id: string;
  invitationId: string;
  imageUrl: string;
  caption?: string;
  captionAr?: string;
  order: number;
  createdAt: string;
}

export interface RSVP {
  id: string;
  invitationId: string;
  guestName: string;
  guestCount: number;
  attending: 'yes' | 'no' | 'maybe';
  meal?: string;
  message?: string;
  createdAt: string;
}

export interface Wish {
  id: string;
  invitationId: string;
  name: string;
  message: string;
  approved: boolean;
  createdAt: string;
}

export interface MusicTrack {
  id: string;
  invitationId: string;
  name: string;
  audioUrl: string;
  isDefault: boolean;
}

export interface Guest {
  id: string;
  invitationId: string;
  name: string;
  email?: string;
  maxGuests: number;
  personalizedSlug: string;
}

export interface StoryEvent {
  id: string;
  invitationId: string;
  year: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  imageUrl?: string;
  order: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  features: string[];
  featuresAr: string[];
  highlighted: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'rsvp' | 'wish' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export type ThemeId = 'elegant' | 'luxury' | 'romantic' | 'minimal' | 'arabic-luxury';

export interface Theme {
  id: ThemeId;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  thumbnail: string;
  defaults: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    background: string;
  };
}
