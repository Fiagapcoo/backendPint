const ParticipationModel = require('../models/participation');
const UserModel = require('../models/users');
const EventModel = require('../models/events');

const ParticipationController = {};

/**
 * @description Creates a new participation record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new participation 
 * to the 'Participation' table. It takes the participation data from the request body. 
 * If the operation is successful, a success message and the newly created 
 * participation data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function createParticipation
 * @route {POST} /participation/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing participation data.
 * @param {number} req.body.USER_ID - The ID of the user.
 * @param {number} req.body.EVENT_ID - The ID of the event.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ParticipationController.createParticipation = async (req, res) => {
    const { USER_ID, EVENT_ID } = req.body;
    try {
        const newParticipation = await ParticipationModel.create({
            USER_ID,
            EVENT_ID
        });
        res.status(201).json(newParticipation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves all participations from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all participations 
 * from the 'Participation' table. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getAllParticipations
 * @route {GET} /participation
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ParticipationController.getAllParticipations = async (req, res) => {
    try {
        const participations = await ParticipationModel.findAll({
            include: [
                {
                    model: UserModel,
                    attributes: ['USER_ID']
                },
                {
                    model: EventModel,
                    attributes: ['EVENT_ID']
                }
            ]
        });
        res.status(200).json(participations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves a specific participation by user ID and event ID from the database.
 * 
 * This function uses Sequelize's `findOne` method to fetch a specific participation 
 * from the 'Participation' table by user ID and event ID. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getParticipationById
 * @route {GET} /participation/:userId/:eventId
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.userId - The ID of the user.
 * @param {number} req.params.eventId - The ID of the event.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ParticipationController.getParticipationById = async (req, res) => {
    const { userId, eventId } = req.params;
    try {
        const participation = await ParticipationModel.findOne({
            where: {
                USER_ID: userId,
                EVENT_ID: eventId
            },
            include: [
                {
                    model: UserModel,
                    attributes: ['USER_ID']
                },
                {
                    model: EventModel,
                    attributes: ['EVENT_ID']
                }
            ]
        });
        res.status(200).json(participation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Deletes a participation record from the database by user ID and event ID.
 * 
 * This function uses Sequelize's `destroy` method to remove a participation 
 * from the 'Participation' table by user ID and event ID. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function deleteParticipation
 * @route {DELETE} /participation/delete/:userId/:eventId
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.userId - The ID of the user.
 * @param {number} req.params.eventId - The ID of the event.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ParticipationController.deleteParticipation = async (req, res) => {
    const { userId, eventId } = req.params;
    try {
        await ParticipationModel.destroy({
            where: {
                USER_ID: userId,
                EVENT_ID: eventId
            }
        });
        res.status(200).json({ message: 'Participation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = ParticipationController;
