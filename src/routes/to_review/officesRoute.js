const express = require('express');
const router = express.Router();

const officesController = require('../controllers/officesController');

router.get('/list', officesController.list);
router.get('/get/:id', officesController.get);
router.post('/update/:id', officesController.update);
router.post('/create', officesController.create);
router.delete('/delete/:id', officesController.delete);

module.exports = router;