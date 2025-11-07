import React from 'react';
import type { SortOption } from '../../types';
import { PlusIcon, SearchIcon } from '../shared/Icon';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreateNote: () => void;
  sortOption: SortOption;
  onSortChange: (value: SortOption) => void;
  visibleCount: number;
  totalCount: number;
  syncStatus: string;
}

const sortLabels: Record<SortOption, string> = {
  updated: 'Last edited',
  created: 'Created date',
  title: 'Title A → Z',
};

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onCreateNote,
  sortOption,
  onSortChange,
  visibleCount,
  totalCount,
  syncStatus,
}) => {
  return (
    <header className="flex h-20 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Workspace</h2>
        <p className="mt-1 text-sm text-slate-500">
          Showing {visibleCount} of {totalCount} active notes • {syncStatus}
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-72">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search notes, tags, notebooks…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-700 shadow-inner focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/40"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-500">
            <span className="text-xs uppercase tracking-wide text-slate-400">Sort</span>
            <select
              value={sortOption}
              onChange={(event) => onSortChange(event.target.value as SortOption)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400/40"
            >
              {Object.entries(sortLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={onCreateNote}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
          >
            <PlusIcon className="h-4 w-4" />
            New note
          </button>
        </div>
      </div>
    </header>
  );
};