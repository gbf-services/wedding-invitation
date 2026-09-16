'use client';

import { useEffect, useState, useRef } from 'react';
import { collection, query, where, getDocs, doc, setDoc, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { MusicTrack } from '@/lib/types';
import { Upload, Play, Pause, Music, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MusicManager() {
  const { user, language } = useAppStore();
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState('');
  const [uploading, setUploading] = useState(false);
  const [invitationId, setInvitationId] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const invSnap = await getDocs(query(collection(db, 'invitations'), where('ownerId', '==', user!.id)));
      if (!invSnap.empty) {
        const inv = invSnap.docs[0].data();
        setInvitationId(invSnap.docs[0].id);
        setCurrentTrack(inv.musicUrl || '');
        const trackSnap = await getDocs(query(collection(db, 'music'), where('invitationId', '==', invSnap.docs[0].id)));
        setTracks(trackSnap.docs.map((d) => ({ id: d.id, ...d.data() } as MusicTrack)));
      }
    }
    load();
  }, [user]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !invitationId) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `music/${invitationId}/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      const docRef = await addDoc(collection(db, 'music'), {
        invitationId,
        name: file.name,
        audioUrl: url,
        isDefault: false,
      });
      setTracks((prev) => [...prev, { id: docRef.id, invitationId, name: file.name, audioUrl: url, isDefault: false }]);
      toast.success('Music uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const selectTrack = async (track: MusicTrack) => {
    if (!invitationId) return;
    setCurrentTrack(track.audioUrl);
    await setDoc(doc(db, 'invitations', invitationId), { musicUrl: track.audioUrl, musicName: track.name }, { merge: true });
    toast.success('Music selected');
  };

  const togglePlay = (track: MusicTrack) => {
    if (playing === track.id) {
      audioRef.current?.pause();
      setPlaying(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(track.audioUrl);
      audioRef.current.play();
      audioRef.current.onended = () => setPlaying(null);
      setPlaying(track.id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif font-bold text-charcoal">{t('music', language)}</h2>
        <input ref={fileRef} type="file" accept="audio/*" onChange={handleUpload} className="hidden" />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-gold text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gold-dark transition-colors disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          {uploading ? '...' : t('uploadMusic', language)}
        </button>
      </div>

      {tracks.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gold/10 text-center">
          <Music className="w-12 h-12 text-gold/30 mx-auto mb-3" />
          <p className="text-gray-500">No music tracks yet. Upload your first track!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tracks.map((track) => (
            <div
              key={track.id}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                currentTrack === track.audioUrl ? 'border-gold bg-gold/5' : 'border-gold/10 bg-white'
              }`}
            >
              <button
                onClick={() => togglePlay(track)}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gold/10 hover:bg-gold/20 transition-colors"
              >
                {playing === track.id ? <Pause className="w-4 h-4 text-gold" /> : <Play className="w-4 h-4 text-gold ml-0.5" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-charcoal truncate">{track.name}</p>
              </div>
              {currentTrack === track.audioUrl ? (
                <span className="text-xs text-gold font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" /> Selected
                </span>
              ) : (
                <button
                  onClick={() => selectTrack(track)}
                  className="text-xs text-gold font-medium hover:text-gold-dark transition-colors"
                >
                  {t('selectMusic', language)}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
