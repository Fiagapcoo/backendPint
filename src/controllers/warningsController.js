const WarningModel = require('../models/warnings');
const UserModel = require('../models/users');
const OfficeAdminModel = require('../models/office_admins');

const WarningsController = {};

/**
 * @description Creates a new warning record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new warning 
 * to the 'WarningModel' table. It takes the warning data from the request body. 
 * If the operation is successful, the newly created warning data is returned 
 * as a JSON response. In case of an error, an error message is returned with 
 * HTTP status 500.
 * 
 * @async
 * @function createWarning
 * @route {POST} /warnings/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing warning data.
 * @param {number} req.body.WARNING_LEVEL - The level of the warning.
 * @param {string} req.body.DESCRIPTION - The description of the warning.
 * @param {boolean} req.body.STATE - The state of the warning (active/inactive).
 * @param {number} req.body.ADMIN_ID - The ID of the admin issuing the warning.
 * @param {number} req.body.OFFICE_ID - The ID of the office relevant to the warning.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
WarningsController.createWarning = async (req, res) => {
    const { WARNING_LEVEL, DESCRIPTION, STATE, ADMIN_ID, OFFICE_ID } = req.body;
    try {
        const newWarning = await WarningModel.create({
            WARNING_LEVEL,
            DESCRIPTION,
            STATE,
            ADMIN_ID,
            OFFICE_ID
        });
        res.status(201).json(newWarning);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves all warnings from the database.
 * 
 * This function uses Sequelize's `findAll` method to retrieve all warning 
 * records from the 'WarningModel' table. If the operation is successful, 
 * the warning data is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getAllWarnings
 * @route {GET} /warnings
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
WarningsController.getAllWarnings = async (req, res) => {
    try {
        const warnings = await WarningModel.findAll({
            include: [
                {
                    model: UserModel,
                    attributes: ['USER_ID']
                },
                {
                    model: OfficeAdminModel,
                    attributes: ['OFFICE_ID']
                }
            ]
        });
        res.status(200).json(warnings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves a specific warning by ID from the database.
 * 
 * This function uses Sequelize's `findOne` method to retrieve a specific 
 * warning record from the 'WarningModel' table based on the provided ID. 
 * If the operation is successful, the warning data is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getWarningById
 * @route {GET} /warnings/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The parameters of the request.
 * @param {number} req.params.id - The ID of the warning to retrieve.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
WarningsController.getWarningById = async (req, res) => {
    const { id } = req.params;
    try {
        const warning = await WarningModel.findOne({
            where: {
                WARNING_ID: id
            },
            include: [
                {
                    model: UserModel,
                    attributes: ['USER_ID']
                },
                {
                    model: OfficeAdminModel,
                    attributes: ['OFFICE_ID']
                }
            ]
        });
        res.status(200).json(warning);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Updates a specific warning by ID in the database.
 * 
 * This function uses Sequelize's `update` method to update a specific 
 * warning record in the 'WarningModel' table based on the provided ID. 
 * If the operation is successful, a success message is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function updateWarning
 * @route {PUT} /warnings/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The parameters of the request.
 * @param {number} req.params.id - The ID of the warning to update.
 * @param {Object} req.body - The body of the request containing warning data.
 * @param {number} req.body.WARNING_LEVEL - The level of the warning.
 * @param {string} req.body.DESCRIPTION - The description of the warning.
 * @param {boolean} req.body.STATE - The state of the warning (active/inactive).
 * @param {number} req.body.ADMIN_ID - The ID of the admin issuing the warning.
 * @param {number} req.body.OFFICE_ID - The ID of the office relevant to the warning.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
WarningsController.updateWarning = async (req, res) => {
    const { id } = req.params;
    const { WARNING_LEVEL, DESCRIPTION, STATE, ADMIN_ID, OFFICE_ID } = req.body;
    try {
        await WarningModel.update({
            WARNING_LEVEL,
            DESCRIPTION,
            STATE,
            ADMIN_ID,
            OFFICE_ID
        }, {
            where: {
                WARNING_ID: id
            }
        });
        res.status(200).json({ message: 'Warning updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Deletes a specific warning by ID from the database.
 * 
 * This function uses Sequelize's `destroy` method to delete a specific 
 * warning record from the 'WarningModel' table based on the provided ID. 
 * If the operation is successful, a success message is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function deleteWarning
 * @route {DELETE} /warnings/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The parameters of the request.
 * @param {number} req.params.id - The ID of the warning to delete.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
WarningsController.deleteWarning = async (req, res) => {
    const { id } = req.params;
    try {
        await WarningModel.destroy({
            where: {
                WARNING_ID: id
            }
        });
        res.status(200).json({ message: 'Warning deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = WarningsController;
