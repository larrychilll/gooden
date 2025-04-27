import React from 'react';
import CategoryGrid from '../components/CategoryGrid';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-12">
      <div className="md:max-w-3xl md:text-left mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          讀本好的英文書籍摘要，三種實力同步升級：
        </h1>
        <h2 className="text-3xl font-bold text-gray-900">
          吸收新知、精進英文、挑戰英文檢定考題！
        </h2>
      </div>
      <CategoryGrid />
    </div>
  );
};

export default HomePage;