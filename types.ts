export type NoteStatus = 'active' | 'archived';

export type NoteFilter = 'all' | 'favorites' | 'today' | 'archived';

export type SortOption = 'updated' | 'created' | 'title';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Notebook {
  id: string;
  name: string;
  description?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  notebookId: string;
  tags: string[];
  favorite: boolean;
  pinned: boolean;
  status: NoteStatus;
  coverColor?: string;
}