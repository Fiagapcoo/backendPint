const express = require('express');
const router = express.Router();

const ForumController = require('../controllers/forumsController');

router.post('/create', ForumController.createForum);
router.get('/list', ForumController.getAllForums);
router.get('/get/:id', ForumController.getForumById);
router.put('/update/:id', ForumController.updateForum);
router.delete('/delete/:id', ForumController.deleteForum);

module.exports = router;
