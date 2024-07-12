const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersController.js');
const {validation} = require('../controllers/jwt_middlewareController.js');

router.post('/add-bookmark/:userID/:contentType/:contentID', validation, controller.add_bookmark);
router.get('/get-bookmarks/:userID', validation, controller.get_user_bookmarks);
router.delete('/remove-bookmark/:userID/:contentType/:contentID', validation, controller.remove_bookmark);
router.patch('/update-user-preferences/:userID', validation, controller.update_user_preferences);
router.post('/create-user-preferences/:userID', validation, controller.createUserPreferences);
router.get('/get-user-preferences/:userID', validation, controller.get_user_preferences);
router.get('/get-user-role/:userID', validation, controller.get_user_role);
router.get('/get-user-by-role/:role', validation, controller.get_user_by_role);
router.patch('/update-acess-on-login/:userID', validation, controller.update_access_on_login); 
router.put('/update-acc-status', validation, controller.update_acc_status);



module.exports = router;








