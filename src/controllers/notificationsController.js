const NotificationModel = require('../models/notifications');
const UserModel = require('../models/users');
const EventModel = require('../models/events');
const PostModel = require('../models/posts');

const NotificationController = {};

/**
 * @description Creates a new notification record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new notification 
 * to the 'Notifications' table. It takes the notification data from the request body. 
 * If the operation is successful, a success message and the newly created 
 * notification data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function createNotification
 * @route {POST} /notifications/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing notification data.
 * @param {number} req.body.USER_ID - The ID of the user.
 * @param {number} [req.body.EVENT_ID] - The ID of the event.
 * @param {number} [req.body.POST_ID] - The ID of the post.
 * @param {string} req.body.NOTIFICATION_TEXT - The text of the notification.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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

/**
 * @description Retrieves all notifications from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all notifications 
 * from the 'Notifications' table. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getAllNotifications
 * @route {GET} /notifications/list
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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

/**
 * @description Retrieves a specific notification by its ID from the database.
 * 
 * This function uses Sequelize's `findOne` method to fetch a specific notification 
 * from the 'Notifications' table by its ID. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getNotificationById
 * @route {GET} /notifications/get/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the notification.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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

/**
 * @description Updates an existing notification record in the database.
 * 
 * This function uses Sequelize's `update` method to modify an existing notification 
 * in the 'Notifications' table. It takes the notification data from the request body 
 * and the ID of the notification from the URL parameters. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function updateNotification
 * @route {PUT} /notifications/update/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the notification.
 * @param {Object} req.body - The body of the request containing notification data.
 * @param {number} req.body.USER_ID - The ID of the user.
 * @param {number} [req.body.EVENT_ID] - The ID of the event.
 * @param {number} [req.body.POST_ID] - The ID of the post.
 * @param {string} req.body.NOTIFICATION_TEXT - The text of the notification.
 * @param {boolean} req.body.IS_READ - Indicates if the notification has been read.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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

/**
 * @description Deletes a notification record from the database by its ID.
 * 
 * This function uses Sequelize's `destroy` method to remove a notification 
 * from the 'Notifications' table by its ID. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function deleteNotification
 * @route {DELETE} /notifications/delete/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the notification.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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
