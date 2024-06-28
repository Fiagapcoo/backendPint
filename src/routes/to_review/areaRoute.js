const express = require('express');
const router = express.Router();

const areaController = require('../controllers/areaController');

router.get('/list', areaController.list);
router.get('/get/:id', areaController.get);
router.post('/create', areaController.create);
router.put('/update/:id', areaController.update);
router.delete('/delete/:id', areaController.delete);



module.exports = router;