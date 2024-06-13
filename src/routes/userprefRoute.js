const express = require('express');
const router = express.Router();

const userprefController = require('../controllers/userprefController');

router.get('/list', userprefController.getAll);
router.get('/get/:id', userprefController.getById);
router.post('/create', userprefController.create);
router.put('/update/:id', userprefController.update);
router.delete('/delete/:id', userprefController.delete);

module.exports = router;