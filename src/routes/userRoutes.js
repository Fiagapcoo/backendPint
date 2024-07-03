const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersController.js');

router.post('/add-bookmark/:userID/:contentType/:contentID', controller.add_bookmark);
router.get('/get-bookmarks/:userID', controller.get_user_bookmarks);
router.delete('/remove-bookmark/:userID/:contentType/:contentID', controller.remove_bookmark);
router.patch('/update-user-preferences/:userID', controller.update_user_preferences);
router.get('/get-user-preferences/:userID', controller.get_user_preferences);
router.get('/get-user-role/:userID', controller.get_user_role);
router.get('/get-user-by-role/:role', controller.get_user_by_role);
router.patch('/update-acess-on-login/:userID', controller.update_access_on_login); 



module.exports = router;








