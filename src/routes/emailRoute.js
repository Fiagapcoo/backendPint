const express = require('express');
const router = express.Router();
const { sendEmail } = require('../controllers/emailController');

// Route to send an email
router.post('/send-email', sendEmail);

module.exports = router;
