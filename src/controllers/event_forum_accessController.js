const EventForumAccessModel = require('../models/event_forum_access');
const UserModel = require('../models/users');
const ForumModel = require('../models/forums');

const EventForumAccessController = {};

/**
 * @description Creates a new event forum access record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new event forum access 
 * to the 'EventForumAccess' table. It takes the access data from the request body. 
 * If the operation is successful, a success message and the newly created 
 * access data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function createAccess
 * @route {POST} /event_forum_access/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing access data.
 * @param {number} req.body.USER_ID - The ID of the user.
 * @param {number} req.body.FORUM_ID - The ID of the forum.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
EventForumAccessController.createAccess = async (req, res) => {
    const { USER_ID, FORUM_ID } = req.body;
    try {
        const newAccess = await EventForumAccessModel.create({
            USER_ID,
            FORUM_ID
        });
        res.status(201).json(newAccess);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves all event forum accesses from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all event forum accesses 
 * from the 'EventForumAccess' table. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getAllAccesses
 * @route {GET} /event_forum_access/list
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
EventForumAccessController.getAllAccesses = async (req, res) => {
    try {
        const accesses = await EventForumAccessModel.findAll({
            include: [
                {
                    model: UserModel,
                    attributes: ['USER_ID']
                },
                {
                    model: ForumModel,
                    attributes: ['FORUM_ID']
                }
            ]
        });
        res.status(200).json(accesses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves a specific event forum access by user ID and forum ID from the database.
 * 
 * This function uses Sequelize's `findOne` method to fetch a specific event forum access 
 * from the 'EventForumAccess' table by its user ID and forum ID. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getAccessById
 * @route {GET} /event_forum_access/get/:userId/:forumId
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.userId - The ID of the user.
 * @param {number} req.params.forumId - The ID of the forum.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
EventForumAccessController.getAccessById = async (req, res) => {
    const { userId, forumId } = req.params;
    try {
        const access = await EventForumAccessModel.findOne({
            where: {
                USER_ID: userId,
                FORUM_ID: forumId
            },
            include: [
                {
                    model: UserModel,
                    attributes: ['USER_ID']
                },
                {
                    model: ForumModel,
                    attributes: ['FORUM_ID']
                }
            ]
        });
        res.status(200).json(access);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Deletes an event forum access record from the database by user ID and forum ID.
 * 
 * This function uses Sequelize's `destroy` method to remove an event forum access 
 * from the 'EventForumAccess' table by its user ID and forum ID. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function deleteAccess
 * @route {DELETE} /event_forum_access/delete/:userId/:forumId
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.userId - The ID of the user.
 * @param {number} req.params.forumId - The ID of the forum.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
EventForumAccessController.deleteAccess = async (req, res) => {
    const { userId, forumId } = req.params;
    try {
        await EventForumAccessModel.destroy({
            where: {
                USER_ID: userId,
                FORUM_ID: forumId
            }
        });
        res.status(200).json({ message: 'Access deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = EventForumAccessController;
