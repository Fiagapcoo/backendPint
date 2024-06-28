const express = require('express');
const router = express.Router();
const controller = require('../controllers/ratingController.js');

router.post('/eval/:contentType/:contentId', controller.add_evaluation);

module.exports = router;
