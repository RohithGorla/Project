import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [logs, setLogs] = useState([]);

  const loadData = async () => {
    try {
      const [empRes, teamRes, logRes] = await Promise.all([
        api.get('/employees'),
        api.get('/teams'),
        api.get('/logs'),
      ]);
      setEmployees(empRes.data || []);
      setTeams(teamRes.data || []);
      setLogs((logRes.data || []).slice(0, 5)); // latest 5
    } catch (err) {
      console.error(err);
      alert('Failed to load dashboard data');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="dash-page">
      <div className="dash-card">
        <h2 className="dash-title">Dashboard</h2>

        {/* Stats */}
        <div className="dash-stats">
          <div className="dash-stat-box">
            <div className="dash-stat-label">Employees</div>
            <div className="dash-stat-value">{employees.length}</div>
          </div>
          <div className="dash-stat-box">
            <div className="dash-stat-label">Teams</div>
            <div className="dash-stat-value">{teams.length}</div>
          </div>
          <div className="dash-stat-box">
            <div className="dash-stat-label">Recent Logs</div>
            <div className="dash-stat-value">{logs.length}</div>
          </div>
        </div>

        {/* Recent Logs */}
        <div className="dash-logs">
          <h3>Recent Activity</h3>
          {logs.length === 0 ? (
            <p className="dash-empty">No logs yet. Perform some actions to see history.</p>
          ) : (
            <table className="dash-log-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Action</th>
                  <th>User ID</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{new Date(log.createdAt || log.timestamp).toLocaleString()}</td>
                    <td>{log.action}</td>
                    <td>{log.userId || '-'}</td>
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

export default Dashboard;
