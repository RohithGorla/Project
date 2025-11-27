// backend/src/routes/teams.js
const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  listTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  assignEmployees,
  unassignEmployee,
} = require('../controllers/teamController');

// All /api/teams endpoints require auth
router.use(authMiddleware);

// CRUD
// GET /api/teams
router.get('/', listTeams);

// GET /api/teams/:id
router.get('/:id', getTeam);

// POST /api/teams
router.post('/', createTeam);

// PUT /api/teams/:id
router.put('/:id', updateTeam);

// DELETE /api/teams/:id
router.delete('/:id', deleteTeam);

// Assign employees
// POST /api/teams/:teamId/assign
router.post('/:teamId/assign', assignEmployees);

// Unassign employee
// DELETE /api/teams/:teamId/unassign
router.delete('/:teamId/unassign', unassignEmployee);

module.exports = router;
