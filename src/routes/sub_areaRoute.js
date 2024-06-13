const express = require('express');
const router = express.Router();

const SubArea = require('../controllers/sub_areaController');

router.get('/list', SubArea.getAllSubAreas);
router.get('/get/:id', SubArea.getSubArea);
router.post('/create', SubArea.createSubArea);
router.put('/update/:id', SubArea.updateSubArea);
router.delete('/delete/:id', SubArea.deleteSubArea);

module.exports = router;