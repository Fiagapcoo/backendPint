const EventForumAccessModel = require('../models/event_forum_access');
const UserModel = require('../models/users');
const ForumModel = require('../models/forums');

const EventForumAccessController = {};

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
        res.status (500).json({ message: error.message });
    }
}

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
