const express = require('express');
const router = express.Router();

const BookmarkController = require('../controllers/bookmarkController');

router.post('/create', BookmarkController.createBookmark);
router.get('/list', BookmarkController.getAllBookmarks);
router.get('/get/:id', BookmarkController.getBookmarkById);
router.put('/update/:id', BookmarkController.updateBookmark);
router.delete('/delete/:id', BookmarkController.deleteBookmark);

module.exports = router;
