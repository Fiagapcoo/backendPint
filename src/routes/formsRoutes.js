const express = require('express');
const router = express.Router();
const controller = require('../controllers/formsController.js');
const {validation} = require('../controllers/middlewareController');

router.post('/create-form', controller.create_event_form);
router.post('/add-fields-to-form/event/:eventID/fields/:customFieldsJson', validation, controller.add_fields_event_form);
router.patch('/edit-form-fields/event/:eventID/field/:fieldID', validation, controller.edit_fields_event_form); 
router.get('/event-form/:eventID', validation, controller.get_event_form);
router.get('/event-json-form/:eventID', validation, controller.get_event_json_form);
router.post('/add-answer/:eventID/:userID', validation, controller.add_answer);
router.post('/add-answers/:eventID/:userID', validation, controller.add_answers);
router.delete('/delete-field/:eventID/:fieldID', validation, controller.delete_field_from_form);

module.exports = router;









