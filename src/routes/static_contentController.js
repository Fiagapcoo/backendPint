const express = require('express');
const router = express.Router();
const static_contentController = require('../controllers/Static_contentController.js');
const {validation} = require('../controllers/jwt_middlewareController.js');

router.post('/create-category', validation, static_contentController.create_category);
router.post('/create-sub-category', validation, static_contentController.create_sub_category);
router.get('/get-areas', validation, static_contentController.get_all_areas);
router.get('/get-sub-areas', validation, static_contentController.get_all_sub_areas);

module.exports = router;
