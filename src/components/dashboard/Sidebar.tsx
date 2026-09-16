'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Pencil,
  Image,
  Music,
  Users,
  Settings,
  LogOut,
  Heart,
  X,
  ChevronLeft,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn, getInitials } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/editor', label: 'Editor', icon: Pencil },
  { href: '/dashboard/gallery', label: 'Gallery', icon: Image },
  { href: '/dashboard/music', label: 'Music', icon: Music },
  { href: '/dashboard/guests', label: 'Guests', icon: Users },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, user } = useAppStore();

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-40 w-[260px] bg-white border-r border-gold/10 flex flex-col"
          >
            <div className="flex items-center justify-between h-16 px-5 border-b border-gold/10">
              <Link href="/" className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-gold fill-gold" />
                <span className="font-bold font-serif text-charcoal">WeddingInv</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 rounded-lg text-charcoal/50 hover:text-charcoal hover:bg-cream transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-gold/10 text-gold'
                        : 'text-charcoal/60 hover:text-charcoal hover:bg-cream/50'
                    )}
                  >
                    <item.icon
                      className={cn('w-5 h-5', isActive ? 'text-gold' : 'text-charcoal/40')}
                    />
                    {item.label}
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-gold/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center text-sm font-semibold text-gold">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(user?.name || 'U')
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-charcoal/40 truncate">
                    {user?.email || ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {}}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-charcoal/50 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={cn(
          'fixed top-4 z-50 p-2 rounded-xl bg-white border border-gold/10 shadow-sm text-charcoal/60 hover:text-charcoal hover:bg-cream transition-all',
          sidebarOpen ? 'left-[276px]' : 'left-4'
        )}
      >
        <ChevronLeft
          className={cn(
            'w-5 h-5 transition-transform',
            !sidebarOpen && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-charcoal/20 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
