const express = require('express');
const router = express.Router();
const dynamicController = require('../controllers/dynamic_contentController');

router.get('/posts-by-city/:city', dynamicController.getPostsByCity);
router.get('/forums-by-city/:city', dynamicController.getForumsByCity);
router.get('/events-by-city/:city', dynamicController.getEventsByCity);
router.get('/all-content', dynamicController.getAllContent);
router.get('/get-post/:post_id', dynamicController.getPostById);
router.get('/get-event/:event_id', dynamicController.getEventById);
router.get('/get-forum/:forum_id', dynamicController.getForumById);
router.get('/user-info/:user_id', dynamicController.getUserInfo);
//router.get('/user-preferences', dynamicController.getUserPreferences);

module.exports = router;