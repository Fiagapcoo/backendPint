const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificationController');


router.post('/trigger-notifications', controller.triggerNotifications);
router.post('/notify-event-changes', controller.notifyEventChanges);
router.post('/notify-event-comments', controller.notifyEventComments);
router.post('/notify-event-creator', controller.notifyEventCreator);
router.post('/notify-event-interactions', controller.notifyEventInteractions);

module.exports = router;
