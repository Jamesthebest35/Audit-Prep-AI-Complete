import React from 'react';
import type { NoteFilter, Notebook, Tag } from '../../types';
import {
  ArchiveIcon,
  CalendarIcon,
  NotebookIcon,
  PlusIcon,
  StackIcon,
  StarSolidIcon,
  TagIcon,
} from '../shared/Icon';

interface SidebarProps {
  notebooks: Notebook[];
  tags: Tag[];
  activeFilter: NoteFilter;
  activeNotebookId: string | null;
  activeTagId: string | null;
  noteCounts: {
    all: number;
    favorites: number;
    today: number;
    archived: number;
    byNotebook: Record<string, number>;
    byTag: Record<string, number>;
  };
  onSelectFilter: (filter: NoteFilter) => void;
  onSelectNotebook: (notebookId: string) => void;
  onSelectTag: (tagId: string) => void;
  onCreateNote: (notebookId?: string | null) => void;
}

const quickFilters: Array<{
  id: NoteFilter;
  label: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}> = [
  {
    id: 'all',
    label: 'All Notes',
    description: 'Every active idea across your workspace.',
    icon: StackIcon,
  },
  {
    id: 'favorites',
    label: 'Favorites',
    description: 'Starred notes stay within reach.',
    icon: StarSolidIcon,
  },
  {
    id: 'today',
    label: 'Today',
    description: 'Notes you touched in the last day.',
    icon: CalendarIcon,
  },
  {
    id: 'archived',
    label: 'Archive',
    description: 'Notes you have intentionally tucked away.',
    icon: ArchiveIcon,
  },
];

const withAlpha = (hex: string, alpha: string) => {
  if (!hex || hex.length !== 7 || !alpha) {
    return hex;
  }
  return `${hex}${alpha}`;
};

export const Sidebar: React.FC<SidebarProps> = ({
  notebooks,
  tags,
  activeFilter,
  activeNotebookId,
  activeTagId,
  noteCounts,
  onSelectFilter,
  onSelectNotebook,
  onSelectTag,
  onCreateNote,
}) => {
  return (
    <aside className="flex w-72 flex-col border-r border-slate-200 bg-slate-900 text-slate-100">
      <div className="px-6 pb-6 pt-8 border-b border-slate-800">
        <p className="text-xs uppercase tracking-[0.45em] text-slate-500">Aurora</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Notes Studio</h1>
        <p className="mt-2 text-sm text-slate-400">
          Capture ideas, connect threads, and keep your thinking in flow.
        </p>
        <button
          type="button"
          onClick={() => onCreateNote(activeNotebookId)}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          <PlusIcon className="h-4 w-4" />
          New note
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-5 pb-6 pt-6">
        <section>
          <h2 className="text-xs uppercase tracking-[0.3em] text-slate-500">Quick views</h2>
          <ul className="mt-3 space-y-2">
            {quickFilters.map((filter) => {
              const isActive = activeFilter === filter.id;
              const Icon = filter.icon;
              const count =
                filter.id === 'all'
                  ? noteCounts.all
                  : filter.id === 'favorites'
                    ? noteCounts.favorites
                    : filter.id === 'today'
                      ? noteCounts.today
                      : noteCounts.archived;

              return (
                <li key={filter.id}>
                  <button
                    type="button"
                    onClick={() => onSelectFilter(filter.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition ${
                      isActive ? 'bg-white/15 text-white shadow-inner shadow-white/5' : 'hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-md ${
                          isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{filter.label}</p>
                        <p className="text-xs text-slate-400">{filter.description}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-semibold text-slate-200">
                      {count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-[0.3em] text-slate-500">Notebooks</h2>
            <button
              type="button"
              onClick={() => onCreateNote(null)}
              className="text-xs font-semibold text-slate-400 transition hover:text-white"
            >
              + Quick note
            </button>
          </div>
          <ul className="mt-3 space-y-2">
            {notebooks.map((notebook) => {
              const isActive = activeNotebookId === notebook.id;
              const count = noteCounts.byNotebook[notebook.id] ?? 0;
              return (
                <li key={notebook.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => onSelectNotebook(notebook.id)}
                    className={`flex w-full items-start justify-between rounded-lg px-3 py-2 text-left transition ${
                      isActive ? 'bg-white/15 text-white shadow-inner shadow-white/5' : 'hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-1 flex h-8 w-8 items-center justify-center rounded-md ${
                          isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'
                        }`}
                      >
                        <NotebookIcon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{notebook.name}</p>
                        {notebook.description && (
                          <p className="text-xs text-slate-400">{notebook.description}</p>
                        )}
                      </div>
                    </div>
                    <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-semibold text-slate-200">
                      {count}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onCreateNote(notebook.id);
                    }}
                    className="absolute -right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-1 text-slate-100 backdrop-blur transition hover:bg-white/20 group-hover:flex"
                    aria-label={`Create note in ${notebook.name}`}
                  >
                    <PlusIcon className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xs uppercase tracking-[0.3em] text-slate-500">Tags</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => {
              const isActive = activeTagId === tag.id;
              const count = noteCounts.byTag[tag.id] ?? 0;
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => onSelectTag(tag.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    isActive ? 'border-white bg-white text-slate-900' : 'border-transparent bg-white/10 text-slate-200 hover:bg-white/15'
                  }`}
                  style={
                    isActive
                      ? {}
                      : {
                          backgroundColor: withAlpha(tag.color, '20'),
                          color: tag.color,
                        }
                  }
                >
                  <TagIcon className="h-3.5 w-3.5" />
                  {tag.name}
                  <span className="rounded-full bg-black/10 px-1.5 py-0.5 text-[10px] font-semibold">
                    {count}
                  </span>
                </button>
              );
            })}
            {tags.length === 0 && (
              <p className="text-xs text-slate-500">Tag notes from the editor to see them here.</p>
            )}
          </div>
        </section>
      </nav>

      <footer className="border-t border-slate-800 px-6 py-5 text-xs text-slate-400">
        <p className="font-semibold text-slate-300">
          {noteCounts.all + noteCounts.archived} notes tracked
        </p>
        <p className="mt-1 text-slate-500">
          Favorites spotlight your most important thinking. Archive anything you want to keep but move
          out of sight.
        </p>
      </footer>
    </aside>
  );
};
