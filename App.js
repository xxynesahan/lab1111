import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import UserForm from './pages/UserForm';
import UserDetail from './pages/UserDetail';
import Login from './pages/Login';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        
        <Route path="/add-users" element={
          <ProtectedRoute>
            <UserForm />
          </ProtectedRoute>
        } />
        
        <Route path="/users/:id" element={
          <ProtectedRoute>
            <UserDetail />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;