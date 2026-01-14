import React from 'react';
import { Truck } from 'lucide-react';

const Suppliers: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
          Add Supplier
        </button>
      </div>
      
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
        <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Supplier Management</h2>
        <p className="text-gray-600">Manage supplier information and relationships.</p>
      </div>
    </div>
  );
};

export default Suppliers;