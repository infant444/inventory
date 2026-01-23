/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Package, 
  MapPin, 
  Users, 
  Truck, 
  TrendingUp, 
  AlertTriangle,
  Activity,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Items',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Locations',
      value: '8',
      change: '+2',
      changeType: 'positive',
      icon: MapPin,
      color: 'bg-green-500'
    },
    {
      title: 'Low Stock Alerts',
      value: '23',
      change: '+5',
      changeType: 'negative',
      icon: AlertTriangle,
      color: 'bg-red-500'
    },
    {
      title: 'Active Users',
      value: '45',
      change: '+3',
      changeType: 'positive',
      icon: Users,
      color: 'bg-purple-500'
    }
  ];

  const recentActivity = [
    { action: 'Item added', item: 'Laptop Dell XPS', user: 'John Doe', time: '2 hours ago' },
    { action: 'Stock updated', item: 'Office Chair', user: 'Jane Smith', time: '4 hours ago' },
    { action: 'Location created', item: 'Warehouse B', user: 'Admin', time: '1 day ago' },
    { action: 'User registered', item: 'Mike Johnson', user: 'Admin', time: '2 days ago' },
  ];

  return (
    <div className="">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.full_name}!
        </h1>
        <p className="text-blue-100">
          Here's what's happening with your inventory today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <Activity className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}: <span className="text-blue-600">{activity.item}</span>
                  </p>
                  <p className="text-xs text-gray-500">by {activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            <TrendingUp className="w-5 h-5 text-gray-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Package className="w-8 h-8 text-blue-500 mb-2" />
              <p className="font-medium text-gray-900">Add Item</p>
              <p className="text-sm text-gray-500">Create new inventory item</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <MapPin className="w-8 h-8 text-green-500 mb-2" />
              <p className="font-medium text-gray-900">New Location</p>
              <p className="text-sm text-gray-500">Add warehouse location</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Truck className="w-8 h-8 text-purple-500 mb-2" />
              <p className="font-medium text-gray-900">Add Supplier</p>
              <p className="text-sm text-gray-500">Register new supplier</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Users className="w-8 h-8 text-orange-500 mb-2" />
              <p className="font-medium text-gray-900">Manage Users</p>
              <p className="text-sm text-gray-500">User administration</p>
            </button>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h2>
          <AlertTriangle className="w-5 h-5 text-red-500" />
        </div>
        <div className="space-y-3">
          {[
            { item: 'Office Supplies - Pens', current: 5, minimum: 20, location: 'Main Office' },
            { item: 'Laptop Chargers', current: 2, minimum: 10, location: 'IT Department' },
            { item: 'Printer Paper A4', current: 8, minimum: 50, location: 'Warehouse A' },
          ].map((alert, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{alert.item}</p>
                <p className="text-sm text-gray-600">{alert.location}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-red-600">
                  {alert.current} / {alert.minimum}
                </p>
                <p className="text-xs text-red-500">Below minimum</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;