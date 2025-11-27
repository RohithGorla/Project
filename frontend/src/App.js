import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';

import RegisterOrg from './pages/RegisterOrg';
import Login from './pages/Login';
import Employees from './pages/Employees';
import Teams from './pages/Teams';
import Logs from './pages/Logs';
import Dashboard from './pages/Dashboard';

function PrivateRoute({ token, children }) {
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('token');
    if (saved) setToken(saved);
  }, []);

  const handleAuthSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <div>
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: 10 }}>
        <Link to="/" style={{ marginRight: 10 }}>Home</Link>
        {token && (
          <>
            <Link to="/dashboard" style={{ marginRight: 10 }}>Dashboard</Link>
            <Link to="/employees" style={{ marginRight: 10 }}>Employees</Link>
            <Link to="/teams" style={{ marginRight: 10 }}>Teams</Link>
            <Link to="/logs" style={{ marginRight: 10 }}>Logs</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
        {!token && (
          <>
            <Link to="/login" style={{ marginRight: 10 }}>Login</Link>
            <Link to="/register">Register Org</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          }
        />

        {/* Public */}
        <Route path="/register" element={<RegisterOrg onAuthSuccess={handleAuthSuccess} />} />
        <Route path="/login" element={<Login onAuthSuccess={handleAuthSuccess} />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute token={token}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <PrivateRoute token={token}>
              <Employees />
            </PrivateRoute>
          }
        />
        <Route
          path="/teams"
          element={
            <PrivateRoute token={token}>
              <Teams />
            </PrivateRoute>
          }
        />
        <Route
          path="/logs"
          element={
            <PrivateRoute token={token}>
              <Logs />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
