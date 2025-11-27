const { Employee, Log } = require('../../models');

// GET /api/employees
const listEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      where: { organisationId: req.user.orgId },
    });
    res.json(employees);
  } catch (err) {
    console.error('listEmployees error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/employees/:id
const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findOne({
      where: {
        id,
        organisationId: req.user.orgId,
      },
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (err) {
    console.error('getEmployee error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/employees
const createEmployee = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'First and last name are required' });
    }

    const employee = await Employee.create({
      organisationId: req.user.orgId,
      firstName,
      lastName,
      email,
      phone,
    });

    await Log.create({
      organisationId: req.user.orgId,
      userId: req.user.userId,
      action: 'employee_created',
      meta: JSON.stringify({ employeeId: employee.id }),
    });

    res.status(201).json(employee);
  } catch (err) {
    console.error('createEmployee error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/employees/:id
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone } = req.body;

    const employee = await Employee.findOne({
      where: { id, organisationId: req.user.orgId },
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    employee.firstName = firstName ?? employee.firstName;
    employee.lastName = lastName ?? employee.lastName;
    employee.email = email ?? employee.email;
    employee.phone = phone ?? employee.phone;

    await employee.save();

    await Log.create({
      organisationId: req.user.orgId,
      userId: req.user.userId,
      action: 'employee_updated',
      meta: JSON.stringify({ employeeId: employee.id }),
    });

    res.json(employee);
  } catch (err) {
    console.error('updateEmployee error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/employees/:id
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findOne({
      where: { id, organisationId: req.user.orgId },
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await employee.destroy();

    await Log.create({
      organisationId: req.user.orgId,
      userId: req.user.userId,
      action: 'employee_deleted',
      meta: JSON.stringify({ employeeId: id }),
    });

    res.json({ message: 'Employee deleted' });
  } catch (err) {
    console.error('deleteEmployee error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
