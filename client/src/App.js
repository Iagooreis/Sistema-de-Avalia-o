import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import SearchDiscipline from './pages/SearchDiscipline';
import SearchProfessor from './pages/SearchProfessor';
import RateProfessor from './pages/RateProfessor';
import Profile from './pages/Profile';
import './styles/global.css';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search-discipline"
          element={
            <ProtectedRoute>
              <SearchDiscipline />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search-professor"
          element={
            <ProtectedRoute>
              <SearchProfessor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rate-professor"
          element={
            <ProtectedRoute>
              <RateProfessor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
