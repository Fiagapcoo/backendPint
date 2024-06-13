const ActiveDiscussionModel = require('../models/active_discussions');
const ForumModel = require('../models/forums');

const ActiveDiscussionsController = {};

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
