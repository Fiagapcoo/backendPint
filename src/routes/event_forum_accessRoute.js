const express = require('express');
const router = express.Router();

const EventForumAccessController = require('../controllers/event_forum_accessController');

router.post('/create', EventForumAccessController.createAccess);
router.get('/list', EventForumAccessController.getAllAccesses);
router.get('/get/:userId/:forumId', EventForumAccessController.getAccessById);
router.delete('/delete/:userId/:forumId', EventForumAccessController.deleteAccess);

module.exports = router;
