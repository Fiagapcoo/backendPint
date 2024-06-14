const passwd_expiring_notificationsModel = require('../models/passwd_expiring_notifications');
const userController = require('../models/users');

const passwd_expiring_notificationsController = {};

/**
 * @description Retrieves all password expiring notifications from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all password expiring notifications 
 * from the 'passwd_expiring_notifications' table, including associated user information. 
 * The result is returned as a JSON response. In case of an error, an error message 
 * is returned with HTTP status 400.
 * 
 * @async
 * @function list
 * @route {GET} /passwd_expiring_notifications
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
passwd_expiring_notificationsController.list = async (req, res) => {
    try {
        const passwd_expiring_notifications = await passwd_expiring_notificationsModel.findAll(
            {
                include: {
                    model: userController,
                    required: true
                }
            }
        );
        res.json(passwd_expiring_notifications);
    } catch (error) {
        res.status(400).send('Error retrieving passwd_expiring_notifications');
    }
}

/**
 * @description Retrieves a specific password expiring notification by its ID from the database.
 * 
 * This function uses Sequelize's `findByPk` method to fetch a specific password expiring notification 
 * from the 'passwd_expiring_notifications' table by its ID, including associated user information. 
 * The result is returned as a JSON response. In case of an error, an error message 
 * is returned with HTTP status 400.
 * 
 * @async
 * @function get
 * @route {GET} /passwd_expiring_notifications/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the password expiring notification.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
passwd_expiring_notificationsController.get = async (req, res) => {
    try {
        const { id } = req.params;
        const passwd_expiring_notifications = await passwd_expiring_notificationsModel.findByPk(id, {
            include: {
                model: userController,
                required: true
            }
        });
        if (passwd_expiring_notifications) {
            res.json(passwd_expiring_notifications);
        } else {
            res.status(404).send('passwd_expiring_notifications not found');
        }
    } catch (error) {
        res.status(400).send('Error retrieving passwd_expiring_notifications');
    }
}

/**
 * @description Updates an existing password expiring notification record in the database.
 * 
 * This function uses Sequelize's `update` method to modify an existing password expiring notification 
 * in the 'passwd_expiring_notifications' table. It takes the notification data from the request body 
 * and the ID of the notification from the URL parameters. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 400.
 * 
 * @async
 * @function update
 * @route {PUT} /passwd_expiring_notifications/update/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the password expiring notification.
 * @param {Object} req.body - The body of the request containing notification data.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
passwd_expiring_notificationsController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await passwd_expiring_notificationsModel.update(req.body, {
            where: { id: id }
        });
        if (updated) {
            const updatedpasswd_expiring_notifications = await passwd_expiring_notificationsModel.findByPk(id);
            res.json(updatedpasswd_expiring_notifications);
        } else {
            res.status(404).send('passwd_expiring_notifications not found');
        }
    } catch (error) {
        res.status(400).send('Error updating passwd_expiring_notifications');
    }
}

/**
 * @description Creates a new password expiring notification record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new password expiring notification 
 * to the 'passwd_expiring_notifications' table. It takes the notification data from the request body. 
 * If the operation is successful, a success message and the newly created notification data 
 * are returned as a JSON response. In case of an error, an error message is returned 
 * with HTTP status 400.
 * 
 * @async
 * @function create
 * @route {POST} /passwd_expiring_notifications/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing notification data.
 * @param {number} req.body.USER_ID - The ID of the user.
 * @param {Date} req.body.NOTIF_DATE - The date of the notification.
 * @param {boolean} req.body.IS_NOTIFIED - The notification status.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
passwd_expiring_notificationsController.create = async (req, res) => {
    try {
        const { USER_ID, NOTIF_DATE, IS_NOTIFIED } = req.body;

        const passwd_expiring_notifications = await passwd_expiring_notificationsModel.create({
            USER_ID,
            NOTIF_DATE,
            IS_NOTIFIED
        });

        res.status(201).json({ message: 'New passwd_expiring_notifications created', passwd_expiring_notifications });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}

module.exports = passwd_expiring_notificationsController;
