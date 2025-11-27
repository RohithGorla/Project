require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// middlewares
app.use(cors());          // simple, works for localhost:3000
app.use(express.json());

// routes
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const teamRoutes = require('./routes/teams');
const logRoutes = require('./routes/logs');

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/logs', logRoutes);

// health check
app.get('/', (req, res) => res.send('HRMS API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
