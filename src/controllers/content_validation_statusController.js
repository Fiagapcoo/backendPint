const ContentValidationStatusModel = require('../models/content_validation_status');
const UserModel = require('../models/users');

const ContentValidationStatusController = {};

ContentValidationStatusController.createContentValidationStatus = async (req, res) => {
    const { CONTENT_TYPE, CONTENT_STATUS, CONTENT_REAL_ID, VALIDATOR_ID } = req.body;
    try {
        const newContentValidationStatus = await ContentValidationStatusModel.create({
            CONTENT_TYPE,
            CONTENT_STATUS,
            CONTENT_REAL_ID,
            VALIDATOR_ID
        });
        res.status(201).json(newContentValidationStatus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

ContentValidationStatusController.getAllContentValidationStatuses = async (req, res) => {
    try {
        const contentValidationStatuses = await ContentValidationStatusModel.findAll({
            include: [
                {
                    model: UserModel,
                    attributes: ['USER_ID']
                }
            ]
        });
        res.status(200).json(contentValidationStatuses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

ContentValidationStatusController.getContentValidationStatusById = async (req, res) => {
    const { id } = req.params;
    try {
        const contentValidationStatus = await ContentValidationStatusModel.findOne({
            where: {
                CONTENT_ID: id
            },
            include: [
                {
                    model: UserModel,
                    attributes: ['USER_ID']
                }
            ]
        });
        res.status(200).json(contentValidationStatus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

ContentValidationStatusController.updateContentValidationStatus = async (req, res) => {
    const { id } = req.params;
    const { CONTENT_TYPE, CONTENT_STATUS, CONTENT_REAL_ID, VALIDATOR_ID } = req.body;
    try {
        await ContentValidationStatusModel.update({
            CONTENT_TYPE,
            CONTENT_STATUS,
            CONTENT_REAL_ID,
            VALIDATOR_ID
        }, {
            where: {
                CONTENT_ID: id
            }
        });
        res.status(200).json({ message: 'Content Validation Status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

ContentValidationStatusController.deleteContentValidationStatus = async (req, res) => {
    const { id } = req.params;
    try {
        await ContentValidationStatusModel.destroy({
            where: {
                CONTENT_ID: id
            }
        });
        res.status(200).json({ message: 'Content Validation Status deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = ContentValidationStatusController;
