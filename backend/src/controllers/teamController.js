// backend/src/controllers/teamController.js
const { Team, Employee, EmployeeTeam, Log } = require('../../models');

// GET /api/teams
const listTeams = async (req, res) => {
  try {
    const teams = await Team.findAll({
      where: { organisationId: req.user.orgId },
    });
    res.json(teams);
  } catch (err) {
    console.error('listTeams error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/teams/:id
const getTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findOne({
      where: { id, organisationId: req.user.orgId },
      include: [
        {
          model: Employee,
          through: { attributes: [] }, // hide join table fields
        },
      ],
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json(team);
  } catch (err) {
    console.error('getTeam error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/teams
const createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const team = await Team.create({
      organisationId: req.user.orgId,
      name,
      description,
    });

    await Log.create({
      organisationId: req.user.orgId,
      userId: req.user.userId,
      action: 'team_created',
      meta: JSON.stringify({ teamId: team.id }),
    });

    res.status(201).json(team);
  } catch (err) {
    console.error('createTeam error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/teams/:id
const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const team = await Team.findOne({
      where: { id, organisationId: req.user.orgId },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    team.name = name ?? team.name;
    team.description = description ?? team.description;

    await team.save();

    await Log.create({
      organisationId: req.user.orgId,
      userId: req.user.userId,
      action: 'team_updated',
      meta: JSON.stringify({ teamId: team.id }),
    });

    res.json(team);
  } catch (err) {
    console.error('updateTeam error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/teams/:id
const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findOne({
      where: { id, organisationId: req.user.orgId },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    await team.destroy();

    await Log.create({
      organisationId: req.user.orgId,
      userId: req.user.userId,
      action: 'team_deleted',
      meta: JSON.stringify({ teamId: id }),
    });

    res.json({ message: 'Team deleted' });
  } catch (err) {
    console.error('deleteTeam error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/teams/:teamId/assign
// body: { employeeId } OR { employeeIds: [] }
const assignEmployees = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { employeeId, employeeIds } = req.body;

    const team = await Team.findOne({
      where: { id: teamId, organisationId: req.user.orgId },
    });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const ids = employeeIds || (employeeId ? [employeeId] : []);
    if (!ids.length) {
      return res.status(400).json({ message: 'No employeeId(s) provided' });
    }

    // ensure employees belong to same org
    const employees = await Employee.findAll({
      where: { id: ids, organisationId: req.user.orgId },
    });

    if (!employees.length) {
      return res.status(400).json({ message: 'No valid employees for this organisation' });
    }

    for (const emp of employees) {
      await EmployeeTeam.findOrCreate({
        where: { employeeId: emp.id, teamId: team.id },
      });

      await Log.create({
        organisationId: req.user.orgId,
        userId: req.user.userId,
        action: 'employee_assigned_to_team',
        meta: JSON.stringify({ employeeId: emp.id, teamId: team.id }),
      });
    }

    res.json({ message: 'Employees assigned to team' });
  } catch (err) {
    console.error('assignEmployees error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/teams/:teamId/unassign
// body: { employeeId }
const unassignEmployee = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ message: 'employeeId is required' });
    }

    const team = await Team.findOne({
      where: { id: teamId, organisationId: req.user.orgId },
    });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    await EmployeeTeam.destroy({
      where: { employeeId, teamId },
    });

    await Log.create({
      organisationId: req.user.orgId,
      userId: req.user.userId,
      action: 'employee_unassigned_from_team',
      meta: JSON.stringify({ employeeId, teamId }),
    });

    res.json({ message: 'Employee unassigned from team' });
  } catch (err) {
    console.error('unassignEmployee error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  listTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  assignEmployees,
  unassignEmployee,
};
