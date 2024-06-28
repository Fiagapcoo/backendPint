const DefaultFieldModel = require('../models/default_fields');

const DefaultFieldController = {};

/**
 * @description Creates a new default field record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new default field 
 * to the 'DefaultFields' table. It takes the field data from the request body. 
 * If the operation is successful, a success message and the newly created 
 * field data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function createField
 * @route {POST} /default_fields/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing field data.
 * @param {string} req.body.FIELD_NAME - The name of the field.
 * @param {string} req.body.FIELD_TYPE - The type of the field.
 * @param {string} req.body.FIELD_VALUE - The value of the field.
 * @param {number} [req.body.MAX_VALUE] - The maximum value of the field.
 * @param {number} [req.body.MIN_VALUE] - The minimum value of the field.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
DefaultFieldController.createField = async (req, res) => {
    const { FIELD_NAME, FIELD_TYPE, FIELD_VALUE, MAX_VALUE, MIN_VALUE } = req.body;
    try {
        const newField = await DefaultFieldModel.create({
            FIELD_NAME,
            FIELD_TYPE,
            FIELD_VALUE,
            MAX_VALUE,
            MIN_VALUE
        });
        res.status(201).json(newField);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves all default fields from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all default fields 
 * from the 'DefaultFields' table. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getAllFields
 * @route {GET} /default_fields/list
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
DefaultFieldController.getAllFields = async (req, res) => {
    try {
        const fields = await DefaultFieldModel.findAll();
        res.status(200).json(fields);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves a specific default field by its ID from the database.
 * 
 * This function uses Sequelize's `findOne` method to fetch a specific default field 
 * from the 'DefaultFields' table by its ID. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getFieldById
 * @route {GET} /default_fields/get/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the field.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
DefaultFieldController.getFieldById = async (req, res) => {
    const { id } = req.params;
    try {
        const field = await DefaultFieldModel.findOne({
            where: {
                FIELD_ID: id
            }
        });
        res.status(200).json(field);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Updates an existing default field record in the database.
 * 
 * This function uses Sequelize's `update` method to modify an existing default field 
 * in the 'DefaultFields' table. It takes the field data from the request body 
 * and the ID of the field from the URL parameters. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function updateField
 * @route {PUT} /default_fields/update/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the field.
 * @param {Object} req.body - The body of the request containing field data.
 * @param {string} req.body.FIELD_NAME - The name of the field.
 * @param {string} req.body.FIELD_TYPE - The type of the field.
 * @param {string} req.body.FIELD_VALUE - The value of the field.
 * @param {number} [req.body.MAX_VALUE] - The maximum value of the field.
 * @param {number} [req.body.MIN_VALUE] - The minimum value of the field.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
DefaultFieldController.updateField = async (req, res) => {
    const { id } = req.params;
    const { FIELD_NAME, FIELD_TYPE, FIELD_VALUE, MAX_VALUE, MIN_VALUE } = req.body;
    try {
        await DefaultFieldModel.update({
            FIELD_NAME,
            FIELD_TYPE,
            FIELD_VALUE,
            MAX_VALUE,
            MIN_VALUE
        }, {
            where: {
                FIELD_ID: id
            }
        });
        res.status(200).json({ message: 'Field updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Deletes a default field record from the database by its ID.
 * 
 * This function uses Sequelize's `destroy` method to remove a default field 
 * from the 'DefaultFields' table by its ID. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function deleteField
 * @route {DELETE} /default_fields/delete/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the field.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
DefaultFieldController.deleteField = async (req, res) => {
    const { id } = req.params;
    try {
        await DefaultFieldModel.destroy({
            where: {
                FIELD_ID: id
            }
        });
        res.status(200).json({ message: 'Field deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = DefaultFieldController;
