'use client';

import { useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface MusicPlayerProps {
  musicUrl?: string;
  primaryColor?: string;
}

export default function MusicPlayer({ musicUrl, primaryColor = '#C9A96E' }: MusicPlayerProps) {
  const { musicPlaying, setMusicPlaying } = useAppStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (musicUrl && audioRef.current) {
      if (musicPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [musicPlaying, musicUrl]);

  if (!musicUrl) return null;

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop />
      <button
        onClick={() => setMusicPlaying(!musicPlaying)}
        className="fixed top-4 right-4 z-50 bg-white/80 backdrop-blur-md border border-gold/20 rounded-full w-12 h-12 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
      >
        {musicPlaying ? (
          <Volume2 className="w-5 h-5" style={{ color: primaryColor }} />
        ) : (
          <VolumeX className="w-5 h-5 text-gray-400" />
        )}
      </button>
    </>
  );
}
