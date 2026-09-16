'use client';

import { useEffect, useState, useRef } from 'react';
import { collection, query, where, getDocs, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { GalleryImage } from '@/lib/types';
import { Upload, Trash2, ImageIcon, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function GalleryManager() {
  const { user, language } = useAppStore();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [invitationId, setInvitationId] = useState('');
  const [hasInvitation, setHasInvitation] = useState<boolean | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const invSnap = await getDocs(query(collection(db, 'invitations'), where('ownerId', '==', user!.id)));
        if (!invSnap.empty) {
          const id = invSnap.docs[0].id;
          setInvitationId(id);
          setHasInvitation(true);
          const imgSnap = await getDocs(query(collection(db, 'gallery'), where('invitationId', '==', id)));
          setImages(imgSnap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryImage)));
        } else {
          setHasInvitation(false);
        }
      } catch (err) {
        console.error('Error loading gallery:', err);
        toast.error('Failed to load gallery');
      }
    }
    load();
  }, [user]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!invitationId) {
      toast.error('Please create an invitation first in the Editor');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Max 10MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, `gallery/${invitationId}/${fileName}`);
      
      toast.loading('Uploading...', { id: 'upload' });
      
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      const docRef = await addDoc(collection(db, 'gallery'), {
        invitationId,
        imageUrl: url,
        caption: file.name,
        order: images.length,
        createdAt: new Date().toISOString(),
      });
      
      setImages((prev) => [...prev, { 
        id: docRef.id, 
        invitationId, 
        imageUrl: url, 
        caption: file.name, 
        order: images.length, 
        createdAt: new Date().toISOString() 
      }]);
      
      toast.success('Photo uploaded!', { id: 'upload' });
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Upload failed. Check your connection and try again.', { id: 'upload' });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'gallery', id));
      setImages((prev) => prev.filter((img) => img.id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  if (hasInvitation === false) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-gold/10 text-center">
        <AlertCircle className="w-12 h-12 text-gold mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-charcoal mb-2">Create an invitation first</h3>
        <p className="text-gray-500 mb-6">You need to create an invitation before uploading photos.</p>
        <Link
          href="/dashboard/editor"
          className="inline-flex items-center gap-2 bg-gold text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gold-dark transition-colors"
        >
          Go to Editor
        </Link>
      </div>
    );
  }

  if (hasInvitation === null) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif font-bold text-charcoal">{t('gallery', language)}</h2>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-gold text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gold-dark transition-colors disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : t('uploadPhoto', language)}
        </button>
      </div>

      {images.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gold/10 text-center">
          <ImageIcon className="w-12 h-12 text-gold/30 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No photos yet. Upload your first photo!</p>
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 bg-gold/10 text-gold px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gold/20 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-gold/10">
              <img src={img.imageUrl} alt={img.caption || ''} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleDelete(img.id)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
