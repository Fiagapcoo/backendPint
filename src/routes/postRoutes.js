const express = require('express');
const router = express.Router();
const controller = require('../controllers/postController.js');

router.post('/create', controller.create_post);
router.get('/state/:postId', controller.get_post_state);
router.patch('/edit/:postId', controller.edit_post); 
module.exports = router;
