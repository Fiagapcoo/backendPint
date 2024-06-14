const FieldModel = require('../models/fields');
const EventModel = require('../models/events');
const DefaultFieldModel = require('../models/default_fields');

const FieldsController = {};

/**
 * @description Creates a new field record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new field 
 * to the 'Fields' table. It takes the field data from the request body. 
 * If the operation is successful, a success message and the newly created 
 * field data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function createField
 * @route {POST} /fields/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing field data.
 * @param {number} req.body.EVENT_ID - The ID of the event.
 * @param {number} req.body.DEF_FIELD_ID - The ID of the default field.
 * @param {string} req.body.FIELD_NAME - The name of the field.
 * @param {string} req.body.FIELD_TYPE - The type of the field.
 * @param {string} req.body.FIELD_VALUE - The value of the field.
 * @param {number} [req.body.MAX_VALUE] - The maximum value of the field.
 * @param {number} [req.body.MIN_VALUE] - The minimum value of the field.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
FieldsController.createField = async (req, res) => {
    const { EVENT_ID, DEF_FIELD_ID, FIELD_NAME, FIELD_TYPE, FIELD_VALUE, MAX_VALUE, MIN_VALUE } = req.body;
    try {
        const newField = await FieldModel.create({
            EVENT_ID,
            DEF_FIELD_ID,
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
 * @description Retrieves all fields from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all fields 
 * from the 'Fields' table. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getAllFields
 * @route {GET} /fields/list
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
FieldsController.getAllFields = async (req, res) => {
    try {
        const fields = await FieldModel.findAll({
            include: [
                {
                    model: EventModel,
                    attributes: ['EVENT_ID']
                },
                {
                    model: DefaultFieldModel,
                    attributes: ['FIELD_ID'],
                    required: false
                }
            ]
        });
        res.status(200).json(fields);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves a specific field by its event ID and field ID from the database.
 * 
 * This function uses Sequelize's `findOne` method to fetch a specific field 
 * from the 'Fields' table by its event ID and field ID. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getFieldById
 * @route {GET} /fields/get/:eventId/:fieldId
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.eventId - The ID of the event.
 * @param {number} req.params.fieldId - The ID of the field.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
FieldsController.getFieldById = async (req, res) => {
    const { eventId, fieldId } = req.params;
    try {
        const field = await FieldModel.findOne({
            where: {
                EVENT_ID: eventId,
                FIELD_ID: fieldId
            },
            include: [
                {
                    model: EventModel,
                    attributes: ['EVENT_ID']
                },
                {
                    model: DefaultFieldModel,
                    attributes: ['FIELD_ID'],
                    required: false
                }
            ]
        });
        res.status(200).json(field);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Updates an existing field record in the database.
 * 
 * This function uses Sequelize's `update` method to modify an existing field 
 * in the 'Fields' table. It takes the field data from the request body 
 * and the event ID and field ID from the URL parameters. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function updateField
 * @route {PUT} /fields/update/:eventId/:fieldId
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.eventId - The ID of the event.
 * @param {number} req.params.fieldId - The ID of the field.
 * @param {Object} req.body - The body of the request containing field data.
 * @param {number} req.body.DEF_FIELD_ID - The ID of the default field.
 * @param {string} req.body.FIELD_NAME - The name of the field.
 * @param {string} req.body.FIELD_TYPE - The type of the field.
 * @param {string} req.body.FIELD_VALUE - The value of the field.
 * @param {number} [req.body.MAX_VALUE] - The maximum value of the field.
 * @param {number} [req.body.MIN_VALUE] - The minimum value of the field.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
FieldsController.updateField = async (req, res) => {
    const { eventId, fieldId } = req.params;
    const { DEF_FIELD_ID, FIELD_NAME, FIELD_TYPE, FIELD_VALUE, MAX_VALUE, MIN_VALUE } = req.body;
    try {
        await FieldModel.update({
            DEF_FIELD_ID,
            FIELD_NAME,
            FIELD_TYPE,
            FIELD_VALUE,
            MAX_VALUE,
            MIN_VALUE
        }, {
            where: {
                EVENT_ID: eventId,
                FIELD_ID: fieldId
            }
        });
        res.status(200).json({ message: 'Field updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Deletes a field record from the database by its event ID and field ID.
 * 
 * This function uses Sequelize's `destroy` method to remove a field 
 * from the 'Fields' table by its event ID and field ID. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function deleteField
 * @route {DELETE} /fields/delete/:eventId/:fieldId
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.eventId - The ID of the event.
 * @param {number} req.params.fieldId - The ID of the field.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
FieldsController.deleteField = async (req, res) => {
    const { eventId, fieldId } = req.params;
    try {
        await FieldModel.destroy({
            where: {
                EVENT_ID: eventId,
                FIELD_ID: fieldId
            }
        });
        res.status(200).json({ message: 'Field deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = FieldsController;
