import { supabase } from './supabase';

export async function uploadBookCover(file: File) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `book-covers/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('books')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('books')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export async function deleteBookCover(url: string) {
  try {
    const path = url.split('/').pop();
    if (!path) throw new Error('Invalid URL');

    const { error } = await supabase.storage
      .from('books')
      .remove([`book-covers/${path}`]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}