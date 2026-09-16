'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronUp, ChevronDown, Users } from 'lucide-react';
import type { RSVP } from '@/lib/types';
import type { Language } from '@/lib/translations';
import { t } from '@/lib/translations';
import { formatDate, cn } from '@/lib/utils';

interface GuestListProps {
  rsvps: RSVP[];
  language: Language;
}

type SortField = 'createdAt' | 'guestName' | 'guestCount';
type SortDir = 'asc' | 'desc';

export default function GuestList({ rsvps, language }: GuestListProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'yes' | 'no' | 'maybe'>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const filtered = useMemo(() => {
    let result = [...rsvps];

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.guestName.toLowerCase().includes(lower) ||
          r.message?.toLowerCase().includes(lower)
      );
    }

    if (filter !== 'all') {
      result = result.filter((r) => r.attending === filter);
    }

    result.sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      if (sortField === 'createdAt') {
        aVal = a.createdAt;
        bVal = b.createdAt;
      } else if (sortField === 'guestName') {
        aVal = a.guestName;
        bVal = b.guestName;
      } else {
        aVal = a.guestCount;
        bVal = b.guestCount;
      }
      if (sortField === 'guestCount') {
        return sortDir === 'asc'
          ? (aVal as number) - (bVal as number)
          : (bVal as number) - (aVal as number);
      }
      return sortDir === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    return result;
  }, [rsvps, search, filter, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? (
      <ChevronUp className="w-3 h-3" />
    ) : (
      <ChevronDown className="w-3 h-3" />
    );
  };

  const attendanceColors = {
    yes: 'bg-green-100 text-green-700',
    no: 'bg-red-100 text-red-700',
    maybe: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif text-charcoal">
          {t('guests', language)}
        </h1>
        <span className="text-sm text-charcoal/50">
          {filtered.length} {t('guests', language).toLowerCase()}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
          <input
            type="text"
            placeholder={t('search', language)}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gold/15 bg-white focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="px-4 py-2.5 text-sm rounded-xl border border-gold/15 bg-white focus:border-gold outline-none transition-all"
        >
          <option value="all">{t('all', language)}</option>
          <option value="yes">{t('attending', language)}</option>
          <option value="no">{t('notAttending', language)}</option>
          <option value="maybe">{t('maybeAttend', language)}</option>
        </select>
      </div>

      <div className="hidden md:block bg-white rounded-2xl border border-gold/10 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gold/10">
              <th
                onClick={() => toggleSort('guestName')}
                className="text-left px-5 py-3 text-xs font-medium text-charcoal/50 uppercase tracking-wider cursor-pointer hover:text-gold transition-colors"
              >
                <span className="flex items-center gap-1">
                  {t('name', language)} <SortIcon field="guestName" />
                </span>
              </th>
              <th
                onClick={() => toggleSort('guestCount')}
                className="text-left px-5 py-3 text-xs font-medium text-charcoal/50 uppercase tracking-wider cursor-pointer hover:text-gold transition-colors"
              >
                <span className="flex items-center gap-1">
                  {t('guest', language)} <SortIcon field="guestCount" />
                </span>
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-charcoal/50 uppercase tracking-wider">
                {t('attendance', language)}
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-charcoal/50 uppercase tracking-wider">
                {t('meal', language)}
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-charcoal/50 uppercase tracking-wider">
                {t('message', language)}
              </th>
              <th
                onClick={() => toggleSort('createdAt')}
                className="text-left px-5 py-3 text-xs font-medium text-charcoal/50 uppercase tracking-wider cursor-pointer hover:text-gold transition-colors"
              >
                <span className="flex items-center gap-1">
                  {t('dateSubmitted', language)} <SortIcon field="createdAt" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/5">
            {filtered.map((rsvp) => (
              <tr key={rsvp.id} className="hover:bg-cream/30 transition-colors">
                <td className="px-5 py-3.5 text-sm font-medium text-charcoal">
                  {rsvp.guestName}
                </td>
                <td className="px-5 py-3.5 text-sm text-charcoal/60">
                  {rsvp.guestCount}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-medium',
                      attendanceColors[rsvp.attending]
                    )}
                  >
                    {rsvp.attending === 'yes'
                      ? t('willAttend', language)
                      : rsvp.attending === 'no'
                      ? t('cannotAttend', language)
                      : t('maybeAttend', language)}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm text-charcoal/60">
                  {rsvp.meal || '-'}
                </td>
                <td className="px-5 py-3.5 text-sm text-charcoal/60 max-w-[200px] truncate">
                  {rsvp.message || '-'}
                </td>
                <td className="px-5 py-3.5 text-sm text-charcoal/50">
                  {formatDate(rsvp.createdAt, language)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Users className="w-12 h-12 text-charcoal/10 mx-auto mb-3" />
            <p className="text-sm text-charcoal/40">{t('noResults', language)}</p>
          </div>
        )}
      </div>

      <div className="md:hidden space-y-3">
        {filtered.map((rsvp) => (
          <div
            key={rsvp.id}
            className="p-4 bg-white rounded-xl border border-gold/10"
          >
            <div className="flex items-start justify-between mb-2">
              <p className="font-medium text-charcoal">{rsvp.guestName}</p>
              <span
                className={cn(
                  'px-2.5 py-1 rounded-full text-xs font-medium',
                  attendanceColors[rsvp.attending]
                )}
              >
                {rsvp.attending === 'yes'
                  ? t('willAttend', language)
                  : rsvp.attending === 'no'
                  ? t('cannotAttend', language)
                  : t('maybeAttend', language)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-charcoal/60">
              <div>{t('guest', language)}: {rsvp.guestCount}</div>
              <div>{t('meal', language)}: {rsvp.meal || '-'}</div>
            </div>
            {rsvp.message && (
              <p className="mt-2 text-sm text-charcoal/50 truncate">
                {rsvp.message}
              </p>
            )}
            <p className="mt-2 text-xs text-charcoal/30">
              {formatDate(rsvp.createdAt, language)}
            </p>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Users className="w-12 h-12 text-charcoal/10 mx-auto mb-3" />
            <p className="text-sm text-charcoal/40">{t('noResults', language)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
