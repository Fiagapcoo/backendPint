const express = require('express');
const router = express.Router();

const ReportsController = require('../controllers/reportsController');

router.post('/create', ReportsController.createReport);
router.get('/list', ReportsController.getAllReports);
router.get('/get/:id', ReportsController.getReportById);
router.put('/update/:id', ReportsController.updateReport);
router.delete('/delete/:id', ReportsController.deleteReport);

module.exports = router;
