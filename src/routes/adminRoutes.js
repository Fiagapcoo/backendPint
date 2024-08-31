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
router.post('/create-warnings', validation, controller.createWarnings);
router.get('/active-warnings', validation, controller.getActiveWarnings);
router.get('/get-all-warnings', validation, controller.getAllWarnings);
router.patch('/update-warning/:warning_id', validation, controller.updateWarning);
router.get('/content-center-to-be-validated/:center_id', validation, controller.getContentCenterToBeValidated);
router.post('/create-center', validation, controller.createCenter);
router.delete('/delete-center/:center_id', validation, controller.deleteCenter);
router.get('/get-all-centers', controller.getCenters);
router.patch('/update-center/:center_id', validation, controller.updateCenter);


//validate operations for users
router.patch('/validate-user', validation, controller.validate_user);
router.patch('/deactivate-user', validation, controller.deactivate_user);

//reports
router.get('/get-reports', validation, controller.getReports);
router.delete('/delete-report/:reportID', validation, controller.deleteReport);

module.exports = router;