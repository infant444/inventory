import React from 'react';
import { Package } from 'lucide-react';

const Items: React.FC = () => {
  return (
    <div className="">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Items Management</h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
          Add New Item
        </button>
      </div>
      
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Items Management</h2>
        <p className="text-gray-600">This page will contain the items management interface.</p>
      </div>
    </div>
  );
};

export default Items;