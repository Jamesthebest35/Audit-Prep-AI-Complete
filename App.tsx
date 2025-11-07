
import React, { useEffect, useMemo, useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { NoteList } from './components/notes/NoteList';
import { NoteEditor } from './components/notes/NoteEditor';
import type { Note, Notebook, NoteFilter, SortOption, Tag } from './types';

const NOTE_COLOR_PALETTE = ['#6366f1', '#ec4899', '#0ea5e9', '#f97316', '#14b8a6', '#f59e0b', '#8b5cf6'];

const initialNotebooks: Notebook[] = [
  { id: 'inbox', name: 'Inbox', description: 'Capture quick thoughts and drop-in ideas.' },
  { id: 'strategy', name: 'Strategy Hub', description: 'North-star goals and long-range planning.' },
  { id: 'product', name: 'Product Research', description: 'Insights, user interviews, and experiments.' },
  { id: 'writing', name: 'Writing Desk', description: 'Drafts, essays, and newsletter outlines.' },
  { id: 'personal', name: 'Personal Journal', description: 'Reflections, gratitude, and life updates.' },
];

const initialTags: Tag[] = [
  { id: 'roadmap', name: 'Roadmap', color: '#6366f1' },
  { id: 'ideas', name: 'Ideas', color: '#ec4899' },
  { id: 'meeting-notes', name: 'Meeting Notes', color: '#0ea5e9' },
  { id: 'writing', name: 'Writing', color: '#14b8a6' },
  { id: 'personal', name: 'Personal', color: '#f97316' },
  { id: 'gratitude', name: 'Gratitude', color: '#f59e0b' },
];

const initialNotes: Note[] = [
  {
    id: 'note-product-vision',
    title: '2025 Product Vision',
    content:
      '## North Star\n- Help teams capture thinking that stays findable forever.\n- Build an interface that feels like a creative studio, not a filing cabinet.\n\n## Core themes\n1. Real-time knowledge graph\n2. AI-assisted research briefs\n3. Rituals that prompt better writing\n\n### Q1 Focus\n- Bring inbox to zero state redesign\n- Run 12 customer discovery sessions with design leads\n- Publish first public changelog',
    createdAt: '2025-07-12T14:22:00.000Z',
    updatedAt: '2025-11-01T09:15:00.000Z',
    notebookId: 'strategy',
    tags: ['roadmap', 'ideas'],
    favorite: true,
    pinned: true,
    status: 'active',
    coverColor: '#1e3a8a',
  },
  {
    id: 'note-customer-interview',
    title: 'Interview: Willow from Arcadia Labs',
    content:
      '**Context**: Follow-up with Willow on discovery process.\n\n**Highlights**\n- Loves the way notes auto-link when titles match keywords.\n- Needs better way to save meeting recordings alongside bullet summaries.\n- Wants AI recap to surface commitments and next steps automatically.\n\n**Next actions**\n- Prototype transcript attachment workflow.\n- Explore checklists tied to next meeting date.\n- Invite Willow to async pilot group.',
    createdAt: '2025-09-04T18:05:00.000Z',
    updatedAt: '2025-11-05T16:42:00.000Z',
    notebookId: 'product',
    tags: ['meeting-notes', 'ideas'],
    favorite: false,
    pinned: false,
    status: 'active',
    coverColor: '#0ea5e9',
  },
  {
    id: 'note-release-changelog',
    title: 'Release 0.9.0 Changelog Draft',
    content:
      '### Highlights\n- ✨ Command Palette now supports natural language actions.\n- 🧠 Smart suggestions for linking related notes as you type.\n- 🎨 Six new cover accents to visually group your projects.\n\n### Rollout checklist\n- [ ] Publish docs update\n- [ ] Record 2-min teaser\n- [ ] Email early adopters',
    createdAt: '2025-10-15T12:30:00.000Z',
    updatedAt: '2025-11-03T10:05:00.000Z',
    notebookId: 'writing',
    tags: ['writing', 'roadmap'],
    favorite: true,
    pinned: true,
    status: 'active',
    coverColor: '#8b5cf6',
  },
  {
    id: 'note-evening-reflection',
    title: 'Evening Reflection — Nov 5',
    content:
      'Today I:\n- Closed the loop on the beta onboarding flow.\n- Finally wrote the narrative for the launch deck.\n- Took a long walk without my phone and felt the ideas settle.\n\nGrateful for: unhurried conversations, the first cold night of fall, and teammates who edit generously.',
    createdAt: '2025-11-05T21:12:00.000Z',
    updatedAt: '2025-11-05T21:35:00.000Z',
    notebookId: 'personal',
    tags: ['personal', 'gratitude'],
    favorite: false,
    pinned: false,
    status: 'active',
    coverColor: '#f97316',
  },
  {
    id: 'note-story-outline',
    title: 'Story Outline: The Rhythm of Momentum',
    content:
      '### Hook\nWhat if momentum wasn’t speed but resonance?\n\n### Structure\n1. Set the scene: burning out on constant output.\n2. Introduce the idea of rhythm in creative work.\n3. Share rituals that reset the tempo (weekly review, deep work sprints).\n4. Close with a personal story from last launch cycle.\n\n### References\n- Austin Kleon on seasonal creativity\n- James Clear on compounding habits',
    createdAt: '2025-08-22T09:45:00.000Z',
    updatedAt: '2025-10-30T07:20:00.000Z',
    notebookId: 'writing',
    tags: ['writing'],
    favorite: false,
    pinned: false,
    status: 'active',
    coverColor: '#14b8a6',
  },
  {
    id: 'note-archive-example',
    title: 'Archived: V1 onboarding checklist',
    content:
      'Superseded by the 2025 onboarding framework. Keeping for historical context.\n\n- Initial welcome email sequence\n- Checklist for workspace setup\n- Legacy video tutorials (to delete once new ones go live)',
    createdAt: '2024-05-18T08:00:00.000Z',
    updatedAt: '2025-09-12T13:50:00.000Z',
    notebookId: 'strategy',
    tags: ['roadmap'],
    favorite: false,
    pinned: false,
    status: 'archived',
    coverColor: '#6366f1',
  },
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const formatRelativeTime = (isoTimestamp: string) => {
  const target = new Date(isoTimestamp);
  if (Number.isNaN(target.getTime())) {
    return 'a moment ago';
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

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(initialNotes[0]?.id ?? null);
  const [activeFilter, setActiveFilter] = useState<NoteFilter>('all');
  const [activeNotebookId, setActiveNotebookId] = useState<string | null>(null);
  const [activeTagId, setActiveTagId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('updated');

  const filteredNotes = useMemo(() => {
    const today = new Date().toDateString();
    const query = searchQuery.trim().toLowerCase();

    return notes.filter((note) => {
      if (activeFilter === 'archived') {
        if (note.status !== 'archived') {
          return false;
        }
      } else if (note.status === 'archived') {
        return false;
      }

      if (activeFilter === 'favorites' && !note.favorite) {
        return false;
      }

      if (activeFilter === 'today') {
        const updatedDate = new Date(note.updatedAt).toDateString();
        if (updatedDate !== today) {
          return false;
        }
      }

      if (activeNotebookId && note.notebookId !== activeNotebookId) {
        return false;
      }

      if (activeTagId && !note.tags.includes(activeTagId)) {
        return false;
      }

      if (query) {
        const matchesQuery =
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.tags.some((tagId) => {
            const tag = tags.find((t) => t.id === tagId);
            return tag ? tag.name.toLowerCase().includes(query) : false;
          });
        if (!matchesQuery) {
          return false;
        }
      }

      return true;
    });
  }, [notes, activeFilter, activeNotebookId, activeTagId, searchQuery, tags]);

  const prioritizedNotes = useMemo(() => {
    const sorted = [...filteredNotes];
    sorted.sort((a, b) => {
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }
      if (sortOption === 'updated') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      if (sortOption === 'created') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
    });
    return sorted;
  }, [filteredNotes, sortOption]);

  const pinnedNotes = useMemo(() => {
    if (activeFilter === 'archived') {
      return [];
    }
    return prioritizedNotes.filter((note) => note.pinned);
  }, [prioritizedNotes, activeFilter]);

  const unpinnedNotes = useMemo(() => {
    if (activeFilter === 'archived') {
      return prioritizedNotes;
    }
    const pinnedIds = new Set(pinnedNotes.map((note) => note.id));
    return prioritizedNotes.filter((note) => !pinnedIds.has(note.id));
  }, [prioritizedNotes, pinnedNotes, activeFilter]);

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedNoteId),
    [notes, selectedNoteId]
  );

  useEffect(() => {
    if (!prioritizedNotes.length) {
      if (selectedNoteId !== null) {
        setSelectedNoteId(null);
      }
      return;
    }

    if (!selectedNoteId || !prioritizedNotes.some((note) => note.id === selectedNoteId)) {
      setSelectedNoteId(prioritizedNotes[0].id);
    }
  }, [prioritizedNotes, selectedNoteId]);

  const noteCounts = useMemo(() => {
    const today = new Date().toDateString();
    const activeNotes = notes.filter((note) => note.status === 'active');
    const archivedNotes = notes.filter((note) => note.status === 'archived');

    const byNotebook = initialNotebooks.reduce<Record<string, number>>((acc, notebook) => {
      acc[notebook.id] = activeNotes.filter((note) => note.notebookId === notebook.id).length;
      return acc;
    }, {});

    const byTag = tags.reduce<Record<string, number>>((acc, tag) => {
      acc[tag.id] = activeNotes.filter((note) => note.tags.includes(tag.id)).length;
      return acc;
    }, {});

    return {
      all: activeNotes.length,
      favorites: activeNotes.filter((note) => note.favorite).length,
      today: activeNotes.filter(
        (note) => new Date(note.updatedAt).toDateString() === today
      ).length,
      archived: archivedNotes.length,
      byNotebook,
      byTag,
    };
  }, [notes, tags]);

  const lastUpdatedLabel = useMemo(() => {
    if (!notes.length) {
      return 'never synced';
    }
    const mostRecent = [...notes]
      .filter((note) => note.status === 'active')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
    if (!mostRecent) {
      return 'never synced';
    }
    return `Synced ${formatRelativeTime(mostRecent.updatedAt)}`;
  }, [notes]);

  const handleCreateNote = (notebookId?: string | null) => {
    const now = new Date().toISOString();
    const targetNotebook =
      notebookId ??
      activeNotebookId ??
      (initialNotebooks.find((notebook) => notebook.id === 'inbox')?.id ?? initialNotebooks[0].id);

    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: 'Untitled note',
      content: '',
      createdAt: now,
      updatedAt: now,
      notebookId: targetNotebook,
      tags: [],
      favorite: false,
      pinned: false,
      status: 'active',
      coverColor: NOTE_COLOR_PALETTE[(notes.length + 1) % NOTE_COLOR_PALETTE.length],
    };

    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    setActiveFilter('all');
    setActiveNotebookId(targetNotebook);
    setActiveTagId(null);
  };

  const handleSelectFilter = (filter: NoteFilter) => {
    setActiveFilter(filter);
    setActiveNotebookId(null);
    setActiveTagId(null);
  };

  const handleSelectNotebook = (notebookId: string) => {
    setActiveNotebookId((current) => (current === notebookId ? null : notebookId));
    setActiveFilter('all');
    setActiveTagId(null);
  };

  const handleSelectTag = (tagId: string) => {
    setActiveTagId((current) => (current === tagId ? null : tagId));
    setActiveFilter('all');
    setActiveNotebookId(null);
  };

  const handleUpdateTitle = (noteId: string, title: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId
          ? {
              ...note,
              title,
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    );
  };

  const handleUpdateContent = (noteId: string, content: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId
          ? {
              ...note,
              content,
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    );
  };

  const handleToggleFavorite = (noteId: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId
          ? {
              ...note,
              favorite: !note.favorite,
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    );
  };

  const handleTogglePinned = (noteId: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId
          ? {
              ...note,
              pinned: !note.pinned,
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    );
  };

  const handleArchiveNote = (noteId: string, archive: boolean) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId
          ? {
              ...note,
              status: archive ? 'archived' : 'active',
              pinned: archive ? false : note.pinned,
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    );
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
  };

  const handleDuplicateNote = (noteId: string) => {
    const original = notes.find((note) => note.id === noteId);
    if (!original) {
      return;
    }
    const now = new Date().toISOString();
    const duplicate: Note = {
      ...original,
      id: `note-${Date.now()}`,
      title: `${original.title || 'Untitled note'} (Copy)`,
      createdAt: now,
      updatedAt: now,
      favorite: false,
      pinned: false,
      status: 'active',
    };

    setNotes((prev) => [duplicate, ...prev]);
    setSelectedNoteId(duplicate.id);
    setActiveFilter('all');
    setActiveTagId(null);
  };

  const handleChangeNotebook = (noteId: string, notebookId: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId
          ? {
              ...note,
              notebookId,
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    );
  };

  const handleAddTagToNote = (noteId: string, tagName: string) => {
    const normalized = tagName.trim();
    if (!normalized) {
      return;
    }

    const tagId = slugify(normalized);

    setTags((prev) => {
      if (prev.some((tag) => tag.id === tagId)) {
        return prev;
      }
      return [
        ...prev,
        {
          id: tagId,
          name: normalized,
          color: NOTE_COLOR_PALETTE[(prev.length + 2) % NOTE_COLOR_PALETTE.length],
        },
      ];
    });

    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId
          ? note.tags.includes(tagId)
            ? note
            : {
                ...note,
                tags: [...note.tags, tagId],
                updatedAt: new Date().toISOString(),
              }
          : note
      )
    );
  };

  const handleRemoveTagFromNote = (noteId: string, tagId: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId
          ? {
              ...note,
              tags: note.tags.filter((id) => id !== tagId),
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    );
  };

  const visibleNoteCount = prioritizedNotes.length;

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900">
      <Sidebar
        notebooks={initialNotebooks}
        tags={tags}
        activeFilter={activeFilter}
        activeNotebookId={activeNotebookId}
        activeTagId={activeTagId}
        noteCounts={noteCounts}
        onSelectFilter={handleSelectFilter}
        onSelectNotebook={handleSelectNotebook}
        onSelectTag={handleSelectTag}
        onCreateNote={handleCreateNote}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreateNote={() => handleCreateNote(activeNotebookId)}
          sortOption={sortOption}
          onSortChange={setSortOption}
          visibleCount={visibleNoteCount}
          totalCount={noteCounts.all}
          syncStatus={lastUpdatedLabel}
        />
        <main className="flex-1 flex overflow-hidden">
          <NoteList
            pinnedNotes={pinnedNotes}
            notes={unpinnedNotes}
            tags={tags}
            notebooks={initialNotebooks}
            activeFilter={activeFilter}
            selectedNoteId={selectedNoteId}
            onSelectNote={setSelectedNoteId}
            onTogglePin={handleTogglePinned}
            onToggleFavorite={handleToggleFavorite}
            onArchiveNote={handleArchiveNote}
            onCreateNote={() => handleCreateNote(activeNotebookId)}
          />
          <NoteEditor
            note={selectedNote}
            tags={tags}
            notebooks={initialNotebooks}
            onUpdateTitle={handleUpdateTitle}
            onUpdateContent={handleUpdateContent}
            onToggleFavorite={handleToggleFavorite}
            onTogglePinned={handleTogglePinned}
            onArchiveNote={handleArchiveNote}
            onDeleteNote={handleDeleteNote}
            onDuplicateNote={handleDuplicateNote}
            onChangeNotebook={handleChangeNotebook}
            onAddTag={handleAddTagToNote}
            onRemoveTag={handleRemoveTagFromNote}
          />
        </main>
      </div>
    </div>
  );
};

export default App;