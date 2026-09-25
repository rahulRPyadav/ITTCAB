import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminTourLeads from './pages/AdminTourLeads';
import AdminCabBookings from './pages/AdminCabBookings';
import AdminManageTours from './pages/AdminManageTours';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin-login" element={<AdminLogin />} />
        
        {/* Nested Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        >
          <Route path="tour-leads" element={<AdminTourLeads />} />
          <Route path="cab-bookings" element={<AdminCabBookings />} />
          <Route path="manage-tours" element={<AdminManageTours />} />
          <Route index element={<AdminTourLeads />} />
        </Route>

        <Route path="*" element={<Navigate to="/admin-login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;