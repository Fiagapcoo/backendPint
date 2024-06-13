const express = require('express');
const router = express.Router();

const CommentsController = require('../controllers/commentController');

router.post('/create', CommentsController.createComment);
router.get('/list', CommentsController.getAllComments);
router.get('/get/:id', CommentsController.getCommentById);
router.put('/update/:id', CommentsController.updateComment);
router.delete('/delete/:id', CommentsController.deleteComment);

module.exports = router;
