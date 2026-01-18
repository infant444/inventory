/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation as useSelectedLocation } from '../context/LocationContext';
import { authAPI, locationAPI } from '../services/api';
import LocationSelector from './LocationSelector';
import { 
  Menu, 
  X, 
  Home, 
  Package, 
  MapPin, 
  Users, 
  Truck, 
  Tags, 
  Calculator, 
  LogOut,
  User,
  Bell,
  ChevronDown,
  Settings as SettingsIcon
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [availableLocations, setAvailableLocations] = useState<any[]>([]);
  const { user, logout } = useAuth();
  const { selectedLocation, setSelectedLocation } = useSelectedLocation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (selectedLocation) {
      fetchUserLocations();
    }
  }, [selectedLocation]);

  const fetchUserLocations = async () => {
    try {
      const response = await locationAPI.getUserLocation();
      setAvailableLocations(response.data);
    } catch (error) {
      console.error('Error fetching user locations:', error);
    }
  };

  // Show location selector if no location is selected
  if (!selectedLocation) {
    return <LocationSelector />;
  }

  const handleLocationChange = (location: any) => {
    setSelectedLocation(location);
    setShowLocationDropdown(false);
  };

  const handleLogout = () => {
    authAPI.logout();
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', roles: ['admin', 'manager', 'staff'] },
    { icon: Package, label: 'Items', path: '/dashboard/items', roles: ['admin', 'manager', 'staff'] },
    { icon: MapPin, label: 'Locations', path: '/dashboard/locations', roles: ['admin'] },
    { icon: Users, label: 'Users', path: '/dashboard/users', roles: ['admin'] },
    { icon: Truck, label: 'Suppliers', path: '/dashboard/suppliers', roles: ['admin', 'manager'] },
    { icon: Tags, label: 'Categories', path: '/dashboard/categories', roles: ['admin', 'manager'] },
    { icon: Calculator, label: 'Tax Settings', path: '/dashboard/tax', roles: ['admin'] },
    { icon: SettingsIcon, label: 'Settings', path: '/dashboard/settings', roles: ['admin', 'manager', 'staff'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || 'staff')
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Inventory</h1>
            <p className="text-xs text-gray-500">{selectedLocation.locationName}</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between lg:justify-end h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center  space-x-4">
              <div className="hidden md:block relative">
                <button
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  className="flex items-center bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-700">{selectedLocation.locationCode}</span>
                  <ChevronDown className="w-4 h-4 text-green-600 ml-2" />
                </button>
                {showLocationDropdown && (
                  <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] z-50">
                    {availableLocations.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-gray-500">No other locations</div>
                    ) : (
                      availableLocations.map((loc) => (
                        <button
                          key={loc.locationId}
                          onClick={() => handleLocationChange(loc)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                            loc.locationId === selectedLocation.locationId ? 'bg-green-50 text-green-700' : 'text-gray-700'
                          }`}
                        >
                          <div className="font-medium">{loc.locationName}</div>
                          <div className="text-xs text-gray-500">{loc.locationCode}</div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              
              <button className="text-gray-500 hover:text-gray-700">
                <Bell className="w-6 h-6" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;