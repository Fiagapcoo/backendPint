const express = require('express');
const router = express.Router();

const FieldsController = require('../controllers/fieldsController');

router.post('/create', FieldsController.createField);
router.get('/list', FieldsController.getAllFields);
router.get('/get/:eventId/:fieldId', FieldsController.getFieldById);
router.put('/update/:eventId/:fieldId', FieldsController.updateField);
router.delete('/delete/:eventId/:fieldId', FieldsController.deleteField);

module.exports = router;
