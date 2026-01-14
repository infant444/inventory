import React from 'react';
import { Tags } from 'lucide-react';

const Categories: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors">
          Add Category
        </button>
      </div>
      
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
        <Tags className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Category Management</h2>
        <p className="text-gray-600">Organize items into categories and types.</p>
      </div>
    </div>
  );
};

export default Categories;