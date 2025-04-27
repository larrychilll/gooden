import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, RequireAuth } from './lib/auth';
import HomePage from './pages/HomePage';
import BookPage from './pages/BookPage';
import ChapterPage from './pages/ChapterPage';
import CategoryPage from './pages/CategoryPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header'; // <--- make sure you have a Header component

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header /> {/* ✅ Move Header outside main */}
          <main className="flex-1">
            <div className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/category/:categorySlug" element={<CategoryPage />} />
                <Route path="/book/:bookSlug" element={<BookPage />} />
                <Route path="/book/:bookSlug/chapter/:chapterSlug" element={<ChapterPage />} />
                <Route path="/self-growth" element={<CategoryPage />} />
                <Route path="/finance" element={<CategoryPage />} />
                <Route path="/relationships" element={<CategoryPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/admin"
                  element={
                    <RequireAuth>
                      <AdminPage />
                    </RequireAuth>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
          <footer className="bg-[#1F242C] py-6">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-start">
                <img
                  src="/GoodENBooks.png"
                  alt="Good EN Books Logo"
                  className="h-8 w-auto mb-2"
                />
                <div className="text-white">
                  © 2025 Good EN Books ｜ 精選優質英文書籍，附中英文摘要與學習內容
                </div>
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
