const ForumModel = require('../models/forums');
const UserModel = require('../models/users');
const OfficeModel = require('../models/office_admins');
const SubAreaModel = require('../models/sub_area');
const EventModel = require('../models/events');

const ForumController = {};

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
