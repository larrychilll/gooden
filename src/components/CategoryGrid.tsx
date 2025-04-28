import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../data/categories';

const CategoryGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/category/${category.slug}`}
          className="group relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:-translate-y-1"
        >
          <div className="aspect-square">
            <img
              src={category.image}
              alt={category.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
            <div className="absolute bottom-0 p-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {category.name}
              </h2>
              <p className="text-base text-gray-200">
                {category.nameEn}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;