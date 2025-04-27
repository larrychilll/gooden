import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path: string) => {
    if (path === '/self-growth') {
      return location.pathname.includes('self-improvement');
    }
    if (path === '/finance') {
      return location.pathname.includes('business');
    }
    if (path === '/relationships') {
      return location.pathname.includes('relationships');
    }
    return location.pathname === path;
  };

  return (
    <header className="h-24 bg-[#1F242C] flex items-center relative">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src="/GoodEnBooks.png" 
            alt="Good EN Books Logo" 
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 text-white hover:text-[#FF9000]"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/category/self-improvement" 
            className={`transition-colors duration-200 ${
              isActive('/self-growth') ? 'text-[#FF9000]' : 'text-white hover:text-[#FF9000]'
            }`}
          >
            自我成長
          </Link>
          <Link 
            to="/category/business" 
            className={`transition-colors duration-200 ${
              isActive('/finance') ? 'text-[#FF9000]' : 'text-white hover:text-[#FF9000]'
            }`}
          >
            商業金融
          </Link>
          <Link 
            to="/category/relationships" 
            className={`transition-colors duration-200 ${
              isActive('/relationships') ? 'text-[#FF9000]' : 'text-white hover:text-[#FF9000]'
            }`}
          >
            人際關係
          </Link>
          <Link 
            to="/about" 
            className={`transition-colors duration-200 ${
              isActive('/about') ? 'text-[#FF9000]' : 'text-white hover:text-[#FF9000]'
            }`}
          >
            About Us
          </Link>
        </div>
      </div>

      {/* Mobile navigation dropdown */}
      {isMenuOpen && (
        <div className="absolute top-24 left-0 w-full bg-[#1F242C] flex flex-col items-center space-y-6 py-6 z-50">
          <Link 
            to="/category/self-improvement"
            className={`text-lg transition-colors duration-200 ${
              isActive('/self-growth') ? 'text-[#FF9000]' : 'text-white hover:text-[#FF9000]'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            自我成長
          </Link>
          <Link 
            to="/category/business"
            className={`text-lg transition-colors duration-200 ${
              isActive('/finance') ? 'text-[#FF9000]' : 'text-white hover:text-[#FF9000]'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            商業金融
          </Link>
          <Link 
            to="/category/relationships"
            className={`text-lg transition-colors duration-200 ${
              isActive('/relationships') ? 'text-[#FF9000]' : 'text-white hover:text-[#FF9000]'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            人際關係
          </Link>
          <Link 
            to="/about"
            className={`text-lg transition-colors duration-200 ${
              isActive('/about') ? 'text-[#FF9000]' : 'text-white hover:text-[#FF9000]'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            About Us
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
