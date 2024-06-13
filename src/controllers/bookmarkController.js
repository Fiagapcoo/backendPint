const BookmarkModel = require('../models/bookmark');
const UserModel = require('../models/users');

const BookmarkController = {};

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
