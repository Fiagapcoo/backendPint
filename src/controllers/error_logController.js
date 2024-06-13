const ErrorLog = require('../models/error_log');

const error_logController = {};

/**
 * @description Creates a new error log record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new error log 
 * to the 'ErrorLog' table. It takes the error log data from the request body. 
 * If the operation is successful, a success message and the newly created 
 * error log data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 400.
 * 
 * @async
 * @function create
 * @route {POST} /error_log/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing error log data.
 * @param {string} req.body.ErrorMessage - The error message.
 * @param {string} req.body.ErrorSeverity - The severity level of the error.
 * @param {string} req.body.ErrorState - The state of the error.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */

error_logController.create = async (req, res) => {
    try {
        const { ErrorMessage, ErrorSeverity, ErrorState } = req.body;
        const newError = await ErrorLog.create({
            ErrorMessage,
            ErrorSeverity,
            ErrorState
        });
        console.log(newError)
        res.json({ message: 'Error registered successfully!', error: newError });
    } catch (error) {
        res.status(400).send('Error registering the error');
    }
};



/**
 * @description Retrieves all error log records from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all error logs 
 * stored in the 'ErrorLog' table. If the operation is successful, 
 * the error log records are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 400.
 * 
 * @async
 * @function findAll
 * @route {GET} /error_log/list
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
error_logController.findAll = async (req, res) => {
    try {
        const errors = await ErrorLog.findAll();
        res.json(errors);
    } catch (error) {
        res.status(400).send('Error retrieving errors');
    }
};



/**
 * @description Retrieves a specific error log record from the database by its primary key (ID).
 * 
 * This function uses Sequelize's `findByPk` method to fetch an error log 
 * by its primary key. If the error log is found, the error log data is returned 
 * as a JSON response. If the error log is not found, a 404 error message is returned.
 * In case of an error, an error message is returned with HTTP status 400.
 * 
 * @async
 * @function findOne
 * @route {GET} /error_log/get/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters of the request.
 * @param {string} req.params.id - The ID of the error log to retrieve.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
error_logController.findOne = async (req, res) => {
    try {
        const { id } = req.params;
        const error = await ErrorLog.findByPk(id);
        if (error) {
            res.json(error);
        } else {
            res.status(404).send('Error not found');
        }
    } catch (error) {
        res.status(400).send('Error retrieving the error');
    }
};


/**
 * @description Updates a specific error log record in the database.
 * 
 * This function uses Sequelize's `update` method to update an error log 
 * by its primary key. If the error log is found and updated successfully,
 * the updated error log data is returned as a JSON response along with a 
 * success message. If the error log is not found, a 404 error message is returned.
 * In case of an error, an error message is returned with HTTP status 400.
 * 
 * @async
 * @function update
 * @route {PUT} /error_log/update/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters of the request.
 * @param {string} req.params.id - The ID of the error log to update.
 * @param {Object} req.body - The body of the request containing error log data to update.
 * @param {string} req.body.ErrorMessage - The error message.
 * @param {string} req.body.ErrorSeverity - The severity level of the error.
 * @param {string} req.body.ErrorState - The state of the error.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
error_logController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { ErrorMessage, ErrorSeverity, ErrorState } = req.body;
        const [updated] = await ErrorLog.update({
            ErrorMessage,
            ErrorSeverity,
            ErrorState
        }, {
            where: { ErrorLogID: id }
        });
        if (updated) {
            const updatedError = await ErrorLog.findByPk(id);
            res.json({ message: 'Error updated successfully!', error: updatedError });
        } else {
            res.status(404).send('Error not found');
        }
    } catch (error) {
        res.status(400).send('Error updating the error');
    }
};



module.exports = error_logController;
