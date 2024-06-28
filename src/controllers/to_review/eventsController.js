const EventModel = require('../models/events');
const UserModel = require('../models/users');
const OfficeModel = require('../models/office_admins');
const SubAreaModel = require('../models/sub_area');

const EventController = {};

/**
 * @description Creates a new event record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new event 
 * to the 'Events' table. It takes the event data from the request body. 
 * If the operation is successful, a success message and the newly created 
 * event data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function createEvent
 * @route {POST} /events/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing event data.
 * @param {number} req.body.PUBLISHER_ID - The ID of the publisher.
 * @param {number} req.body.OFFICE_ID - The ID of the office.
 * @param {number} req.body.SUBAREA_ID - The ID of the sub-area.
 * @param {number} req.body.ADMIN_ID - The ID of the admin.
 * @param {string} req.body.NAME - The name of the event.
 * @param {string} req.body.DESCRIPTION - The description of the event.
 * @param {Date} req.body.EVENT_DATE - The date of the event.
 * @param {string} [req.body.EVENT_LOCATION] - The location of the event.
 * @param {string} [req.body.FILEPATH] - The filepath for any associated files.
 * @param {boolean} req.body.RECURRING - Indicates if the event is recurring.
 * @param {string} [req.body.RECURRING_PATTERN] - The recurring pattern in JSON format.
 * @param {number} [req.body.MAX_PARTICIPANTS] - The maximum number of participants.
 * @param {number} [req.body.CURRENT_PARTICIPANTS] - The current number of participants.
 * @param {boolean} req.body.VALIDATED - Indicates if the event is validated.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
EventController.createEvent = async (req, res) => {
    const { PUBLISHER_ID, OFFICE_ID, SUBAREA_ID, ADMIN_ID, NAME, DESCRIPTION, EVENT_DATE, EVENT_LOCATION, FILEPATH, RECURRING, RECURRING_PATTERN, MAX_PARTICIPANTS, CURRENT_PARTICIPANTS, VALIDATED } = req.body;
    try {
        const newEvent = await EventModel.create({
            PUBLISHER_ID,
            OFFICE_ID,
            SUBAREA_ID,
            ADMIN_ID,
            NAME,
            DESCRIPTION,
            EVENT_DATE,
            EVENT_LOCATION,
            FILEPATH,
            RECURRING,
            RECURRING_PATTERN,
            MAX_PARTICIPANTS,
            CURRENT_PARTICIPANTS,
            VALIDATED
        });
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @description Retrieves all events from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all events 
 * from the 'Events' table. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getAllEvents
 * @route {GET} /events/list
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
EventController.getAllEvents = async (req, res) => {
    try {
        const events = await EventModel.findAll({
            include: [
                {
                    model: UserModel,
                    as: 'Publisher',
                    attributes: ['USER_ID']
                },
                {
                    model: OfficeModel,
                    as: 'OfficeAdmin',
                    attributes: ['OFFICE_ID']
                },
                {
                    model: SubAreaModel,
                    as: 'SubArea',
                    attributes: ['SUB_AREA_ID']
                },
                {
                    model: UserModel,
                    as: 'Admin',
                    attributes: ['USER_ID']
                }
            ]
        });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @description Retrieves a specific event by its ID from the database.
 * 
 * This function uses Sequelize's `findOne` method to fetch a specific event 
 * from the 'Events' table by its ID. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getEventById
 * @route {GET} /events/get/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the event.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
EventController.getEventById = async (req, res) => {
    const { id } = req.params;
    try {
        const event = await EventModel.findOne({
            where: {
                EVENT_ID: id
            },
            include: [
                {
                    model: UserModel,
                    as: 'Publisher',
                    attributes: ['USER_ID', 'USERNAME']
                },
                {
                    model: OfficeModel,
                    as: 'OfficeAdmin',
                    attributes: ['OFFICE_ID', 'OFFICE_NAME']
                },
                {
                    model: SubAreaModel,
                    as: 'SubArea',
                    attributes: ['SUB_AREA_ID', 'SUB_AREA_NAME']
                },
                {
                    model: UserModel,
                    as: 'Admin',
                    attributes: ['USER_ID', 'USERNAME']
                }
            ]
        });
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @description Updates an existing event record in the database.
 * 
 * This function uses Sequelize's `update` method to modify an existing event 
 * in the 'Events' table. It takes the event data from the request body 
 * and the ID of the event from the URL parameters. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function updateEvent
 * @route {PUT} /events/update/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the event.
 * @param {Object} req.body - The body of the request containing event data.
 * @param {number} req.body.PUBLISHER_ID - The ID of the publisher.
 * @param {number} req.body.OFFICE_ID - The ID of the office.
 * @param {number} req.body.SUBAREA_ID - The ID of the sub-area.
 * @param {number} req.body.ADMIN_ID - The ID of the admin.
 * @param {string} req.body.NAME - The name of the event.
 * @param {string} req.body.DESCRIPTION - The description of the event.
 * @param {Date} req.body.EVENT_DATE - The date of the event.
 * @param {string} [req.body.EVENT_LOCATION] - The location of the event.
 * @param {string} [req.body.FILEPATH] - The filepath for any associated files.
 * @param {boolean} req.body.RECURRING - Indicates if the event is recurring.
 * @param {string} [req.body.RECURRING_PATTERN] - The recurring pattern in JSON format.
 * @param {number} [req.body.MAX_PARTICIPANTS] - The maximum number of participants.
 * @param {number} [req.body.CURRENT_PARTICIPANTS] - The current number of participants.
 * @param {boolean} req.body.VALIDATED - Indicates if the event is validated.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
EventController.updateEvent = async (req, res) => {
    const { id } = req.params;
    const { PUBLISHER_ID, OFFICE_ID, SUBAREA_ID, ADMIN_ID, NAME, DESCRIPTION, EVENT_DATE, EVENT_LOCATION, FILEPATH, RECURRING, RECURRING_PATTERN, MAX_PARTICIPANTS, CURRENT_PARTICIPANTS, VALIDATED } = req.body;
    try {
        await EventModel.update({
            PUBLISHER_ID,
            OFFICE_ID,
            SUBAREA_ID,
            ADMIN_ID,
            NAME,
            DESCRIPTION,
            EVENT_DATE,
            EVENT_LOCATION,
            FILEPATH,
            RECURRING,
            RECURRING_PATTERN,
            MAX_PARTICIPANTS,
            CURRENT_PARTICIPANTS,
            VALIDATED
        }, {
            where: {
                EVENT_ID: id
            }
        });
        res.status(200).json({ message: 'Event updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @description Deletes an event record from the database by its ID.
 * 
 * This function uses Sequelize's `destroy` method to remove an event 
 * from the 'Events' table by its ID. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function deleteEvent
 * @route {DELETE} /events/delete/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the event.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
EventController.deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        await EventModel.destroy({
            where: {
                EVENT_ID: id
            }
        });
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = EventController;
