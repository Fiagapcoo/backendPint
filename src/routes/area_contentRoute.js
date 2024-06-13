const express = require('express');
const router = express.Router();

const area_contentController = require('../controllers/area_contentController');

router.get('/list', area_contentController.getAll);
router.get('/get/:id', area_contentController.getOne);
router.post('/create', area_contentController.create);
router.put('/update/:id', area_contentController.update);
router.delete('/delete/:id', area_contentController.delete);

module.exports = router;