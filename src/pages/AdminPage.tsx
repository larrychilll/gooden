import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp, Loader2, LayoutGrid, DollarSign } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Book, Chapter, ChapterContent } from '../types';
import { categories } from '../data/categories';
import ChapterContentForm from './ChapterContentForm';
import AdSenseManager from './AdSenseManager';

const AdminPage: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path === 'adsense') {
      setActiveTab('adsense');
    } else {
      setActiveTab('content');
    }
  }, [location]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Navigation Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <Link
            to="/admin"
            className={`${
              activeTab === 'content'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            <LayoutGrid className="w-5 h-5 mr-2" />
            Content Management
          </Link>
          <Link
            to="/admin/adsense"
            className={`${
              activeTab === 'adsense'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            <DollarSign className="w-5 h-5 mr-2" />
            AdSense Management
          </Link>
        </nav>
      </div>

      {/* Content Routes */}
      <Routes>
        <Route path="/" element={<ContentManager />} />
        <Route path="/adsense" element={<AdSenseManager />} />
      </Routes>
    </div>
  );
};

// Existing ContentManager component (your current AdminPage content)
const ContentManager: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [chapters, setChapters] = useState<Record<string, Chapter[]>>({});
  const [expandedBook, setExpandedBook] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    title_ch: '',
    author: '',
    cover_image: '',
    category_id: categories[0].id,
    description: '',
    slug: '',
    affiliate_url: ''
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);

      const chaptersData: Record<string, Chapter[]> = {};
      await Promise.all(
        (data || []).map(async (book) => {
          const { data: bookChapters } = await supabase
            .from('chapters')
            .select(`
              *,
              chapter_content (
                id,
                summary_en,
                summary_ch,
                vocabulary,
                key_points,
                status,
                tags
              )
            `)
            .eq('book_id', book.id)
            .order('order', { ascending: true });
          
          if (bookChapters) {
            chaptersData[book.id] = bookChapters.map(chapter => ({
              ...chapter,
              content: chapter.chapter_content?.[0] || null
            }));
          }
        })
      );
      setChapters(chaptersData);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const bookData = {
        ...formData,
        cover_image: formData.cover_image || null,
        affiliate_url: formData.affiliate_url || null
      };

      if (editingBook) {
        const { error } = await supabase
          .from('books')
          .update(bookData)
          .eq('id', editingBook);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('books')
          .insert([bookData]);

        if (error) throw error;
      }

      setEditingBook(null);
      setFormData({
        title: '',
        title_ch: '',
        author: '',
        cover_image: '',
        category_id: categories[0].id,
        description: '',
        slug: '',
        affiliate_url: ''
      });
      fetchBooks();
    } catch (error) {
      console.error('Error saving book:', error);
      setError(error instanceof Error ? error.message : 'Failed to save book');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this book?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete book');
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(book: Book) {
    setEditingBook(book.id);
    setFormData({
      title: book.title,
      title_ch: book.titleCh,
      author: book.author,
      cover_image: book.coverImage || '',
      category_id: book.categoryId,
      description: book.description,
      slug: book.slug,
      affiliate_url: book.affiliateUrl || ''
    });
  }

  async function handleAddChapter(bookId: string) {
    const bookChapters = chapters[bookId] || [];
    const nextOrder = bookChapters.length + 1;

    try {
      const { error } = await supabase
        .from('chapters')
        .insert([{
          book_id: bookId,
          title: `Chapter ${nextOrder}`,
          title_ch: `第 ${nextOrder} 章`,
          slug: `chapter-${nextOrder}`,
          order: nextOrder
        }]);

      if (error) throw error;
      fetchBooks();
    } catch (error) {
      console.error('Error adding chapter:', error);
      setError(error instanceof Error ? error.message : 'Failed to add chapter');
    }
  }

  if (loading && !editingBook) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>

      {/* Book Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingBook ? 'Edit Book' : 'Add New Book'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title (English)</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Chinese Title</label>
            <input
              type="text"
              value={formData.title_ch}
              onChange={(e) => setFormData({ ...formData, title_ch: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Author</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cover Image URL
              <span className="text-gray-500 text-xs ml-2">(optional)</span>
            </label>
            <input
              type="url"
              value={formData.cover_image}
              onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Affiliate URL
              <span className="text-gray-500 text-xs ml-2">(optional)</span>
            </label>
            <input
              type="url"
              value={formData.affiliate_url}
              onChange={(e) => setFormData({ ...formData, affiliate_url: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          {editingBook && (
            <button
              type="button"
              onClick={() => {
                setEditingBook(null);
                setFormData({
                  title: '',
                  title_ch: '',
                  author: '',
                  cover_image: '',
                  category_id: categories[0].id,
                  description: '',
                  slug: '',
                  affiliate_url: ''
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : editingBook ? (
              'Update Book'
            ) : (
              'Add Book'
            )}
          </button>
        </div>
      </form>

      {/* Books and Chapters List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="divide-y divide-gray-200">
          {books.map((book) => (
            <div key={book.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {book.coverImage && (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{book.title}</h3>
                    <p className="text-sm text-gray-500">{book.titleCh}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleEdit(book)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setExpandedBook(expandedBook === book.id ? null : book.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {expandedBook === book.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Chapters */}
              {expandedBook === book.id && (
                <div className="mt-4 pl-16">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium text-gray-700">Chapters</h4>
                    <button
                      onClick={() => handleAddChapter(book.id)}
                      className="flex items-center px-3 py-1 text-sm bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Chapter
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(chapters[book.id] || []).map((chapter) => (
                      <div
                        key={chapter.id}
                        className={`p-4 rounded-md border ${
                          selectedChapter === chapter.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h5 className="font-medium text-gray-900">{chapter.title}</h5>
                            <p className="text-sm text-gray-500">{chapter.titleCh}</p>
                          </div>
                          <button
                            onClick={() => setSelectedChapter(
                              selectedChapter === chapter.id ? null : chapter.id
                            )}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            {selectedChapter === chapter.id ? 'Close' : 'Edit Content'}
                          </button>
                        </div>
                        {selectedChapter === chapter.id && (
                          <div className="mt-4">
                            <ChapterContentForm
                              chapterId={chapter.id}
                              onSave={() => {
                                setSelectedChapter(null);
                                fetchBooks();
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;