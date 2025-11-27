import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './Employees.css';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const loadEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load employees');
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/employees', form);
      setForm({ firstName: '', lastName: '', email: '', phone: '' });
      loadEmployees();
    } catch (err) {
      console.error(err);
      alert('Failed to add employee');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await api.delete(`/employees/${id}`);
      loadEmployees();
    } catch (err) {
      console.error(err);
      alert('Failed to delete employee');
    }
  };

  return (
    <div className="emp-page">
      <div className="emp-card">
        <h2 className="emp-title">Employees</h2>

        <form className="emp-form" onSubmit={handleSubmit}>
          <div className="emp-form-row">
            <input
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="emp-form-row">
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="emp-add-btn">
            Add Employee
          </button>
        </form>

        <div className="emp-list">
          {employees.length === 0 ? (
            <p className="emp-empty">No employees yet. Add one above.</p>
          ) : (
            <table className="emp-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th style={{ width: '80px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((e) => (
                  <tr key={e.id}>
                    <td>{e.firstName} {e.lastName}</td>
                    <td>{e.email || '-'}</td>
                    <td>{e.phone || '-'}</td>
                    <td>
                      <button
                        className="emp-delete-btn"
                        onClick={() => handleDelete(e.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Employees;
