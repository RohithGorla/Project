import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const res = await api.get('/logs');
        setLogs(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to load logs');
      }
    };
    loadLogs();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Audit Logs</h2>
      <ul>
        {logs.map((log) => (
          <li key={log.id}>
            [{log.createdAt}] {log.action} – userId: {log.userId}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Logs;
