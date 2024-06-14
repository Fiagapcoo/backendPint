const BookmarkModel = require('../models/bookmark');
const UserModel = require('../models/users');

const BookmarkController = {};

/**
 * @description Creates a new bookmark record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new bookmark 
 * to the 'Bookmarks' table. It takes the bookmark data from the request body. 
 * If the operation is successful, a success message and the newly created 
 * bookmark data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function createBookmark
 * @route {POST} /bookmarks/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing bookmark data.
 * @param {number} req.body.USER_ID - The ID of the user.
 * @param {number} req.body.CONTENT_ID - The ID of the content.
 * @param {string} req.body.CONTENT_TYPE - The type of the content (e.g., 'Post', 'Forum', 'Event').
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
BookmarkController.createBookmark = async (req, res) => {
    const { USER_ID, CONTENT_ID, CONTENT_TYPE } = req.body;
    try {
        const newBookmark = await BookmarkModel.create({
            USER_ID,
            CONTENT_ID,
            CONTENT_TYPE
        });
        res.status(201).json(newBookmark);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves all bookmarks from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all bookmarks 
 * from the 'Bookmarks' table. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getAllBookmarks
 * @route {GET} /bookmarks/list
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
BookmarkController.getAllBookmarks = async (req, res) => {
    try {
        const bookmarks = await BookmarkModel.findAll({
            include: [
                {
                    model: UserModel,
                    attributes: ['USER_ID']
                }
            ]
        });
        res.status(200).json(bookmarks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves a specific bookmark by ID from the database.
 * 
 * This function uses Sequelize's `findOne` method to fetch a specific bookmark 
 * from the 'Bookmarks' table by its ID. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getBookmarkById
 * @route {GET} /bookmarks/get/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the bookmark.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
BookmarkController.getBookmarkById = async (req, res) => {
    const { id } = req.params;
    try {
        const bookmark = await BookmarkModel.findOne({
            where: {
                BOOKMARK_ID: id
            },
            include: [
                {
                    model: UserModel,
                    attributes: ['USER_ID']
                }
            ]
        });
        res.status(200).json(bookmark);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Updates an existing bookmark record in the database.
 * 
 * This function uses Sequelize's `update` method to modify an existing bookmark 
 * in the 'Bookmarks' table. It takes the bookmark data from the request body 
 * and the ID of the bookmark from the URL parameters. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function updateBookmark
 * @route {PUT} /bookmarks/update/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the bookmark.
 * @param {Object} req.body - The body of the request containing bookmark data.
 * @param {number} req.body.USER_ID - The ID of the user.
 * @param {number} req.body.CONTENT_ID - The ID of the content.
 * @param {string} req.body.CONTENT_TYPE - The type of the content (e.g., 'Post', 'Forum', 'Event').
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
BookmarkController.updateBookmark = async (req, res) => {
    const { id } = req.params;
    const { USER_ID, CONTENT_ID, CONTENT_TYPE } = req.body;
    try {
        await BookmarkModel.update({
            USER_ID,
            CONTENT_ID,
            CONTENT_TYPE
        }, {
            where: {
                BOOKMARK_ID: id
            }
        });
        res.status(200).json({ message: 'Bookmark updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Deletes a bookmark record from the database by its ID.
 * 
 * This function uses Sequelize's `destroy` method to remove a bookmark 
 * from the 'Bookmarks' table by its ID. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function deleteBookmark
 * @route {DELETE} /bookmarks/delete/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the bookmark.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
BookmarkController.deleteBookmark = async (req, res) => {
    const { id } = req.params;
    try {
        await BookmarkModel.destroy({
            where: {
                BOOKMARK_ID: id
            }
        });
        res.status(200).json({ message: 'Bookmark deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = BookmarkController;
