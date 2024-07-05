const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/setup-password', authController.setupPassword);
router.post('/login', authController.login);
router.post('/login_mobile', authController.login_mobile);
router.post('/validate-token', authController.validateToken);

module.exports = router;
