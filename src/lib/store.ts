import { create } from 'zustand';
import { Language } from './translations';
import { Invitation, User, WeddingEvent, GalleryImage, RSVP, Wish, StoryEvent, Guest } from './types';

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  currentInvitation: Invitation | null;
  setCurrentInvitation: (invitation: Invitation | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  events: WeddingEvent[];
  setEvents: (events: WeddingEvent[]) => void;
  galleryImages: GalleryImage[];
  setGalleryImages: (images: GalleryImage[]) => void;
  rsvps: RSVP[];
  setRsvps: (rsvps: RSVP[]) => void;
  wishes: Wish[];
  setWishes: (wishes: Wish[]) => void;
  storyEvents: StoryEvent[];
  setStoryEvents: (events: StoryEvent[]) => void;
  guests: Guest[];
  setGuests: (guests: Guest[]) => void;
  musicPlaying: boolean;
  setMusicPlaying: (playing: boolean) => void;
  invitationOpened: boolean;
  setInvitationOpened: (opened: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  language: 'en',
  setLanguage: (language) => set({ language }),
  currentInvitation: null,
  setCurrentInvitation: (currentInvitation) => set({ currentInvitation }),
  sidebarOpen: true,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  events: [],
  setEvents: (events) => set({ events }),
  galleryImages: [],
  setGalleryImages: (galleryImages) => set({ galleryImages }),
  rsvps: [],
  setRsvps: (rsvps) => set({ rsvps }),
  wishes: [],
  setWishes: (wishes) => set({ wishes }),
  storyEvents: [],
  setStoryEvents: (storyEvents) => set({ storyEvents }),
  guests: [],
  setGuests: (guests) => set({ guests }),
  musicPlaying: false,
  setMusicPlaying: (musicPlaying) => set({ musicPlaying }),
  invitationOpened: false,
  setInvitationOpened: (invitationOpened) => set({ invitationOpened }),
}));
