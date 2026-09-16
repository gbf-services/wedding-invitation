import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invitationId, name, message } = body;

    if (!invitationId || !name || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const docRef = await addDoc(collection(db, 'wishes'), {
      invitationId,
      name,
      message,
      approved: false,
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

    const snap = await getDocs(
      query(
        collection(db, 'wishes'),
        where('invitationId', '==', invitationId),
        where('approved', '==', true)
      )
    );
    const wishes = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return NextResponse.json({ wishes });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
