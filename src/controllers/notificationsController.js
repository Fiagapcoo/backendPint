const NotificationModel = require('../models/notifications');
const UserModel = require('../models/users');
const EventModel = require('../models/events');
const PostModel = require('../models/posts');

const NotificationController = {};

NotificationController.createNotification = async (req, res) => {
    const { USER_ID, EVENT_ID, POST_ID, NOTIFICATION_TEXT } = req.body;
    try {
        const newNotification = await NotificationModel.create({
            USER_ID,
            EVENT_ID,
            POST_ID,
            NOTIFICATION_TEXT
        });
        res.status(201).json(newNotification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

NotificationController.getAllNotifications = async (req, res) => {
    try {
        const notifications = await NotificationModel.findAll({
            include: [
                {
                    model: UserModel,
                    attributes: ['USER_ID']
                },
                {
                    model: EventModel,
                    attributes: ['EVENT_ID'],
                    required: false
                },
                {
                    model: PostModel,
                    attributes: ['POST_ID'],
                    required: false
                }
            ]
        });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

NotificationController.getNotificationById = async (req, res) => {
    const { id } = req.params;
    try {
        const notification = await NotificationModel.findOne({
            where: {
                NOTIFICATION_ID: id
            },
            include: [
                {
                    model: UserModel,
                    attributes: ['USER_ID']
                },
                {
                    model: EventModel,
                    attributes: ['EVENT_ID'],
                    required: false
                },
                {
                    model: PostModel,
                    attributes: ['POST_ID'],
                    required: false
                }
            ]
        });
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

NotificationController.updateNotification = async (req, res) => {
    const { id } = req.params;
    const { USER_ID, EVENT_ID, POST_ID, NOTIFICATION_TEXT, IS_READ } = req.body;
    try {
        await NotificationModel.update({
            USER_ID,
            EVENT_ID,
            POST_ID,
            NOTIFICATION_TEXT,
            IS_READ
        }, {
            where: {
                NOTIFICATION_ID: id
            }
        });
        res.status(200).json({ message: 'Notification updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

NotificationController.deleteNotification = async (req, res) => {
    const { id } = req.params;
    try {
        await NotificationModel.destroy({
            where: {
                NOTIFICATION_ID: id
            }
        });
        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = NotificationController;
