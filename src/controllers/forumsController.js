const ForumModel = require('../models/forums');
const UserModel = require('../models/users');
const OfficeModel = require('../models/office_admins');
const SubAreaModel = require('../models/sub_area');
const EventModel = require('../models/events');

const ForumController = {};

/**
 * @description Creates a new forum record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new forum 
 * to the 'Forums' table. It takes the forum data from the request body. 
 * If the operation is successful, a success message and the newly created 
 * forum data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function createForum
 * @route {POST} /forums/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing forum data.
 * @param {number} req.body.PUBLISHER_ID - The ID of the publisher.
 * @param {number} req.body.OFFICE_ID - The ID of the office.
 * @param {number} req.body.SUB_AREA_ID - The ID of the sub-area.
 * @param {number} req.body.ADMIN_ID - The ID of the admin.
 * @param {string} req.body.TITLE - The title of the forum.
 * @param {string} req.body.CONTENT - The content of the forum.
 * @param {number} req.body.EVENT_ID - The ID of the event.
 * @param {boolean} req.body.VALIDATED - Indicates if the forum is validated.
 * @param {boolean} req.body.FORUM_STATUS - The status of the forum.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ForumController.createForum = async (req, res) => {
    const { PUBLISHER_ID, OFFICE_ID, SUB_AREA_ID, ADMIN_ID, TITLE, CONTENT, EVENT_ID, VALIDATED, FORUM_STATUS } = req.body;
    try {
        const newForum = await ForumModel.create({
            PUBLISHER_ID,
            OFFICE_ID,
            SUB_AREA_ID,
            ADMIN_ID,
            TITLE,
            CONTENT,
            EVENT_ID,
            VALIDATED,
            FORUM_STATUS
        });
        res.status(201).json(newForum);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves all forums from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all forums 
 * from the 'Forums' table. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getAllForums
 * @route {GET} /forums/list
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ForumController.getAllForums = async (req, res) => {
    try {
        const forums = await ForumModel.findAll({
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
                    model: EventModel,
                    as: 'Event',
                    attributes: ['EVENT_ID']
                },
                {
                    model: UserModel,
                    as: 'Admin',
                    attributes: ['USER_ID']
                }
            ]
        });
        res.status(200).json(forums);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves a specific forum by its ID from the database.
 * 
 * This function uses Sequelize's `findOne` method to fetch a specific forum 
 * from the 'Forums' table by its ID. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getForumById
 * @route {GET} /forums/get/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the forum.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ForumController.getForumById = async (req, res) => {
    const { id } = req.params;
    try {
        const forum = await ForumModel.findOne({
            where: {
                FORUM_ID: id
            },
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
                    model: EventModel,
                    as: 'Event',
                    attributes: ['EVENT_ID']
                },
                {
                    model: UserModel,
                    as: 'Admin',
                    attributes: ['USER_ID']
                }
            ]
        });
        res.status(200).json(forum);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Updates an existing forum record in the database.
 * 
 * This function uses Sequelize's `update` method to modify an existing forum 
 * in the 'Forums' table. It takes the forum data from the request body 
 * and the ID of the forum from the URL parameters. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function updateForum
 * @route {PUT} /forums/update/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the forum.
 * @param {Object} req.body - The body of the request containing forum data.
 * @param {number} req.body.PUBLISHER_ID - The ID of the publisher.
 * @param {number} req.body.OFFICE_ID - The ID of the office.
 * @param {number} req.body.SUB_AREA_ID - The ID of the sub-area.
 * @param {number} req.body.ADMIN_ID - The ID of the admin.
 * @param {string} req.body.TITLE - The title of the forum.
 * @param {string} req.body.CONTENT - The content of the forum.
 * @param {number} req.body.EVENT_ID - The ID of the event.
 * @param {boolean} req.body.VALIDATED - Indicates if the forum is validated.
 * @param {boolean} req.body.FORUM_STATUS - The status of the forum.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ForumController.updateForum = async (req, res) => {
    const { id } = req.params;
    const { PUBLISHER_ID, OFFICE_ID, SUB_AREA_ID, ADMIN_ID, TITLE, CONTENT, EVENT_ID, VALIDATED, FORUM_STATUS } = req.body;
    try {
        await ForumModel.update({
            PUBLISHER_ID,
            OFFICE_ID,
            SUB_AREA_ID,
            ADMIN_ID,
            TITLE,
            CONTENT,
            EVENT_ID,
            VALIDATED,
            FORUM_STATUS
        }, {
            where: {
                FORUM_ID: id
            }
        });
        res.status(200).json({ message: 'Forum updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Deletes a forum record from the database by its ID.
 * 
 * This function uses Sequelize's `destroy` method to remove a forum 
 * from the 'Forums' table by its ID. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function deleteForum
 * @route {DELETE} /forums/delete/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the forum.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ForumController.deleteForum = async (req, res) => {
    const { id } = req.params;
    try {
        await ForumModel.destroy({
            where: {
                FORUM_ID: id
            }
        });
        res.status(200).json({ message: 'Forum deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = ForumController;
