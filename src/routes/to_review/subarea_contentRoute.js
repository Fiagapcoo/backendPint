const express = require('express');
const router = express.Router();
const subarea_contentController = require('../controllers/subarea_contentController');

router.get('/list', subarea_contentController.getAll);
router.get('/get/:id', subarea_contentController.getById);
router.post('/create', subarea_contentController.create);
router.put('/update/:id', subarea_contentController.update);
router.delete('/delete/:id', subarea_contentController.delete);

module.exports = router;
