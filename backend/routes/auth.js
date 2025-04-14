const express = require('express');
const router = express.Router();
const {register, login, refreshToken, logout} = require('../controllers/userController');

// ✅ Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken); // ✅ updated to match frontend
router.post('/logout', logout);              // ✅ expects refreshToken in body

module.exports = router;
