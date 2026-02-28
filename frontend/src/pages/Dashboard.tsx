/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, FileText, Users, TrendingUp, TrendingDown, Clock, DollarSign } from 'lucide-react';
import { dashboardAPI } from '../services/api';
import { useLoading } from '../context/LoadingContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<any[]>([]);
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    showLoading('Loading dashboard...');
    try {
      const [statsRes, transactionsRes, invoicesRes, alertsRes] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getRecentTransactions(),
        dashboardAPI.getRecentInvoices(),
        dashboardAPI.getLowStockAlerts()
      ]);
      setStats(statsRes.data);
      setRecentTransactions(transactionsRes.data);
      setRecentInvoices(invoicesRes.data);
      setLowStockAlerts(alertsRes.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load dashboard');
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalItems || 0}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.activeInvoices || 0}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FileText className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.pendingInvoices || 0}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock Alerts</p>
              <p className="text-2xl font-bold text-red-600">{stats?.lowStockAlerts || 0}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => navigate('/items')} className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition">
            <Package className="mx-auto mb-2 text-blue-600" size={24} />
            <p className="text-sm font-medium">Manage Items</p>
          </button>
          <button onClick={() => navigate('/checkin-checkout')} className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition">
            <TrendingUp className="mx-auto mb-2 text-green-600" size={24} />
            <p className="text-sm font-medium">Check In/Out</p>
          </button>
          <button onClick={() => navigate('/payment-tracker')} className="p-4 border-2 border-yellow-200 rounded-lg hover:bg-yellow-50 transition">
            <FileText className="mx-auto mb-2 text-yellow-600" size={24} />
            <p className="text-sm font-medium">Invoices</p>
          </button>
          <button onClick={() => navigate('/reports')} className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition">
            <DollarSign className="mx-auto mb-2 text-purple-600" size={24} />
            <p className="text-sm font-medium">Reports</p>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <button onClick={() => navigate('/reports')} className="text-sm text-blue-600 hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No recent transactions</p>
            ) : (
              recentTransactions.map((txn, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {txn.transactionType === 'checkin' ? (
                      <TrendingUp className="text-green-600" size={20} />
                    ) : (
                      <TrendingDown className="text-blue-600" size={20} />
                    )}
                    <div>
                      <p className="text-sm font-medium">{txn.item.itemName}</p>
                      <p className="text-xs text-gray-500">{new Date(txn.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{txn.quantity} {txn.quantityType}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${txn.transactionType === 'checkin' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {txn.transactionType.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Invoices</h2>
            <button onClick={() => navigate('/payment-tracker')} className="text-sm text-blue-600 hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {recentInvoices.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No recent invoices</p>
            ) : (
              recentInvoices.map((invoice, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{invoice.invoiceName}</p>
                    <p className="text-xs text-gray-500">{invoice.invoiceNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">₹{Number(invoice.amount).toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                      invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      invoice.status === 'overdue' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {invoice.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-red-600">Low Stock Alerts</h2>
          <button onClick={() => navigate('/items')} className="text-sm text-blue-600 hover:underline">View All Items</button>
        </div>
        {lowStockAlerts.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No low stock alerts</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Current Qty</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ROL</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {lowStockAlerts.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{item.itemCode}</td>
                    <td className="px-4 py-3 text-sm font-medium">{item.itemName}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="text-red-600 font-semibold">{item.currentQty}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">{item.rol}</td>
                    <td className="px-4 py-3 text-sm">{item.supplier || '-'}</td>
                    <td className="px-4 py-3 text-sm">{item.category || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
