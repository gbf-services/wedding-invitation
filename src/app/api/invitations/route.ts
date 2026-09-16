import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ownerId, slug, bride, groom, date, time, venue } = body;

    if (!ownerId || !slug || !bride || !groom) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await getDocs(query(collection(db, 'invitations'), where('slug', '==', slug)));
    if (!existing.empty) {
      return NextResponse.json({ error: 'Slug already taken' }, { status: 409 });
    }

    const docRef = await addDoc(collection(db, 'invitations'), {
      ownerId,
      slug,
      bride,
      groom,
      date: date || '',
      time: time || '',
      venue: venue || '',
      venueAddress: '',
      description: '',
      primaryColor: '#C9A96E',
      secondaryColor: '#F5F0E8',
      fontFamily: 'Playfair Display',
      theme: 'elegant',
      status: 'draft',
      language: 'both',
      privacy: 'public',
      guestPersonalization: false,
      rsvpEnabled: true,
      wishesEnabled: true,
      galleryEnabled: true,
      storyEnabled: true,
      scheduleEnabled: true,
      venueEnabled: true,
      countdownEnabled: true,
      sectionOrder: ['couple', 'countdown', 'details', 'schedule', 'story', 'venue', 'gallery', 'rsvp', 'wishes', 'qr', 'share', 'dresscode', 'contact'],
      plan: 'free',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: docRef.id, success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');

    if (!ownerId) {
      return NextResponse.json({ error: 'ownerId is required' }, { status: 400 });
    }

    const snap = await getDocs(query(collection(db, 'invitations'), where('ownerId', '==', ownerId)));
    const invitations = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return NextResponse.json({ invitations });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
