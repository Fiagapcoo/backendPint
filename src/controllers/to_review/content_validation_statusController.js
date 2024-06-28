const ContentValidationStatusModel = require('../models/content_validation_status');
const UserModel = require('../models/users');

const ContentValidationStatusController = {};

/**
 * @description Creates a new content validation status record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new content validation status 
 * to the 'ContentValidationStatus' table. It takes the content validation status data 
 * from the request body. If the operation is successful, a success message and the newly created 
 * content validation status data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function createContentValidationStatus
 * @route {POST} /content_validation_status/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing content validation status data.
 * @param {string} req.body.CONTENT_TYPE - The type of the content (e.g., 'Post', 'Event', 'Comment').
 * @param {string} req.body.CONTENT_STATUS - The validation status of the content (e.g., 'Pending', 'Approved', 'Rejected').
 * @param {number} req.body.CONTENT_REAL_ID - The real ID of the content.
 * @param {number} req.body.VALIDATOR_ID - The ID of the user validating the content.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ContentValidationStatusController.createContentValidationStatus = async (req, res) => {
    const { CONTENT_TYPE, CONTENT_STATUS, CONTENT_REAL_ID, VALIDATOR_ID } = req.body;
    try {
        const newContentValidationStatus = await ContentValidationStatusModel.create({
            CONTENT_TYPE,
            CONTENT_STATUS,
            CONTENT_REAL_ID,
            VALIDATOR_ID
        });
        res.status(201).json(newContentValidationStatus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves all content validation statuses from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all content validation statuses 
 * from the 'ContentValidationStatus' table. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getAllContentValidationStatuses
 * @route {GET} /content_validation_status/list
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ContentValidationStatusController.getAllContentValidationStatuses = async (req, res) => {
    try {
        const contentValidationStatuses = await ContentValidationStatusModel.findAll({
            include: [
                {
                    model: UserModel,
                    attributes: ['USER_ID']
                }
            ]
        });
        res.status(200).json(contentValidationStatuses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves a specific content validation status by its ID from the database.
 * 
 * This function uses Sequelize's `findOne` method to fetch a specific content validation status 
 * from the 'ContentValidationStatus' table by its ID. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getContentValidationStatusById
 * @route {GET} /content_validation_status/get/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the content validation status.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ContentValidationStatusController.getContentValidationStatusById = async (req, res) => {
    const { id } = req.params;
    try {
        const contentValidationStatus = await ContentValidationStatusModel.findOne({
            where: {
                CONTENT_ID: id
            },
            include: [
                {
                    model: UserModel,
                    attributes: ['USER_ID']
                }
            ]
        });
        res.status(200).json(contentValidationStatus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Updates an existing content validation status record in the database.
 * 
 * This function uses Sequelize's `update` method to modify an existing content validation status 
 * in the 'ContentValidationStatus' table. It takes the content validation status data from the request body 
 * and the ID of the content validation status from the URL parameters. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function updateContentValidationStatus
 * @route {PUT} /content_validation_status/update/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the content validation status.
 * @param {Object} req.body - The body of the request containing content validation status data.
 * @param {string} req.body.CONTENT_TYPE - The type of the content (e.g., 'Post', 'Event', 'Comment').
 * @param {string} req.body.CONTENT_STATUS - The validation status of the content (e.g., 'Pending', 'Approved', 'Rejected').
 * @param {number} req.body.CONTENT_REAL_ID - The real ID of the content.
 * @param {number} req.body.VALIDATOR_ID - The ID of the user validating the content.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ContentValidationStatusController.updateContentValidationStatus = async (req, res) => {
    const { id } = req.params;
    const { CONTENT_TYPE, CONTENT_STATUS, CONTENT_REAL_ID, VALIDATOR_ID } = req.body;
    try {
        await ContentValidationStatusModel.update({
            CONTENT_TYPE,
            CONTENT_STATUS,
            CONTENT_REAL_ID,
            VALIDATOR_ID
        }, {
            where: {
                CONTENT_ID: id
            }
        });
        res.status(200).json({ message: 'Content Validation Status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Deletes a content validation status record from the database by its ID.
 * 
 * This function uses Sequelize's `destroy` method to remove a content validation status 
 * from the 'ContentValidationStatus' table by its ID. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function deleteContentValidationStatus
 * @route {DELETE} /content_validation_status/delete/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the content validation status.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ContentValidationStatusController.deleteContentValidationStatus = async (req, res) => {
    const { id } = req.params;
    try {
        await ContentValidationStatusModel.destroy({
            where: {
                CONTENT_ID: id
            }
        });
        res.status(200).json({ message: 'Content Validation Status deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = ContentValidationStatusController;
