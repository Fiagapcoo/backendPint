const express = require('express');
const router = express.Router();
const { sendEmail } = require('../controllers/emailController');
const {validation} = require('../controllers/jwt_middlewareController');

// Route to send an email
router.post('/send-email', validation, sendEmail);

module.exports = router;
