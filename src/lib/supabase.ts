import { createClient } from '@supabase/supabase-js';
import { Note, Folder, Tag } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database helper functions
export const notesService = {
  async getAllNotes() {
    const { data, error } = await supabase
      .from('notes')
      .select(`
        *,
        folders(name, color),
        note_tags(tags(name, color))
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createNote(note: Omit<Note, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('notes')
      .insert([note])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateNote(id: string, updates: Partial<Note>) {
    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteNote(id: string) {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const foldersService = {
  async getAllFolders() {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async createFolder(folder: Omit<Folder, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('folders')
      .insert([folder])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export const tagsService = {
  async getAllTags() {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async createTag(tag: Omit<Tag, 'id'>) {
    const { data, error } = await supabase
      .from('tags')
      .insert([tag])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
