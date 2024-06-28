const express = require('express');
const router = express.Router();

const ContentValidationStatusController = require('../controllers/content_validation_statusController');

router.post('/create', ContentValidationStatusController.createContentValidationStatus);
router.get('/list', ContentValidationStatusController.getAllContentValidationStatuses);
router.get('/get/:id', ContentValidationStatusController.getContentValidationStatusById);
router.put('/update/:id', ContentValidationStatusController.updateContentValidationStatus);
router.delete('/delete/:id', ContentValidationStatusController.deleteContentValidationStatus);

module.exports = router;
