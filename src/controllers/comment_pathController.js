const CommentPathModel = require('../models/comment_path');
const CommentModel = require('../models/comment');

const CommentPathController = {};

/**
 * @description Creates a new comment path record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new comment path 
 * to the 'CommentPaths' table. It takes the comment path data from the request body. 
 * If the operation is successful, a success message and the newly created 
 * comment path data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function createCommentPath
 * @route {POST} /comment_paths/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing comment path data.
 * @param {number} req.body.ANCESTOR_ID - The ID of the ancestor comment.
 * @param {number} req.body.DESCENDANT_ID - The ID of the descendant comment.
 * @param {number} req.body.DEPTH - The depth of the comment path.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
CommentPathController.createCommentPath = async (req, res) => {
    const { ANCESTOR_ID, DESCENDANT_ID, DEPTH } = req.body;
    try {
        const newCommentPath = await CommentPathModel.create({
            ANCESTOR_ID,
            DESCENDANT_ID,
            DEPTH
        });
        res.status(201).json(newCommentPath);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves all comment paths from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all comment paths 
 * from the 'CommentPaths' table. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getAllCommentPaths
 * @route {GET} /comment_paths/list
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
CommentPathController.getAllCommentPaths = async (req, res) => {
    try {
        const commentPaths = await CommentPathModel.findAll({
            include: [
                {
                    model: CommentModel,
                    as: 'Ancestor',
                    attributes: ['COMMENT_ID']
                },
                {
                    model: CommentModel,
                    as: 'Descendant',
                    attributes: ['COMMENT_ID']
                }
            ]
        });
        res.status(200).json(commentPaths);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves a specific comment path by its ancestor and descendant IDs from the database.
 * 
 * This function uses Sequelize's `findOne` method to fetch a specific comment path 
 * from the 'CommentPaths' table by its ancestor and descendant IDs. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getCommentPathById
 * @route {GET} /comment_paths/get/:ancestorId/:descendantId
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.ancestorId - The ID of the ancestor comment.
 * @param {number} req.params.descendantId - The ID of the descendant comment.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
CommentPathController.getCommentPathById = async (req, res) => {
    const { ancestorId, descendantId } = req.params;
    try {
        const commentPath = await CommentPathModel.findOne({
            where: {
                ANCESTOR_ID: ancestorId,
                DESCENDANT_ID: descendantId
            },
            include: [
                {
                    model: CommentModel,
                    as: 'Ancestor',
                    attributes: ['COMMENT_ID']
                },
                {
                    model: CommentModel,
                    as: 'Descendant',
                    attributes: ['COMMENT_ID']
                }
            ]
        });
        res.status(200).json(commentPath);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Deletes a comment path record from the database by its ancestor and descendant IDs.
 * 
 * This function uses Sequelize's `destroy` method to remove a comment path 
 * from the 'CommentPaths' table by its ancestor and descendant IDs. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function deleteCommentPath
 * @route {DELETE} /comment_paths/delete/:ancestorId/:descendantId
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.ancestorId - The ID of the ancestor comment.
 * @param {number} req.params.descendantId - The ID of the descendant comment.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
CommentPathController.deleteCommentPath = async (req, res) => {
    const { ancestorId, descendantId } = req.params;
    try {
        await CommentPathModel.destroy({
            where: {
                ANCESTOR_ID: ancestorId,
                DESCENDANT_ID: descendantId
            }
        });
        res.status(200).json({ message: 'Comment path deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = CommentPathController;
