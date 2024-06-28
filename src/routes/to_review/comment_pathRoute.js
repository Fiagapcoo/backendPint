const express = require('express');
const router = express.Router();

const CommentPathController = require('../controllers/comment_pathController');

router.post('/create', CommentPathController.createCommentPath);
router.get('/list', CommentPathController.getAllCommentPaths);
router.get('/get/:ancestorId/:descendantId', CommentPathController.getCommentPathById);
router.delete('/delete/:ancestorId/:descendantId', CommentPathController.deleteCommentPath);

module.exports = router;
