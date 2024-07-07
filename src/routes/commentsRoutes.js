const express = require('express');
const router = express.Router();
const {validation} = require('../controllers/middlewareController');
const controller = require('../controllers/commentsController.js');

router.post('/add-comment', validation, controller.add_comment);
router.get('/get-comment-tree/content/:contentType/id/:contentID', validation, controller.get_comments_tree);

module.exports = router;
