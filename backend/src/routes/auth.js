const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register); // /api/auth/register
router.post('/login', login);       // /api/auth/login

module.exports = router;
