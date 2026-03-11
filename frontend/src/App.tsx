import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import EmployeeFormPage from './pages/EmployeeForm';
import BulkUpload from './pages/BulkUpload';
import AuditLogs from './pages/AuditLogs';
import TrashPage from './pages/Trash';
import AdminLayout from './layouts/AdminLayout';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="employees/add" element={<EmployeeFormPage />} />
            <Route path="employees/edit/:id" element={<EmployeeFormPage />} />
            <Route path="upload" element={<BulkUpload />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="trash" element={<TrashPage />} />
            <Route path="settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Settings Module</h1><p className="text-slate-500">System settings coming soon.</p></div>} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
