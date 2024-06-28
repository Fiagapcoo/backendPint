const express = require('express');
const router = express.Router();

const NotificationController = require('../controllers/notificationsController');

router.post('/create', NotificationController.createNotification);
router.get('/list', NotificationController.getAllNotifications);
router.get('/get/:id', NotificationController.getNotificationById);
router.put('/update/:id', NotificationController.updateNotification);
router.delete('/delete/:id', NotificationController.deleteNotification);

module.exports = router;
