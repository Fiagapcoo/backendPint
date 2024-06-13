const ParticipationModel = require('../models/participation');
const UserModel = require('../models/users');
const EventModel = require('../models/events');

const ParticipationController = {};

ParticipationController.createParticipation = async (req, res) => {
    const { USER_ID, EVENT_ID } = req.body;
    try {
        const newParticipation = await ParticipationModel.create({
            USER_ID,
            EVENT_ID
        });
        res.status(201).json(newParticipation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

ParticipationController.getAllParticipations = async (req, res) => {
    try {
        const participations = await ParticipationModel.findAll({
            include: [
                {
                    model: UserModel,
                    attributes: ['USER_ID']
                },
                {
                    model: EventModel,
                    attributes: ['EVENT_ID']
                }
            ]
        });
        res.status(200).json(participations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

ParticipationController.getParticipationById = async (req, res) => {
    const { userId, eventId } = req.params;
    try {
        const participation = await ParticipationModel.findOne({
            where: {
                USER_ID: userId,
                EVENT_ID: eventId
            },
            include: [
                {
                    model: UserModel,
                    attributes: ['USER_ID']
                },
                {
                    model: EventModel,
                    attributes: ['EVENT_ID']
                }
            ]
        });
        res.status(200).json(participation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

ParticipationController.deleteParticipation = async (req, res) => {
    const { userId, eventId } = req.params;
    try {
        await ParticipationModel.destroy({
            where: {
                USER_ID: userId,
                EVENT_ID: eventId
            }
        });
        res.status(200).json({ message: 'Participation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = ParticipationController;
