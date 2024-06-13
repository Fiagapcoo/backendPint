const CommentPathModel = require('../models/comment_path');
const CommentModel = require('../models/comment');

const CommentPathController = {};

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
