import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invitationId, guestName, guestCount, attending, meal, message } = body;

    if (!invitationId || !guestName || !attending) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const docRef = await addDoc(collection(db, 'rsvps'), {
      invitationId,
      guestName,
      guestCount: guestCount || 1,
      attending,
      meal: meal || null,
      message: message || null,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: docRef.id, success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get('invitationId');

    if (!invitationId) {
      return NextResponse.json({ error: 'invitationId is required' }, { status: 400 });
    }

    const snap = await getDocs(query(collection(db, 'rsvps'), where('invitationId', '==', invitationId)));
    const rsvps = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return NextResponse.json({ rsvps });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
