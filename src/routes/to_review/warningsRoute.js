const express = require('express');
const router = express.Router();

const WarningsController = require('../controllers/warningsController');

router.post('/create', WarningsController.createWarning);
router.get('/list', WarningsController.getAllWarnings);
router.get('/get/:id', WarningsController.getWarningById);
router.put('/update/:id', WarningsController.updateWarning);
router.delete('/delete/:id', WarningsController.deleteWarning);

module.exports = router;
