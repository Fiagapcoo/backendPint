const UserActionsLog = require('../models/user_actions_log');
const UserActionsLogController = {};
/**
 * @description Creates a new user action log record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new user action log 
 * to the 'USER_ACTIONS_LOG' table. It takes the log data from the request body. 
 * If the operation is successful, a success message and the newly created 
 * log data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 400.
 * 
 * @async
 * @function create
 * @route {POST} /user_actions_log/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing log data.
 * @param {number} req.body.USER_ID - The ID of the user.
 * @param {string} req.body.ACTION_TYPE - The type of action performed.
 * @param {string} req.body.ACTION_DESCRIPTION - The description of the action performed.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
UserActionsLogController.create = async (req, res) => {
    try {
        const { USER_ID, ACTION_TYPE, ACTION_DESCRIPTION } = req.body;
        const newLog = await UserActionsLog.create({
            USER_ID,
            ACTION_TYPE,
            ACTION_DESCRIPTION,
            ACTION_DATE: new Date()
        });
        res.json({ message: 'Log created successfully!', log: newLog });
    } catch (error) {
        console.log(error);
        res.status(400).send('Error creating the log');
    }
};

/**
 * @description Retrieves all user action log records from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all logs 
 * stored in the 'USER_ACTIONS_LOG' table. If the operation is successful, 
 * the log records are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 400.
 * 
 * @async
 * @function findAll
 * @route {GET} /user_actions_log/list
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
UserActionsLogController.findAll = async (req, res) => {
    try {
        const logs = await UserActionsLog.findAll();
        res.json(logs);
    } catch (error) {
        res.status(400).send('Error retrieving logs');
    }
};

/**
 * @description Retrieves a specific user action log record from the database by its primary key (ID).
 * 
 * This function uses Sequelize's `findByPk` method to fetch a log 
 * by its primary key. If the log is found, the log data is returned 
 * as a JSON response. If the log is not found, a 404 error message is returned.
 * In case of an error, an error message is returned with HTTP status 400.
 * 
 * @async
 * @function findOne
 * @route {GET} /user_actions_log/get/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters of the request.
 * @param {string} req.params.id - The ID of the log to retrieve.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
UserActionsLogController.findOne = async (req, res) => {
    try {
        const { id } = req.params;
        const log = await UserActionsLog.findByPk(id);
        if (log) {
            res.json(log);
        } else {
            res.status(404).send('Log not found');
        }
    } catch (error) {
        res.status(400).send('Error retrieving the log');
    }
};

/**
 * @description Updates a specific user action log record in the database.
 * 
 * This function uses Sequelize's `update` method to update a log 
 * by its primary key. If the log is found and updated successfully,
 * the updated log data is returned as a JSON response along with a 
 * success message. If the log is not found, a 404 error message is returned.
 * In case of an error, an error message is returned with HTTP status 400.
 * 
 * @async
 * @function update
 * @route {PUT} /user_actions_log/update/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters of the request.
 * @param {string} req.params.id - The ID of the log to update.
 * @param {Object} req.body - The body of the request containing log data to update.
 * @param {string} req.body.ACTION_TYPE - The type of action performed.
 * @param {string} req.body.ACTION_DESCRIPTION - The description of the action performed.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
UserActionsLogController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { ACTION_TYPE, ACTION_DESCRIPTION } = req.body;
        const [updated] = await UserActionsLog.update({
            ACTION_TYPE,
            ACTION_DESCRIPTION,
            ACTION_DATE: new Date()
        }, {
            where: { LOG_ID: id }
        });
        if (updated) {
            const updatedLog = await UserActionsLog.findByPk(id);
            res.json({ message: 'Log updated successfully!', log: updatedLog });
        } else {
            res.status(404).send('Log not found');
        }
    } catch (error) {
        res.status(400).send('Error updating the log');
    }
};



module.exports = UserActionsLogController;