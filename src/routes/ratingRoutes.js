const express = require('express');
const router = express.Router();
const controller = require('../controllers/ratingController.js');
const {validation} = require('../controllers/middlewareController');

router.post('/eval/:contentType/:contentId', validation, controller.add_evaluation);

module.exports = router;
