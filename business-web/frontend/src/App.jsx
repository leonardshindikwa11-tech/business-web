import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Debts from './pages/Debts';
import Customer from './pages/Customer';

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === 'customer' ? '/customer' : '/dashboard'} replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={
        <PrivateRoute roles={['owner', 'cashier']}>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/products" element={
        <PrivateRoute roles={['owner', 'cashier']}>
          <Products />
        </PrivateRoute>
      } />
      <Route path="/debts" element={
        <PrivateRoute roles={['owner', 'cashier']}>
          <Debts />
        </PrivateRoute>
      } />
      <Route path="/customer" element={
        <PrivateRoute roles={['customer']}>
          <Customer />
        </PrivateRoute>
      } />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
