'use client';

export default function InvitationSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-white">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="w-16 h-16 rounded-full skeleton mb-6" />
        <div className="w-32 h-4 skeleton mb-4" />
        <div className="w-64 h-8 skeleton mb-3" />
        <div className="w-40 h-4 skeleton mb-8" />
        <div className="w-48 h-12 rounded-full skeleton" />
      </div>
    </div>
  );
}
