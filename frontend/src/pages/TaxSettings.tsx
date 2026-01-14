import React from 'react';
import { Calculator } from 'lucide-react';

const TaxSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tax Settings</h1>
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
          Add Tax Rate
        </button>
      </div>
      
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
        <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Tax Configuration</h2>
        <p className="text-gray-600">Configure tax rates and calculations.</p>
      </div>
    </div>
  );
};

export default TaxSettings;