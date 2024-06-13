const EventModel = require('../models/events');
const UserModel = require('../models/users');
const OfficeModel = require('../models/office_admins');
const SubAreaModel = require('../models/sub_area');

const EventController = {};

EventController.createEvent = async (req, res) => {
    const { PUBLISHER_ID, OFFICE_ID, SUBAREA_ID, ADMIN_ID, NAME, DESCRIPTION, EVENT_DATE, EVENT_LOCATION, FILEPATH, RECURRING, RECURRING_PATTERN, MAX_PARTICIPANTS, CURRENT_PARTICIPANTS, VALIDATED } = req.body;
    try {
        const newEvent = await EventModel.create({
            PUBLISHER_ID,
            OFFICE_ID,
            SUBAREA_ID,
            ADMIN_ID,
            NAME,
            DESCRIPTION,
            EVENT_DATE,
            EVENT_LOCATION,
            FILEPATH,
            RECURRING,
            RECURRING_PATTERN,
            MAX_PARTICIPANTS,
            CURRENT_PARTICIPANTS,
            VALIDATED
        });
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

EventController.getAllEvents = async (req, res) => {
    try {
        const events = await EventModel.findAll({
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
                    model: UserModel,
                    as: 'Admin',
                    attributes: ['USER_ID']
                }
            ]
        });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

EventController.getEventById = async (req, res) => {
    const { id } = req.params;
    try {
        const event = await EventModel.findOne({
            where: {
                EVENT_ID: id
            },
            include: [
                {
                    model: UserModel,
                    as: 'Publisher',
                    attributes: ['USER_ID', 'USERNAME']
                },
                {
                    model: OfficeModel,
                    as: 'OfficeAdmin',
                    attributes: ['OFFICE_ID', 'OFFICE_NAME']
                },
                {
                    model: SubAreaModel,
                    as: 'SubArea',
                    attributes: ['SUB_AREA_ID', 'SUB_AREA_NAME']
                },
                {
                    model: UserModel,
                    as: 'Admin',
                    attributes: ['USER_ID', 'USERNAME']
                }
            ]
        });
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

EventController.updateEvent = async (req, res) => {
    const { id } = req.params;
    const { PUBLISHER_ID, OFFICE_ID, SUBAREA_ID, ADMIN_ID, NAME, DESCRIPTION, EVENT_DATE, EVENT_LOCATION, FILEPATH, RECURRING, RECURRING_PATTERN, MAX_PARTICIPANTS, CURRENT_PARTICIPANTS, VALIDATED } = req.body;
    try {
        await EventModel.update({
            PUBLISHER_ID,
            OFFICE_ID,
            SUBAREA_ID,
            ADMIN_ID,
            NAME,
            DESCRIPTION,
            EVENT_DATE,
            EVENT_LOCATION,
            FILEPATH,
            RECURRING,
            RECURRING_PATTERN,
            MAX_PARTICIPANTS,
            CURRENT_PARTICIPANTS,
            VALIDATED
        }, {
            where: {
                EVENT_ID: id
            }
        });
        res.status(200).json({ message: 'Event updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

EventController.deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        await EventModel.destroy({
            where: {
                EVENT_ID: id
            }
        });
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = EventController;
