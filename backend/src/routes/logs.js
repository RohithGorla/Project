// backend/src/routes/logs.js
const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middlewares/authMiddleware');
const { listLogs } = require('../controllers/logController');

// Logs are protected routes
router.use(authMiddleware);

// GET /api/logs
router.get('/', listLogs);

module.exports = router;
