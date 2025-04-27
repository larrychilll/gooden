import { supabase } from '../lib/supabase';
import { Book, Chapter, ChapterContent, QuizQuestion } from '../types';

export async function getBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching books:', error);
    throw error;
  }

  return data.map(book => ({
    id: book.id,
    title: book.title,
    titleCh: book.title_ch,
    author: book.author,
    coverImage: book.cover_image,
    categoryId: book.category_id,
    description: book.description,
    slug: book.slug,
    affiliateUrl: book.affiliate_url || ''
  }));
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error fetching book:', error);
    throw error;
  }

  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    titleCh: data.title_ch,
    author: data.author,
    coverImage: data.cover_image,
    categoryId: data.category_id,
    description: data.description,
    slug: data.slug,
    affiliateUrl: data.affiliate_url || ''
  };
}

export async function getChaptersByBookId(bookId: string): Promise<Chapter[]> {
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('book_id', bookId)
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching chapters:', error);
    throw error;
  }

  return data.map(chapter => ({
    id: chapter.id,
    bookId: chapter.book_id,
    title: chapter.title,
    titleCh: chapter.title_ch,
    slug: chapter.slug,
    order: chapter.order
  }));
}

export async function getChapterContent(chapterId: string): Promise<ChapterContent | null> {
  const { data, error } = await supabase
    .from('chapter_content')
    .select('*')
    .eq('chapter_id', chapterId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching chapter content:', error);
    throw error;
  }

  return data ? {
    summaryEn: data.summary_en,
    summaryCh: data.summary_ch,
    vocabulary: data.vocabulary,
    keyPoints: data.key_points,
    quiz: []
  } : null;
}

export async function getChapterQuestions(chapterId: string): Promise<QuizQuestion[]> {
  const { data, error } = await supabase
    .from('chapter_questions')
    .select('*')
    .eq('chapter_id', chapterId);

  if (error) {
    console.error('Error fetching chapter questions:', error);
    throw error;
  }

  return data?.map(q => ({
    question: q.question,
    options: q.options,
    explanation: {
      english: q.explanation_en,
      chinese: q.explanation_ch
    }
  })) || [];
}