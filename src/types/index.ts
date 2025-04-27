export interface Category {
  id: string;
  name: string;
  nameEn: string;
  nameCh: string;
  slug: string;
  description: string;
  image: string;
}

export interface Book {
  id: string;
  title: string;
  titleCh: string;
  author: string;
  coverImage: string;
  categoryId: string;
  description: string;
  slug: string;
  affiliateUrl: string;
}

export interface Chapter {
  id: string;
  bookId: string;
  title: string;
  titleCh: string;
  slug: string;
  order: number;
  content?: ChapterContent | null;
  book?: {
    title: string;
    title_ch: string;
  };
}

export interface VocabularyItem {
  word: string;
  translation: string;
  pronunciation?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  context: {
    en: string;
    ch: string;
  };
  examples: Array<{
    en: string;
    ch: string;
  }>;
}

export interface KeyPoint {
  en: string;
  ch: string;
  importance: number;
  related_concepts: string[];
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  explanation: {
    english: string;
    chinese: string;
  };
}

export interface ChapterContent {
  id: string;
  summary_en: string;
  summary_ch: string;
  vocabulary: VocabularyItem[];
  key_points: KeyPoint[];
  quiz: QuizQuestion[];
  status: 'draft' | 'published' | 'archived';
  audio_url_en?: string;
  audio_url_ch?: string;
  tags?: string[];
}

export interface SummaryFormData {
  bookTitle: string;
  chapterName: string;
  language1: string;
  language2: string;
}

export interface Summary {
  bookTitle: string;
  chapterName: string;
  language1: string;
  language2: string;
  summaryText1: string;
  summaryText2: string;
  keyPoints: string[];
  advancedVocabulary: Array<{
    term: string;
    definition: string;
    language: string;
  }>;
  questions: string[];
  dateGenerated: string;
}

export interface BookEntry {
  bookTitle: string;
  author?: string;
  chapterName: string;
}