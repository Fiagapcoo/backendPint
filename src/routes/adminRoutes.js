const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController.js');

router.patch('/validate-content/:contentType/:contentID/:adminID', controller.validate_content);
router.patch('/reject-content/:contentType/:contentID/:adminID', controller.reject_content);

router.get('/user-engagement-metrics', controller.getUserEngagementMetrics);
router.get('/content-validation-status/admin/:adminID', controller.getContentValidationStatusByadmin);
router.get('/content-validation-status', controller.getContentValidationStatus);
router.get('/active-discussions', controller.getActiveDiscussions);
router.get('/active-warnings', controller.getActiveWarnings);
router.get('/content-center-to-be-validated/:center_id', controller.getContentCenterToBeValidated);
router.post('/create-center', controller.createCenter);
router.delete('/delete-center/:center_id', controller.deleteCenter);
router.get('/get-all-centers', controller.getCenters);

module.exports = router;