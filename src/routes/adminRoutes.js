const express = require('express');
const router = express.Router();
const {validation} = require('../controllers/jwt_middlewareController.js');
const controller = require('../controllers/adminController.js');

router.patch('/validate-content/:contentType/:contentID/:adminID', validation ,controller.validate_content);
router.patch('/reject-content/:contentType/:contentID/:adminID', validation ,controller.reject_content);

router.get('/user-engagement-metrics', validation, controller.getUserEngagementMetrics);
router.get('/content-validation-status/admin/:adminID', validation, controller.getContentValidationStatusByadmin);
router.get('/content-validation-status', validation,  controller.getContentValidationStatus);
router.get('/active-discussions', validation, controller.getActiveDiscussions);
router.get('/active-warnings', validation, controller.getActiveWarnings);
router.get('/content-center-to-be-validated/:center_id', validation, controller.getContentCenterToBeValidated);
router.post('/create-center', validation, controller.createCenter);
router.delete('/delete-center/:center_id', validation, controller.deleteCenter);
router.get('/get-all-centers', controller.getCenters);
router.patch('/update-center/:center_id', validation, controller.updateCenter);

module.exports = router;