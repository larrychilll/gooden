import React, { useState } from 'react';
import { BookOpen, BookText, Languages, Loader2 } from 'lucide-react';
import { useSummary } from '../context/SummaryContext';
import { SummaryFormData } from '../types';

const languageOptions = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Japanese', 'Chinese', 'Korean'];

const SummaryForm: React.FC = () => {
  const { generateNewSummary, isLoading } = useSummary();
  const [formData, setFormData] = useState<SummaryFormData>({
    bookTitle: '',
    chapterName: '',
    language1: 'English',
    language2: 'Spanish',
  });
  const [errors, setErrors] = useState({
    bookTitle: '',
    chapterName: '',
    languages: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Check if languages are the same
    if ((name === 'language1' || name === 'language2') && 
        (name === 'language1' ? value === formData.language2 : formData.language1 === value)) {
      setErrors(prev => ({ ...prev, languages: 'Please select two different languages' }));
    } else if (errors.languages) {
      setErrors(prev => ({ ...prev, languages: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      bookTitle: formData.bookTitle.trim() ? '' : 'Book title is required',
      chapterName: formData.chapterName.trim() ? '' : 'Chapter name is required',
      languages: formData.language1 === formData.language2 ? 'Please select two different languages' : '',
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    await generateNewSummary(formData);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8 max-w-md w-full mx-auto transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-serif font-semibold mb-6 text-gray-800 border-b pb-2">Generate Summary</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="bookTitle" className="block text-sm font-medium text-gray-700">
            Book Title
          </label>
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <input
              type="text"
              id="bookTitle"
              name="bookTitle"
              value={formData.bookTitle}
              onChange={handleChange}
              placeholder="Enter book title"
              className={`pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border ${
                errors.bookTitle ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.bookTitle && <p className="text-red-500 text-xs mt-1">{errors.bookTitle}</p>}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="chapterName" className="block text-sm font-medium text-gray-700">
            Chapter Name
          </label>
          <div className="relative">
            <BookText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <input
              type="text"
              id="chapterName"
              name="chapterName"
              value={formData.chapterName}
              onChange={handleChange}
              placeholder="Enter chapter name"
              className={`pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border ${
                errors.chapterName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.chapterName && <p className="text-red-500 text-xs mt-1">{errors.chapterName}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="language1" className="block text-sm font-medium text-gray-700">
              Primary Language
            </label>
            <div className="relative">
              <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <select
                id="language1"
                name="language1"
                value={formData.language1}
                onChange={handleChange}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
              >
                {languageOptions.map(lang => (
                  <option key={`lang1-${lang}`} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="language2" className="block text-sm font-medium text-gray-700">
              Secondary Language
            </label>
            <div className="relative">
              <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <select
                id="language2"
                name="language2"
                value={formData.language2}
                onChange={handleChange}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
              >
                {languageOptions.map(lang => (
                  <option key={`lang2-${lang}`} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {errors.languages && <p className="text-red-500 text-xs">{errors.languages}</p>}
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Generating...
            </>
          ) : (
            'Generate Summary'
          )}
        </button>
      </form>
    </div>
  );
};

export default SummaryForm;