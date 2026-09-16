'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, Play, Pause, Music, Check } from 'lucide-react';
import type { MusicTrack } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MusicManagerProps {
  tracks: MusicTrack[];
  onUpload: (file: File) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onSelect: (url: string) => Promise<void>;
}

export default function MusicManager({
  tracks,
  onUpload,
  onDelete,
  onSelect,
}: MusicManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      audio?.pause();
    };
  }, [audio]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUpload(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const togglePlay = (track: MusicTrack) => {
    if (playingId === track.id) {
      audio?.pause();
      setPlayingId(null);
    } else {
      audio?.pause();
      const newAudio = new Audio(track.audioUrl);
      newAudio.play();
      newAudio.onended = () => setPlayingId(null);
      setAudio(newAudio);
      setPlayingId(track.id);
    }
  };

  const selectedTrack = tracks.find((t) => t.isDefault);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif text-charcoal">Music</h1>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-white text-sm font-medium rounded-full hover:bg-gold-dark transition-colors shadow-lg shadow-gold/20"
        >
          <Upload className="w-4 h-4" />
          Upload Music
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {tracks.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-gold/10">
          <Music className="w-16 h-16 text-charcoal/10 mx-auto mb-4" />
          <p className="text-charcoal/40 mb-4">No music tracks uploaded yet</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold/10 text-gold text-sm font-medium rounded-full hover:bg-gold/20 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload your first track
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {tracks.map((track) => (
            <motion.div
              key={track.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'flex items-center gap-4 p-4 bg-white rounded-xl border transition-all',
                selectedTrack?.id === track.id
                  ? 'border-gold/40 shadow-md shadow-gold/5'
                  : 'border-gold/10'
              )}
            >
              <button
                onClick={() => togglePlay(track)}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
                  playingId === track.id
                    ? 'bg-gold text-white'
                    : 'bg-gold/10 text-gold hover:bg-gold/20'
                )}
              >
                {playingId === track.id ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-charcoal truncate">
                  {track.name}
                </p>
                {selectedTrack?.id === track.id && (
                  <p className="text-xs text-gold mt-0.5">Currently selected</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedTrack?.id !== track.id && (
                  <button
                    onClick={() => onSelect(track.audioUrl)}
                    className="px-3 py-1.5 text-xs font-medium text-gold bg-gold/10 rounded-full hover:bg-gold/20 transition-colors"
                  >
                    Select
                  </button>
                )}
                {selectedTrack?.id === track.id && (
                  <span className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 rounded-full">
                    <Check className="w-3 h-3" />
                    Active
                  </span>
                )}
                <button
                  onClick={() => onDelete(track.id)}
                  className="p-2 text-charcoal/30 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
