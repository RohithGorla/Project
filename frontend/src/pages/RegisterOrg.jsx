import React, { useState } from 'react';
import api from '../services/api';
import './Auth.css'; // Reuse the same styles

function RegisterOrg({ onAuthSuccess }) {
  const [form, setForm] = useState({
    orgName: '',
    adminName: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      const token = res.data.token;
      if (onAuthSuccess) onAuthSuccess(token);
    } catch (err) {
      alert(err.response?.data?.message || 'Error registering organisation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create Organisation</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>Organisation Name</label>
            <input
              name="orgName"
              placeholder="Example: Evallo"
              value={form.orgName}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label>Admin Name</label>
            <input
              name="adminName"
              placeholder="Your Name"
              value={form.adminName}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label>Email</label>
            <input
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Creating...' : 'Create Organisation & Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterOrg;
