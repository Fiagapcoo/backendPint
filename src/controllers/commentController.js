const CommentModel = require('../models/comment');
const UserModel = require('../models/users');
const PostModel = require('../models/posts');
const ForumModel = require('../models/forums');

const CommentsController = {};

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
