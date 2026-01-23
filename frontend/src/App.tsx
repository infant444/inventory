import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { LoadingProvider } from './context/LoadingContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Items from './pages/Items';
import Locations from './pages/Locations';
import UsersPage from './pages/Users';
import Suppliers from './pages/Suppliers';
import Categories from './pages/Categories';
import TaxSettings from './pages/TaxSettings';
import Settings from './pages/Settings';
import { ToastContainer } from 'react-toastify';
// import LocationSelector from './components/LocationSelector';

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <LoadingProvider>
          <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
        />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="items" element={<Items />} />
              <Route path="locations" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <Locations />
                </ProtectedRoute>
              } />
              <Route path="users" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <UsersPage />
                </ProtectedRoute>
              } />
              <Route path="suppliers" element={
                <ProtectedRoute requiredRoles={['admin', 'manager']}>
                  <Suppliers />
                </ProtectedRoute>
              } />
              <Route path="categories" element={
                <ProtectedRoute requiredRoles={['admin', 'manager']}>
                  <Categories />
                </ProtectedRoute>
              } />
              <Route path="tax" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <TaxSettings />
                </ProtectedRoute>
              } />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
        </LoadingProvider>
      </LocationProvider>
    </AuthProvider>
  );
}

export default App;