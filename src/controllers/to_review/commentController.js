const CommentModel = require('../models/comment');
const UserModel = require('../models/users');
const PostModel = require('../models/posts');
const ForumModel = require('../models/forums');

const CommentsController = {};

/**
 * @description Creates a new comment record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new comment 
 * to the 'Comments' table. It takes the comment data from the request body. 
 * If the operation is successful, a success message and the newly created 
 * comment data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function createComment
 * @route {POST} /comments/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing comment data.
 * @param {number} req.body.FORUM_ID - The ID of the forum.
 * @param {number} req.body.POST_ID - The ID of the post.
 * @param {number} req.body.PUBLISHER_ID - The ID of the user publishing the comment.
 * @param {string} req.body.CONTENT - The content of the comment.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
CommentsController.createComment = async (req, res) => {
    const { FORUM_ID, POST_ID, PUBLISHER_ID, CONTENT } = req.body;
    try {
        const newComment = await CommentModel.create({
            FORUM_ID,
            POST_ID,
            PUBLISHER_ID,
            CONTENT
        });
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves all comments from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all comments 
 * from the 'Comments' table. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getAllComments
 * @route {GET} /comments/list
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
CommentsController.getAllComments = async (req, res) => {
    try {
        const comments = await CommentModel.findAll({
            include: [
                {
                    model: UserModel,
                    attributes: ['USER_ID']
                },
                {
                    model: PostModel,
                    attributes: ['POST_ID']
                },
                {
                    model: ForumModel,
                    attributes: ['FORUM_ID']
                }
            ]
        });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves a specific comment by its ID from the database.
 * 
 * This function uses Sequelize's `findOne` method to fetch a specific comment 
 * from the 'Comments' table by its ID. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getCommentById
 * @route {GET} /comments/get/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the comment.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
CommentsController.getCommentById = async (req, res) => {
    const { id } = req.params;
    try {
        const comment = await CommentModel.findOne({
            where: {
                COMMENT_ID: id
            },
            include: [
                {
                    model: UserModel,
                    attributes: ['USER_ID']
                },
                {
                    model: PostModel,
                    attributes: ['POST_ID']
                },
                {
                    model: ForumModel,
                    attributes: ['FORUM_ID']
                }
            ]
        });
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Updates an existing comment record in the database.
 * 
 * This function uses Sequelize's `update` method to modify an existing comment 
 * in the 'Comments' table. It takes the comment data from the request body 
 * and the ID of the comment from the URL parameters. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function updateComment
 * @route {PUT} /comments/update/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the comment.
 * @param {Object} req.body - The body of the request containing comment data.
 * @param {number} req.body.FORUM_ID - The ID of the forum.
 * @param {number} req.body.POST_ID - The ID of the post.
 * @param {number} req.body.PUBLISHER_ID - The ID of the user publishing the comment.
 * @param {string} req.body.CONTENT - The content of the comment.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
CommentsController.updateComment = async (req, res) => {
    const { id } = req.params;
    const { FORUM_ID, POST_ID, PUBLISHER_ID, CONTENT } = req.body;
    try {
        await CommentModel.update({
            FORUM_ID,
            POST_ID,
            PUBLISHER_ID,
            CONTENT
        }, {
            where: {
                COMMENT_ID: id
            }
        });
        res.status(200).json({ message: 'Comment updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Deletes a comment record from the database by its ID.
 * 
 * This function uses Sequelize's `destroy` method to remove a comment 
 * from the 'Comments' table by its ID. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function deleteComment
 * @route {DELETE} /comments/delete/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the comment.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
CommentsController.deleteComment = async (req, res) => {
    const { id } = req.params;
    try {
        await CommentModel.destroy({
            where: {
                COMMENT_ID: id
            }
        });
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = CommentsController;
