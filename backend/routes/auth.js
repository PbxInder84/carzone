const express = require('express');
const { register, login, getMe, logout } = require('../controllers/auth');
const { protect } = require('../middlewares/auth');
const { validate, registerSchema, loginSchema } = require('../middlewares/validator');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

module.exports = router; 