const express = require('express');
const { register, login, verifyEmail } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/verify/:token', verifyEmail);

module.exports = router;
