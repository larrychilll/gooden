import { supabase } from '../lib/supabase';
import { Book } from '../types';

export async function fetchBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching books:', error);
    return [];
  }

  return data || [];
}
