import React, { useEffect, useMemo, useState } from 'react';
import type { Note, Notebook, Tag } from '../../types';
import {
  ArchiveIcon,
  ClockIcon,
  NotebookIcon,
  PinIcon,
  PlusIcon,
  StackIcon,
  StarOutlineIcon,
  StarSolidIcon,
  TagIcon,
  TrashIcon,
} from '../shared/Icon';

interface NoteEditorProps {
  note?: Note;
  tags: Tag[];
  notebooks: Notebook[];
  onUpdateTitle: (noteId: string, title: string) => void;
  onUpdateContent: (noteId: string, content: string) => void;
  onToggleFavorite: (noteId: string) => void;
  onTogglePinned: (noteId: string) => void;
  onArchiveNote: (noteId: string, archive: boolean) => void;
  onDeleteNote: (noteId: string) => void;
  onDuplicateNote: (noteId: string) => void;
  onChangeNotebook: (noteId: string, notebookId: string) => void;
  onAddTag: (noteId: string, tagName: string) => void;
  onRemoveTag: (noteId: string, tagId: string) => void;
}

const formatRelativeTime = (isoTimestamp: string) => {
  const target = new Date(isoTimestamp);
  if (Number.isNaN(target.getTime())) {
    return 'just now';
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

const withAlpha = (hex: string, alpha: string) => {
  if (!hex || hex.length !== 7 || !alpha) {
    return hex;
  }
  return `${hex}${alpha}`;
};

const computeWordCount = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return 0;
  }
  return trimmed.split(/\s+/).filter(Boolean).length;
};

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  tags,
  notebooks,
  onUpdateTitle,
  onUpdateContent,
  onToggleFavorite,
  onTogglePinned,
  onArchiveNote,
  onDeleteNote,
  onDuplicateNote,
  onChangeNotebook,
  onAddTag,
  onRemoveTag,
}) => {
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    setTagInput('');
  }, [note?.id]);

  const notebookOptions = notebooks;

  const availableTagSuggestions = useMemo(() => {
    if (!note) {
      return [];
    }
    const input = tagInput.trim().toLowerCase();
    return tags
      .filter((tag) => !note.tags.includes(tag.id))
      .filter((tag) => (input ? tag.name.toLowerCase().includes(input) : true))
      .slice(0, 6);
  }, [tags, note, tagInput]);

  const stats = useMemo(() => {
    if (!note) {
      return { words: 0, characters: 0 };
    }
    return {
      words: computeWordCount(note.content),
      characters: note.content.length,
    };
  }, [note]);

  const handleTitleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!note) {
      return;
    }
    onUpdateTitle(note.id, event.target.value);
  };

  const handleContentChange: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    if (!note) {
      return;
    }
    onUpdateContent(note.id, event.target.value);
  };

  const handleNotebookChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    if (!note) {
      return;
    }
    onChangeNotebook(note.id, event.target.value);
  };

  const handleTagSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!note) {
      return;
    }
    const value = tagInput.trim();
    if (!value) {
      return;
    }
    onAddTag(note.id, value);
    setTagInput('');
  };

  const handleTagRemove = (tagId: string) => {
    if (!note) {
      return;
    }
    onRemoveTag(note.id, tagId);
  };

  const handleFavoriteToggle = () => {
    if (!note) {
      return;
    }
    onToggleFavorite(note.id);
  };

  const handlePinToggle = () => {
    if (!note) {
      return;
    }
    onTogglePinned(note.id);
  };

  const handleArchiveToggle = () => {
    if (!note) {
      return;
    }
    onArchiveNote(note.id, note.status !== 'archived');
  };

  const handleDuplicate = () => {
    if (!note) {
      return;
    }
    onDuplicateNote(note.id);
  };

  const handleDelete = () => {
    if (!note) {
      return;
    }
    const confirmed = window.confirm('Delete this note permanently? This action cannot be undone.');
    if (confirmed) {
      onDeleteNote(note.id);
    }
  };

  if (!note) {
    return (
      <section className="flex flex-1 flex-col items-center justify-center bg-slate-50 text-center">
        <div className="rounded-full bg-white p-6 shadow-md shadow-slate-200">
          <NotebookIcon className="h-10 w-10 text-slate-400" />
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-slate-700">Select a note to get started</h2>
        <p className="mt-3 max-w-md text-sm text-slate-500">
          Choose an existing note on the left or create a fresh one to begin writing. Your ideas stay
          perfectly organized here.
        </p>
        <div className="mt-6 flex items-center gap-3 text-sm text-slate-400">
          <div className="flex items-center gap-1">
            <StarSolidIcon className="h-4 w-4" />
            Favorite to revisit faster
          </div>
          <div className="flex items-center gap-1">
            <TagIcon className="h-4 w-4" />
            Tag to stay organized
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-1 flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-8 pb-4 pt-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <input
              value={note.title}
              onChange={handleTitleChange}
              placeholder="Add a title..."
              className="w-full border-none bg-transparent text-2xl font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:ring-0"
            />
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <label className="inline-flex items-center gap-2">
                <NotebookIcon className="h-4 w-4 text-slate-400" />
                <select
                  value={note.notebookId}
                  onChange={handleNotebookChange}
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  {notebookOptions.map((notebook) => (
                    <option key={notebook.id} value={notebook.id}>
                      {notebook.name}
                    </option>
                  ))}
                </select>
              </label>
              <span className="inline-flex items-center gap-1">
                <ClockIcon className="h-3.5 w-3.5" />
                Updated {formatRelativeTime(note.updatedAt)}
              </span>
              <span className="inline-flex items-center gap-1 text-slate-400">
                Created {new Date(note.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleFavoriteToggle}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                note.favorite
                  ? 'border-amber-500 bg-amber-50 text-amber-600'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              {note.favorite ? (
                <StarSolidIcon className="h-4 w-4 fill-amber-500 text-amber-500" />
              ) : (
                <StarOutlineIcon className="h-4 w-4" />
              )}
              {note.favorite ? 'Favorited' : 'Favorite'}
            </button>
            <button
              type="button"
              onClick={handlePinToggle}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                note.pinned
                  ? 'border-slate-500 bg-slate-100 text-slate-700'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              <PinIcon className="h-4 w-4" />
              {note.pinned ? 'Pinned' : 'Pin'}
            </button>
            <button
              type="button"
              onClick={handleDuplicate}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
            >
              <StackIcon className="h-4 w-4" />
              Duplicate
            </button>
            <button
              type="button"
              onClick={handleArchiveToggle}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
            >
              {note.status === 'archived' ? (
                <>
                  <StackIcon className="h-4 w-4" />
                  Restore
                </>
              ) : (
                <>
                  <ArchiveIcon className="h-4 w-4" />
                  Archive
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-2 rounded-full border border-transparent bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-600 transition hover:bg-rose-100"
            >
              <TrashIcon className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-slate-200 bg-white px-8 py-4">
          <div className="flex flex-wrap items-center gap-2">
            {note.tags.map((tagId) => {
              const tag = tags.find((t) => t.id === tagId);
              if (!tag) {
                return null;
              }
              return (
                <span
                  key={tagId}
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-slate-600"
                  style={{
                    borderColor: tag.color,
                    color: tag.color,
                    backgroundColor: withAlpha(tag.color, '12'),
                  }}
                >
                  <TagIcon className="h-3.5 w-3.5" />
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tagId)}
                    className="ml-1 rounded-full bg-white/60 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 hover:bg-white hover:text-slate-700"
                  >
                    ×
                  </button>
                </span>
              );
            })}

            <form onSubmit={handleTagSubmit} className="flex items-center gap-2">
              <div className="inline-flex items-center rounded-full border border-dashed border-slate-300 bg-slate-50 px-3 py-1">
                <PlusIcon className="mr-2 h-3.5 w-3.5 text-slate-400" />
                <input
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  placeholder={note.tags.length ? 'Add tag' : 'Add your first tag'}
                  className="w-28 border-none bg-transparent text-xs text-slate-600 outline-none placeholder:text-slate-400 focus:ring-0"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-700"
              >
                Add
              </button>
            </form>
          </div>

          {availableTagSuggestions.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span>Suggestions:</span>
              {availableTagSuggestions.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    if (note.tags.includes(tag.id)) {
                      return;
                    }
                    onAddTag(note.id, tag.name);
                    setTagInput('');
                  }}
                  className="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <textarea
            value={note.content}
            onChange={handleContentChange}
            placeholder="Jot down your thoughts, plans, and breakthroughs..."
            className="h-full w-full resize-none rounded-2xl border border-slate-200 bg-white px-6 py-5 text-base leading-7 text-slate-700 shadow-inner focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/40"
          />
        </div>

        <footer className="border-t border-slate-200 bg-white px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex flex-wrap items-center gap-4">
              <span>
                <strong className="font-semibold text-slate-700">{stats.words}</strong> words
              </span>
              <span>
                <strong className="font-semibold text-slate-700">{stats.characters}</strong> characters
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-slate-400">
              <ClockIcon className="h-3.5 w-3.5" />
              Last updated {formatRelativeTime(note.updatedAt)}
            </span>
          </div>
        </footer>
      </div>
    </section>
  );
};
