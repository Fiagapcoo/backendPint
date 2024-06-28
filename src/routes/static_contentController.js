const express = require('express');
const router = express.Router();
const static_contentController = require('../controllers/Static_contentController.js');

router.post('/create-category', static_contentController.create_category);
router.post('/create-sub-category', static_contentController.create_sub_category);
router.get('/get-areas',static_contentController.get_all_areas);
router.get('/get-sub-areas',static_contentController.get_all_sub_areas);


module.exports = router;
