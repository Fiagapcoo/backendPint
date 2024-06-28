const express = require('express');
const router = express.Router();

const error_log = require('../controllers/error_logController');

router.post('/create', error_log.create);
router.get('/list', error_log.findAll);
router.get('/get/:id', error_log.findOne);
router.put('/update/:id', error_log.update);

module.exports = router;