const express = require('express');
const router = express.Router();
const controller = require('../controllers/formsController.js');

router.post('/create-form', controller.create_event_form);
router.post('/add-fields-to-form/event/:eventID/fields/:customFieldsJson', controller.add_fields_event_form);
router.patch('/edit-form-fields/event/:eventID/field/:fieldID', controller.edit_fields_event_form); 
router.get('/event-form/:eventID', controller.get_event_form);
router.get('/event-json-form/:eventID', controller.get_event_json_form);
router.post('/add-answer/:eventID/:userID', controller.add_answer);
router.post('/add-answers/:eventID/:userID', controller.add_answers);
router.delete('/delete-field/:eventID/:fieldID', controller.delete_field_from_form);

module.exports = router;









