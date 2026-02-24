/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Download, FileText, Printer, TrendingUp, TrendingDown, IndianRupee, Package, Calendar } from 'lucide-react';
import { reportAPI, supplierAPI, itemAPI } from '../services/api';
import { useLoading } from '../context/LoadingContext';
import { toast } from 'react-toastify';

const Reports: React.FC = () => {
  const [dateFilter, setDateFilter] = useState('today');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [itemId, setItemId] = useState('');
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [charts, setCharts] = useState<any>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 });
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    fetchSuppliers();
    fetchItems();
  }, []);

  useEffect(() => {
    fetchReports();
  }, [dateFilter, pagination.page, supplierId, itemId]);

  const fetchSuppliers = async () => {
    try {
      const response = await supplierAPI.getSuppliers();
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await itemAPI.getItems();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const getDateRange = () => {
    const now = new Date();
    let startDate, endDate;

    switch (dateFilter) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        endDate = new Date();
        break;
      case 'month':
        startDate = new Date(now.setDate(now.getDate() - 30));
        endDate = new Date();
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date();
        break;
      case 'overall':
        startDate = new Date('2020-01-01');
        endDate = new Date();
        break;
      case 'custom':
        startDate = customStartDate ? new Date(customStartDate) : new Date('2020-01-01');
        endDate = customEndDate ? new Date(customEndDate) : new Date();
        break;
      default:
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date();
    }

    return { startDate: startDate.toISOString(), endDate: endDate.toISOString() };
  };

  const fetchReports = async () => {
    showLoading('Loading reports...');
    try {
      const { startDate, endDate } = getDateRange();
      const params: any = { startDate, endDate, page: pagination.page, limit: pagination.limit };
      
      if (supplierId) params.supplierId = supplierId;
      if (itemId) params.itemId = itemId;

      const [summaryRes, listRes, chartsRes] = await Promise.all([
        reportAPI.getSummary(params),
        reportAPI.getList(params),
        reportAPI.getCharts(params)
      ]);

      setSummary(summaryRes.data);
      setTransactions(listRes.data.transactions);
      setPagination(listRes.data.pagination);
      setCharts(chartsRes.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load reports');
    } finally {
      hideLoading();
    }
  };

  const downloadCSV = () => {
    const headers = ['Date', 'Item Name', 'Item Code', 'Type', 'Quantity', 'Price', 'Tax %', 'Tax Amount', 'Total Amount', 'Location', 'User'];
    const rows = transactions.map(t => [
      new Date(t.date).toLocaleString(),
      t.itemName,
      t.itemCode,
      t.type.toUpperCase(),
      t.quantity,
      t.price.toFixed(2),
      t.taxPercent,
      t.taxAmount.toFixed(2),
      t.totalAmount.toFixed(2),
      t.location,
      t.takenBy || '-'
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-report-${Date.now()}.csv`;
    a.click();
    toast.success('CSV downloaded');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Reports & Analytics</h1>
        <div className="flex gap-2">
          <button onClick={downloadCSV} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            <Download size={18} />
            CSV
          </button>
          <button onClick={handlePrint} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            <Printer size={18} />
            Print
          </button>
        </div>
      </div>

      {/* Date Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap gap-2 items-center mb-4">
          <Calendar className="text-gray-500" size={20} />
          <button onClick={() => setDateFilter('today')} className={`px-4 py-2 rounded-lg transition-colors ${dateFilter === 'today' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            Today
          </button>
          <button onClick={() => setDateFilter('week')} className={`px-4 py-2 rounded-lg transition-colors ${dateFilter === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            Last 7 Days
          </button>
          <button onClick={() => setDateFilter('month')} className={`px-4 py-2 rounded-lg transition-colors ${dateFilter === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            Last 30 Days
          </button>
          <button onClick={() => setDateFilter('year')} className={`px-4 py-2 rounded-lg transition-colors ${dateFilter === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            This Year
          </button>
          <button onClick={() => setDateFilter('overall')} className={`px-4 py-2 rounded-lg transition-colors ${dateFilter === 'overall' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            Overall
          </button>
          <button onClick={() => setDateFilter('custom')} className={`px-4 py-2 rounded-lg transition-colors ${dateFilter === 'custom' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            Custom
          </button>
          {dateFilter === 'custom' && (
            <>
              <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} className="px-3 py-2 border rounded-lg" />
              <span className="text-gray-500">to</span>
              <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} className="px-3 py-2 border rounded-lg" />
              <button onClick={fetchReports} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Apply
              </button>
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">All Suppliers</option>
            {suppliers.map((supplier) => (
              <option key={supplier.supplierId} value={supplier.supplierId}>{supplier.supplierName}</option>
            ))}
          </select>
          <select value={itemId} onChange={(e) => setItemId(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">All Products</option>
            {items.map((item) => (
              <option key={item.itemId} value={item.itemId}>{item.itemName} ({item.itemCode})</option>
            ))}
          </select>
          {(supplierId || itemId) && (
            <button onClick={() => { setSupplierId(''); setItemId(''); }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Check-In</p>
                <p className="text-2xl font-bold text-green-600 mt-1">₹{summary.totalCheckInAmount.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">{summary.totalCheckInQty} items</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Check-Out</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">₹{summary.totalCheckOutAmount.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">{summary.totalCheckOutQty} items</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue (Profit)</p>
                <p className={`text-2xl font-bold mt-1 ${summary.revenue >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                  ₹{summary.revenue.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">CheckOut - CheckIn</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{summary.totalTransactions}</p>
                <p className="text-xs text-gray-500 mt-1">{summary.totalQuantity} total qty</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      {charts && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Trend</h3>
            <div className="space-y-2">
              {charts.dailyTrend.slice(0, 10).map((day: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{new Date(day.date).toLocaleDateString()}</span>
                  <div className="flex gap-4">
                    <span className="text-green-600">In: ₹{day.checkIn.toFixed(2)}</span>
                    <span className="text-blue-600">Out: ₹{day.checkOut.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Check-In Products</h3>
            <div className="space-y-2">
              {charts.topCheckIn.map((product: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{product.name}</span>
                  <span className="text-sm font-semibold text-green-600">{product.quantity} units</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Check-Out Products</h3>
            <div className="space-y-2">
              {charts.topCheckOut.map((product: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{product.name}</span>
                  <span className="text-sm font-semibold text-blue-600">{product.quantity} units</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((t) => (
                <tr key={t.transactionId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{t.itemName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{t.itemCode}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${t.type === 'checkin' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {t.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{t.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">₹{t.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{t.taxPercent}%</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{t.totalAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} transactions
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
