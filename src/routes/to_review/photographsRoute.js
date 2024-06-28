const express = require('express');
const router = express.Router();

const PhotographsController = require('../controllers/photographsController');

router.post('/create', PhotographsController.createPhotograph);
router.get('/list', PhotographsController.getAllPhotographs);
router.get('/get/:id', PhotographsController.getPhotographById);
router.put('/update/:id', PhotographsController.updatePhotograph);
router.delete('/delete/:id', PhotographsController.deletePhotograph);

module.exports = router;
