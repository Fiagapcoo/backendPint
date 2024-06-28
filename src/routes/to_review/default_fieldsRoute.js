const express = require('express');
const router = express.Router();

const DefaultFieldController = require('../controllers/default_fieldsController');

router.post('/create', DefaultFieldController.createField);
router.get('/list', DefaultFieldController.getAllFields);
router.get('/get/:id', DefaultFieldController.getFieldById);
router.put('/update/:id', DefaultFieldController.updateField);
router.delete('/delete/:id', DefaultFieldController.deleteField);

module.exports = router;
