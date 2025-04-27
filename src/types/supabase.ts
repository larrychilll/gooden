export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          id: string
          title: string
          title_ch: string
          author: string
          cover_image: string
          category_id: string
          description: string
          slug: string
          affiliate_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          title_ch: string
          author: string
          cover_image: string
          category_id: string
          description: string
          slug: string
          affiliate_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          title_ch?: string
          author?: string
          cover_image?: string
          category_id?: string
          description?: string
          slug?: string
          affiliate_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chapters: {
        Row: {
          id: string
          book_id: string
          title: string
          title_en: string
          title_ch: string
          slug: string
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          book_id: string
          title: string
          title_en: string
          title_ch: string
          slug: string
          order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          title?: string
          title_en?: string
          title_ch?: string
          slug?: string
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      chapter_content: {
        Row: {
          id: string
          chapter_id: string
          summary_en: string
          summary_ch: string
          vocabulary: Json
          key_points: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          chapter_id: string
          summary_en: string
          summary_ch: string
          vocabulary?: Json
          key_points?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          chapter_id?: string
          summary_en?: string
          summary_ch?: string
          vocabulary?: Json
          key_points?: Json
          created_at?: string
          updated_at?: string
        }
      }
      chapter_questions: {
        Row: {
          id: string
          chapter_id: string
          question: string
          options: Json
          correct_answer: number
          explanation_en: string
          explanation_ch: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          chapter_id: string
          question: string
          options: Json
          correct_answer: number
          explanation_en: string
          explanation_ch: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          chapter_id?: string
          question?: string
          options?: Json
          correct_answer?: number
          explanation_en?: string
          explanation_ch?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}