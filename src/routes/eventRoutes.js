const express = require('express');
const router = express.Router();
const controller = require('../controllers/EventController.js');

router.post('/create', controller.create_event);
// router.post('/event_participation_cleanup', controller.event_participation_cleanup);
router.post('/register-user/:userId/event/:eventId', controller.register_user_for_event);
router.delete('/unregister-user/:userId/event/:eventId', controller.unregister_user_from_event); //in doubt cause makes 2 deletes 1 update
router.get('/state/:eventId', controller.get_event_state);
router.patch('/edit/:eventId', controller.edit_event); 
router.get('/get/:eventId', controller.get_event);
module.exports = router;
