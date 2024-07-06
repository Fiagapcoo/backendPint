const express = require('express');
const router = express.Router();

const midlewareController = require('../controllers/middlewareController');

router.post('/validate-token', midlewareController.validation);

module.exports = router;