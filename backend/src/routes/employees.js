// backend/src/routes/employees.js
const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');

// all /api/employees routes need JWT
router.use(authMiddleware);

// GET /api/employees
router.get('/', listEmployees);

// GET /api/employees/:id
router.get('/:id', getEmployee);

// POST /api/employees
router.post('/', createEmployee);

// PUT /api/employees/:id
router.put('/:id', updateEmployee);

// DELETE /api/employees/:id
router.delete('/:id', deleteEmployee);

module.exports = router;
