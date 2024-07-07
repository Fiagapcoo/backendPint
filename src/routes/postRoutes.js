const express = require('express');
const router = express.Router();
const controller = require('../controllers/postController.js');
const {validation} = require('../controllers/middlewareController');

router.post('/create', validation, controller.create_post);
router.get('/state/:postId', validation, controller.get_post_state);
router.patch('/edit/:postId', validation, controller.edit_post); 
module.exports = router;
