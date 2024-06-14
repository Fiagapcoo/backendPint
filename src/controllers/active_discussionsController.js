const ActiveDiscussionModel = require('../models/active_discussions');
const ForumModel = require('../models/forums');

const ActiveDiscussionsController = {};

/**
 * @description Creates a new active discussion record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new active discussion 
 * to the 'ActiveDiscussions' table. It takes the discussion data from the request body. 
 * If the operation is successful, a success message and the newly created 
 * discussion data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function createActiveDiscussion
 * @route {POST} /active_discussions/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing discussion data.
 * @param {number} req.body.FORUM_ID - The ID of the forum.
 * @param {string} req.body.LAST_ACTIVITY_DATE - The date of the last activity.
 * @param {number} req.body.ACTIVE_PARTICIPANTS - The number of active participants.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ActiveDiscussionsController.createActiveDiscussion = async (req, res) => {
    const { FORUM_ID, LAST_ACTIVITY_DATE, ACTIVE_PARTICIPANTS } = req.body;
    try {
        const newActiveDiscussion = await ActiveDiscussionModel.create({
            FORUM_ID,
            LAST_ACTIVITY_DATE,
            ACTIVE_PARTICIPANTS
        });
        res.status(201).json(newActiveDiscussion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves all active discussions from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all active discussions 
 * from the 'ActiveDiscussions' table. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getAllActiveDiscussions
 * @route {GET} /active_discussions/list
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ActiveDiscussionsController.getAllActiveDiscussions = async (req, res) => {
    try {
        const activeDiscussions = await ActiveDiscussionModel.findAll({
            include: [
                {
                    model: ForumModel,
                    attributes: ['FORUM_ID']
                }
            ]
        });
        res.status(200).json(activeDiscussions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves an active discussion by ID from the database.
 * 
 * This function uses Sequelize's `findOne` method to fetch a specific active discussion 
 * from the 'ActiveDiscussions' table by its ID. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getActiveDiscussionById
 * @route {GET} /active_discussions/get/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the active discussion.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ActiveDiscussionsController.getActiveDiscussionById = async (req, res) => {
    const { id } = req.params;
    try {
        const activeDiscussion = await ActiveDiscussionModel.findOne({
            where: {
                DISCUSSION_ID: id
            },
            include: [
                {
                    model: ForumModel,
                    attributes: ['FORUM_ID']
                }
            ]
        });
        res.status(200).json(activeDiscussion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Updates an existing active discussion record in the database.
 * 
 * This function uses Sequelize's `update` method to modify an existing active discussion 
 * in the 'ActiveDiscussions' table. It takes the discussion data from the request body 
 * and the ID of the discussion from the URL parameters. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function updateActiveDiscussion
 * @route {PUT} /active_discussions/update/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the active discussion.
 * @param {Object} req.body - The body of the request containing discussion data.
 * @param {number} req.body.FORUM_ID - The ID of the forum.
 * @param {string} req.body.LAST_ACTIVITY_DATE - The date of the last activity.
 * @param {number} req.body.ACTIVE_PARTICIPANTS - The number of active participants.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ActiveDiscussionsController.updateActiveDiscussion = async (req, res) => {
    const { id } = req.params;
    const { FORUM_ID, LAST_ACTIVITY_DATE, ACTIVE_PARTICIPANTS } = req.body;
    try {
        await ActiveDiscussionModel.update({
            FORUM_ID,
            LAST_ACTIVITY_DATE,
            ACTIVE_PARTICIPANTS
        }, {
            where: {
                DISCUSSION_ID: id
            }
        });
        res.status(200).json({ message: 'Active Discussion updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Deletes an active discussion record from the database.
 * 
 * This function uses Sequelize's `destroy` method to remove an active discussion 
 * from the 'ActiveDiscussions' table by its ID. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function deleteActiveDiscussion
 * @route {DELETE} /active_discussions/delete/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the active discussion.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ActiveDiscussionsController.deleteActiveDiscussion = async (req, res) => {
    const { id } = req.params;
    try {
        await ActiveDiscussionModel.destroy({
            where: {
                DISCUSSION_ID: id
            }
        });
        res.status(200).json({ message: 'Active Discussion deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = ActiveDiscussionsController;
