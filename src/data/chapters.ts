import { supabase } from '../lib/supabase';
import { Chapter } from '../types';

export async function fetchChapters(bookId: string): Promise<Chapter[]> {
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('book_id', bookId)  // Fetch chapters based on book_id
    .order('order', { ascending: true });  // Ensure they are in the correct order

  if (error) {
    console.error('Error fetching chapters:', error);
    return [];
  }

  return data || [];
}
