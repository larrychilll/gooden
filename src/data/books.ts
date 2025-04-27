import { Book } from '../types';

export const books: Book[] = [
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    titleEn: 'Atomic Habits',
    titleCh: '原子習慣',
    author: 'James Clear',
    coverImage: 'https://images.pexels.com/photos/3747505/pexels-photo-3747505.jpeg',
    categoryId: 'self-improvement',
    description: 'An easy and proven way to build good habits and break bad ones.',
    slug: 'atomic-habits',
    affiliateUrl: 'https://amzn.to/atomic-habits'
  },
  {
    id: 'deep-work',
    title: 'Deep Work',
    titleEn: 'Deep Work',
    titleCh: '深度工作力',
    author: 'Cal Newport',
    coverImage: 'https://images.pexels.com/photos/4065876/pexels-photo-4065876.jpeg',
    categoryId: 'self-improvement',
    description: 'Rules for Focused Success in a Distracted World',
    slug: 'deep-work',
    affiliateUrl: 'https://amzn.to/deep-work'
  },
  {
    id: 'intelligent-investor',
    title: 'The Intelligent Investor',
    titleEn: 'The Intelligent Investor',
    titleCh: '聰明的投資者',
    author: 'Benjamin Graham',
    coverImage: 'https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg',
    categoryId: 'business',
    description: 'The definitive book on value investing, written by the greatest investment advisor of the twentieth century.',
    slug: 'intelligent-investor',
    affiliateUrl: 'https://amzn.to/intelligent-investor'
  }
];