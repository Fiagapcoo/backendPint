const express = require('express');
const router = express.Router();

const ActiveDiscussionsController = require('../controllers/active_discussionsController');

router.post('/create', ActiveDiscussionsController.createActiveDiscussion);
router.get('/list', ActiveDiscussionsController.getAllActiveDiscussions);
router.get('/get/:id', ActiveDiscussionsController.getActiveDiscussionById);
router.put('/update/:id', ActiveDiscussionsController.updateActiveDiscussion);
router.delete('/delete/:id', ActiveDiscussionsController.deleteActiveDiscussion);

module.exports = router;
