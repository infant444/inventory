/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Package } from 'lucide-react';
import { reportAPI } from '../services/api';
import { useLoading } from '../context/LoadingContext';
import { toast } from 'react-toastify';

const GroupedProducts: React.FC = () => {
  const [groupedData, setGroupedData] = useState<any[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    fetchGroupedProducts();
  }, []);

  const fetchGroupedProducts = async () => {
    showLoading('Loading...');
    try {
      const response = await reportAPI.getGroupedProducts();
      setGroupedData(response.data);
    } catch (error: any) {
      console.error('Error fetching grouped products:', error);
      toast.error(error.response?.data?.message || 'Failed to load');
    } finally {
      hideLoading();
    }
  };

  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Grouped Products Report</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          {groupedData.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No grouped products found</p>
          ) : (
            <div className="space-y-4">
              {groupedData.map((group, idx) => (
                <div key={idx} className="border rounded-lg overflow-hidden">
                  <div
                    onClick={() => toggleGroup(group.groupName)}
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {expandedGroups.has(group.groupName) ? (
                        <ChevronDown size={20} className="text-gray-600" />
                      ) : (
                        <ChevronRight size={20} className="text-gray-600" />
                      )}
                      <Package size={20} className="text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-lg">{group.groupName}</h3>
                        <p className="text-sm text-gray-600">{group.items.length} products</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Total Quantity</p>
                      <p className="text-2xl font-bold text-blue-600">{`${group.totalQty} ${group.qtyType}`}</p>
                    </div>
                  </div>

                  {expandedGroups.has(group.groupName) && (
                    <div className="p-4 bg-white">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pack Qty</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {group.items.map((item: any, itemIdx: number) => (
                            <tr key={itemIdx} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm">{item.itemCode}</td>
                              <td className="px-4 py-3 text-sm font-medium">{item.itemName}</td>
                              <td className="px-4 py-3 text-sm">{item.packQty}</td>
                              <td className="px-4 py-3 text-sm">{item.currentQty}</td>
                              <td className="px-4 py-3 text-sm font-semibold text-blue-600">{item.totalQty}</td>
                              <td className="px-4 py-3 text-sm">{item.quantityType}</td>
                              <td className="px-4 py-3 text-sm">{item.supplier || '-'}</td>
                              <td className="px-4 py-3 text-sm">{item.category || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupedProducts;
