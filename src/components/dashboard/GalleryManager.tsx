'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, ArrowUp, ArrowDown, Image as ImageIcon } from 'lucide-react';
import type { GalleryImage } from '@/lib/types';

interface GalleryManagerProps {
  images: GalleryImage[];
  onUpload: (file: File) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onReorder: (id: string, direction: 'up' | 'down') => Promise<void>;
}

export default function GalleryManager({
  images,
  onUpload,
  onDelete,
  onReorder,
}: GalleryManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sorted = [...images].sort((a, b) => a.order - b.order);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUpload(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif text-charcoal">Gallery</h1>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-white text-sm font-medium rounded-full hover:bg-gold-dark transition-colors shadow-lg shadow-gold/20"
        >
          <Upload className="w-4 h-4" />
          Upload Photo
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {sorted.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-gold/10">
          <ImageIcon className="w-16 h-16 text-charcoal/10 mx-auto mb-4" />
          <p className="text-charcoal/40 mb-4">No photos uploaded yet</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold/10 text-gold text-sm font-medium rounded-full hover:bg-gold/20 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload your first photo
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {sorted.map((image, index) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative aspect-square rounded-xl overflow-hidden bg-cream border border-gold/10"
            >
              <img
                src={image.imageUrl}
                alt={image.caption || ''}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onReorder(image.id, 'up')}
                    disabled={index === 0}
                    className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowUp className="w-4 h-4 text-charcoal" />
                  </button>
                  <button
                    onClick={() => onReorder(image.id, 'down')}
                    disabled={index === sorted.length - 1}
                    className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowDown className="w-4 h-4 text-charcoal" />
                  </button>
                  <button
                    onClick={() => onDelete(image.id)}
                    className="p-2 bg-red-500/90 rounded-lg hover:bg-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                  <p className="text-xs text-white truncate">{image.caption}</p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
