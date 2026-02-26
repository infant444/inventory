import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LocationProvider } from "./context/LocationContext";
import { LoadingProvider } from "./context/LoadingContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Items from "./pages/Items";
import Locations from "./pages/Locations";
import UsersPage from "./pages/Users";
import Suppliers from "./pages/Suppliers";
import Categories from "./pages/Categories";
import TaxSettings from "./pages/TaxSettings";
import Settings from "./pages/Settings";
import CheckInOut from "./pages/CheckInOut";
import Reports from "./pages/Reports";
import PaymentTracker from "./pages/PaymentTracker";
import { ToastContainer } from "react-toastify";
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
            <AppRoutes />
          </Router>
        </LoadingProvider>
      </LocationProvider>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  const getDefaultRoute = () => {
    if (!user) return "/dashboard";
    if (user.role === "staff") return "/dashboard/checkin-checkout";
    if (user.role === "analyzer") return "/dashboard/reports";
    return "/dashboard";
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" index element={<Navigate to={getDefaultRoute()} replace />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <Navigate
              to={getDefaultRoute().replace("/dashboard", "")}
              replace
            />
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute requiredRoles={["admin", "manager"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="items"
          element={
            <ProtectedRoute requiredRoles={["admin", "manager"]}>
              <Items />
            </ProtectedRoute>
          }
        />
        <Route
          path="checkin-checkout"
          element={
            <ProtectedRoute requiredRoles={["admin", "staff"]}>
              <CheckInOut />
            </ProtectedRoute>
          }
        />
        <Route
          path="reports"
          element={
            <ProtectedRoute requiredRoles={["admin", "analyzer", "manager"]}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="payment-tracker"
          element={
            <ProtectedRoute requiredRoles={["admin", "analyzer", "manager"]}>
              <PaymentTracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="locations"
          element={
            <ProtectedRoute requiredRoles={["admin"]}>
              <Locations />
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute requiredRoles={["admin"]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="suppliers"
          element={
            <ProtectedRoute requiredRoles={["admin", "manager"]}>
              <Suppliers />
            </ProtectedRoute>
          }
        />
        <Route
          path="categories"
          element={
            <ProtectedRoute requiredRoles={["admin", "manager"]}>
              <Categories />
            </ProtectedRoute>
          }
        />
        <Route
          path="tax"
          element={
            <ProtectedRoute requiredRoles={["admin"]}>
              <TaxSettings />
            </ProtectedRoute>
          }
        />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  );
}

export default App;
