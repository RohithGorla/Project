import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './Teams.css';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [teamDetails, setTeamDetails] = useState(null); // includes employees
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);

  const loadTeams = async () => {
    const res = await api.get('/teams');
    setTeams(res.data);
  };

  const loadEmployees = async () => {
    const res = await api.get('/employees');
    setEmployees(res.data);
  };

  const loadTeamDetails = async (teamId) => {
    if (!teamId) return;
    const res = await api.get(`/teams/${teamId}`);
    setTeamDetails(res.data);
  };

  useEffect(() => {
    loadTeams();
    loadEmployees();
  }, []);

  const handleTeamFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Team name is required');
      return;
    }
    await api.post('/teams', form);
    setForm({ name: '', description: '' });
    loadTeams();
  };

  const handleSelectTeam = (e) => {
    const teamId = e.target.value || null;
    setSelectedTeamId(teamId);
    setSelectedEmployeeIds([]);
    setTeamDetails(null);
    if (teamId) {
      loadTeamDetails(teamId);
    }
  };

  const handleAssignChange = (e) => {
    // multi-select
    const options = Array.from(e.target.selectedOptions);
    const ids = options.map((opt) => Number(opt.value));
    setSelectedEmployeeIds(ids);
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedTeamId) {
      alert('Select a team first');
      return;
    }
    if (!selectedEmployeeIds.length) {
      alert('Select at least one employee to assign');
      return;
    }

    await api.post(`/teams/${selectedTeamId}/assign`, {
      employeeIds: selectedEmployeeIds,
    });

    alert('Employees assigned');
    loadTeamDetails(selectedTeamId);
  };

  return (
    <div className="teams-page">
      <div className="teams-card">
        <h2 className="teams-title">Teams</h2>

        {/* Create Team */}
        <form className="teams-form" onSubmit={handleCreateTeam}>
          <div className="teams-form-row">
            <input
              name="name"
              placeholder="Team Name (e.g. Development)"
              value={form.name}
              onChange={handleTeamFormChange}
            />
          </div>
          <div className="teams-form-row">
            <input
              name="description"
              placeholder="Short Description (optional)"
              value={form.description}
              onChange={handleTeamFormChange}
            />
          </div>
          <button className="teams-btn" type="submit">
            Create Team
          </button>
        </form>

        {/* Select Team */}
        <div className="teams-select-row">
          <label>Select a team:</label>
          <select value={selectedTeamId || ''} onChange={handleSelectTeam}>
            <option value="">-- choose team --</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Assignment UI */}
        {selectedTeamId && (
          <div className="teams-assign-section">
            <h3>Assign Employees to Team</h3>
            <form onSubmit={handleAssign}>
              <div className="teams-multi-select-wrapper">
                <select
                  multiple
                  value={selectedEmployeeIds.map(String)}
                  onChange={handleAssignChange}
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.email || 'no email'})
                    </option>
                  ))}
                </select>
              </div>
              <p className="teams-hint">
                Hold <b>Ctrl</b> (Windows) or <b>Cmd</b> (Mac) to select multiple.
              </p>
              <button type="submit" className="teams-btn">
                Assign Selected Employees
              </button>
            </form>
          </div>
        )}

        {/* Current members */}
        {teamDetails && (
          <div className="teams-members">
            <h3>Employees in {teamDetails.name}</h3>
            {(!teamDetails.Employees || teamDetails.Employees.length === 0) ? (
              <p className="teams-empty">No employees assigned yet.</p>
            ) : (
              <ul>
                {teamDetails.Employees.map((emp) => (
                  <li key={emp.id}>
                    {emp.firstName} {emp.lastName} – {emp.email || '-'}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Teams;
