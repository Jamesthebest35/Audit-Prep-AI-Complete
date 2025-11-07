import React, { useMemo } from 'react';
import type { Note, Notebook, NoteFilter, Tag } from '../../types';
import {
  ArchiveIcon,
  CalendarIcon,
  ClockIcon,
  NotebookIcon,
  PlusIcon,
  PinIcon,
  StackIcon,
  StarOutlineIcon,
  StarSolidIcon,
  TagIcon,
} from '../shared/Icon';

interface NoteListProps {
  pinnedNotes: Note[];
  notes: Note[];
  tags: Tag[];
  notebooks: Notebook[];
  activeFilter: NoteFilter;
  selectedNoteId: string | null;
  onSelectNote: (noteId: string) => void;
  onTogglePin: (noteId: string) => void;
  onToggleFavorite: (noteId: string) => void;
  onArchiveNote: (noteId: string, archive: boolean) => void;
  onCreateNote: () => void;
}

const formatRelativeTime = (isoTimestamp: string) => {
  const target = new Date(isoTimestamp);
  if (Number.isNaN(target.getTime())) {
    return 'moments ago';
  }
  const diffMs = Date.now() - target.getTime();
  const minutes = Math.round(diffMs / (1000 * 60));
  if (minutes <= 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return target.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
};

const previewFromContent = (content: string) => {
  const normalized = content
    .replace(/[#*_>\-\[\]\(\)`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!normalized) {
    return 'Start writing to see a preview here.';
  }
  return normalized.length > 140 ? `${normalized.slice(0, 137)}…` : normalized;
};

const filterHeading: Record<
  NoteFilter,
  { title: string; subtitle: string }
> = {
  all: {
    title: 'All Notes',
    subtitle: 'Every active note across notebooks.',
  },
  favorites: {
    title: 'Favorites',
    subtitle: 'Star a note to pin it to this list.',
  },
  today: {
    title: 'Today',
    subtitle: 'Everything you touched in the last 24 hours.',
  },
  archived: {
    title: 'Archive',
    subtitle: 'Notes you have intentionally tucked away.',
  },
};

const emptyStates: Record<
  NoteFilter,
  { title: string; description: string; actionLabel: string }
> = {
  all: {
    title: 'Capture your next idea',
    description: 'Notes you create will show up here. Start with a quick idea or a detailed outline.',
    actionLabel: 'Create your first note',
  },
  favorites: {
    title: 'No favorites yet',
    description: 'Star the notes you revisit often and we will keep them handy in this view.',
    actionLabel: 'Create a note worth starring',
  },
  today: {
    title: 'Slow day? No problem.',
    description: 'Once you edit a note we will surface it here for the rest of the day.',
    actionLabel: 'Draft something new',
  },
  archived: {
    title: 'Archive is tidy',
    description: 'Notes you archive will live here until you bring them back to the workspace.',
    actionLabel: 'Create a fresh note',
  },
};

const withAlpha = (hex: string, alpha: string) => {
  if (!hex || hex.length !== 7 || !alpha) {
    return hex;
  }
  return `${hex}${alpha}`;
};

export const NoteList: React.FC<NoteListProps> = ({
  pinnedNotes,
  notes,
  tags,
  notebooks,
  activeFilter,
  selectedNoteId,
  onSelectNote,
  onTogglePin,
  onToggleFavorite,
  onArchiveNote,
  onCreateNote,
}) => {
  const tagLookup = useMemo(
    () =>
      tags.reduce<Record<string, Tag>>((acc, tag) => {
        acc[tag.id] = tag;
        return acc;
      }, {}),
    [tags]
  );

  const notebookLookup = useMemo(
    () =>
      notebooks.reduce<Record<string, Notebook>>((acc, notebook) => {
        acc[notebook.id] = notebook;
        return acc;
      }, {}),
    [notebooks]
  );

  const totalVisible = pinnedNotes.length + notes.length;
  const heading = filterHeading[activeFilter];
  const empty = totalVisible === 0;

  const handleSelect = (noteId: string) => {
    onSelectNote(noteId);
  };

  return (
    <aside className="w-[23rem] border-r border-slate-200 bg-white flex flex-col">
      <div className="px-4 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">
            {heading.title}
          </p>
          <p className="text-sm text-slate-500">{heading.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onCreateNote}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
        >
          <PlusIcon className="h-4 w-4" />
          New
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {pinnedNotes.length > 0 && activeFilter !== 'archived' && (
          <section className="px-4 pt-4 pb-2">
            <h3 className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-2">
              Pinned
            </h3>
            <ul className="space-y-2">
              {pinnedNotes.map((note) => (
                <NoteListItem
                  key={note.id}
                  note={note}
                  isSelected={note.id === selectedNoteId}
                  tagLookup={tagLookup}
                  notebookLookup={notebookLookup}
                  onSelect={handleSelect}
                  onToggleFavorite={onToggleFavorite}
                  onTogglePin={onTogglePin}
                  onArchiveNote={onArchiveNote}
                  activeFilter={activeFilter}
                />
              ))}
            </ul>
          </section>
        )}

        {notes.length > 0 && (
          <section className="px-4 pt-4 pb-6">
            {pinnedNotes.length > 0 && activeFilter !== 'archived' && (
              <h3 className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-2">
                Recent
              </h3>
            )}
            <ul className="space-y-2">
              {notes.map((note) => (
                <NoteListItem
                  key={note.id}
                  note={note}
                  isSelected={note.id === selectedNoteId}
                  tagLookup={tagLookup}
                  notebookLookup={notebookLookup}
                  onSelect={handleSelect}
                  onToggleFavorite={onToggleFavorite}
                  onTogglePin={onTogglePin}
                  onArchiveNote={onArchiveNote}
                  activeFilter={activeFilter}
                />
              ))}
            </ul>
          </section>
        )}

        {empty && (
          <EmptyState
            filter={activeFilter}
            onCreateNote={onCreateNote}
          />
        )}
      </div>
    </aside>
  );
};

interface NoteListItemProps {
  note: Note;
  isSelected: boolean;
  tagLookup: Record<string, Tag>;
  notebookLookup: Record<string, Notebook>;
  onSelect: (noteId: string) => void;
  onTogglePin: (noteId: string) => void;
  onToggleFavorite: (noteId: string) => void;
  onArchiveNote: (noteId: string, archive: boolean) => void;
  activeFilter: NoteFilter;
}

const NoteListItem: React.FC<NoteListItemProps> = ({
  note,
  isSelected,
  tagLookup,
  notebookLookup,
  onSelect,
  onTogglePin,
  onToggleFavorite,
  onArchiveNote,
  activeFilter,
}) => {
  const accentColor = note.coverColor ?? '#e2e8f0';
  const notebook = notebookLookup[note.notebookId];
  const preview = previewFromContent(note.content);
  const subtitleColor = isSelected ? 'text-slate-600' : 'text-slate-500';
  const labelColor = isSelected ? 'text-slate-700' : 'text-slate-600';

  const handleClick = () => {
    onSelect(note.id);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(note.id);
    }
  };

  const handleFavoriteClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    onToggleFavorite(note.id);
  };

  const handlePinClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    onTogglePin(note.id);
  };

  const handleArchiveClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    onArchiveNote(note.id, activeFilter !== 'archived');
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-pressed={isSelected}
      className={`group relative rounded-xl border border-transparent bg-white px-4 py-3 shadow-sm transition ${
        isSelected
          ? 'border-slate-200 shadow-lg shadow-slate-200/40'
          : 'hover:border-slate-200 hover:shadow'
      }`}
      style={{ borderLeft: `4px solid ${accentColor}` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className={`text-sm font-semibold leading-6 ${labelColor}`}>
                {note.title || 'Untitled note'}
              </h3>
              <p className={`mt-1 text-xs leading-5 ${subtitleColor}`}>{preview}</p>
            </div>
            <div className="flex flex-col items-end gap-1 text-slate-400">
              {note.favorite && <StarSolidIcon className="h-4 w-4 text-amber-500" />}
              {note.pinned && <PinIcon className="h-4 w-4 text-slate-500" />}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <ClockIcon className="h-3.5 w-3.5" />
              {formatRelativeTime(note.updatedAt)}
            </span>
            {notebook && (
              <span className="inline-flex items-center gap-1">
                <NotebookIcon className="h-3.5 w-3.5" />
                {notebook.name}
              </span>
            )}
            <div className="flex flex-wrap gap-2">
              {note.tags.slice(0, 3).map((tagId) => {
                const tag = tagLookup[tagId];
                if (!tag) {
                  return null;
                }
                return (
                  <span
                    key={tagId}
                    className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium"
                    style={{
                      borderColor: tag.color,
                      color: tag.color,
                      backgroundColor: withAlpha(tag.color, '1a'),
                    }}
                  >
                    <TagIcon className="h-3 w-3" />
                    {tag.name}
                  </span>
                );
              })}
              {note.tags.length > 3 && (
                <span className="text-[11px] text-slate-400">+{note.tags.length - 3}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 opacity-0 transition group-hover:opacity-100">
          <button
            type="button"
            onClick={handleFavoriteClick}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-amber-500"
            aria-label={note.favorite ? 'Unfavorite note' : 'Favorite note'}
          >
            {note.favorite ? (
              <StarSolidIcon className="h-4 w-4 fill-amber-500 text-amber-500" />
            ) : (
              <StarOutlineIcon className="h-4 w-4" />
            )}
          </button>
          {activeFilter !== 'archived' && (
            <button
              type="button"
              onClick={handlePinClick}
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
            >
              <PinIcon className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={handleArchiveClick}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label={activeFilter === 'archived' ? 'Restore note' : 'Archive note'}
          >
            {activeFilter === 'archived' ? (
              <StackIcon className="h-4 w-4" />
            ) : (
              <ArchiveIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

interface EmptyStateProps {
  filter: NoteFilter;
  onCreateNote: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ filter, onCreateNote }) => {
  const content = emptyStates[filter];
  const IconComponent = filter === 'today' ? CalendarIcon : StackIcon;

  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <IconComponent className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-700">{content.title}</h3>
      <p className="mt-2 text-sm text-slate-500">{content.description}</p>
      <button
        type="button"
        onClick={onCreateNote}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
      >
        <PlusIcon className="h-4 w-4" />
        {content.actionLabel}
      </button>
    </div>
  );
};
