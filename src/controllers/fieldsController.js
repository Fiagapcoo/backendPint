const FieldModel = require('../models/fields');
const EventModel = require('../models/events');
const DefaultFieldModel = require('../models/default_fields');

const FieldsController = {};

FieldsController.createField = async (req, res) => {
    const { EVENT_ID, DEF_FIELD_ID, FIELD_NAME, FIELD_TYPE, FIELD_VALUE, MAX_VALUE, MIN_VALUE } = req.body;
    try {
        const newField = await FieldModel.create({
            EVENT_ID,
            DEF_FIELD_ID,
            FIELD_NAME,
            FIELD_TYPE,
            FIELD_VALUE,
            MAX_VALUE,
            MIN_VALUE
        });
        res.status(201).json(newField);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

FieldsController.getAllFields = async (req, res) => {
    try {
        const fields = await FieldModel.findAll({
            include: [
                {
                    model: EventModel,
                    attributes: ['EVENT_ID']
                },
                {
                    model: DefaultFieldModel,
                    attributes: ['FIELD_ID'],
                    required: false
                }
            ]
        });
        res.status(200).json(fields);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

FieldsController.getFieldById = async (req, res) => {
    const { eventId, fieldId } = req.params;
    try {
        const field = await FieldModel.findOne({
            where: {
                EVENT_ID: eventId,
                FIELD_ID: fieldId
            },
            include: [
                {
                    model: EventModel,
                    attributes: ['EVENT_ID']
                },
                {
                    model: DefaultFieldModel,
                    attributes: ['FIELD_ID'],
                    required: false
                }
            ]
        });
        res.status(200).json(field);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

FieldsController.updateField = async (req, res) => {
    const { eventId, fieldId } = req.params;
    const { DEF_FIELD_ID, FIELD_NAME, FIELD_TYPE, FIELD_VALUE, MAX_VALUE, MIN_VALUE } = req.body;
    try {
        await FieldModel.update({
            DEF_FIELD_ID,
            FIELD_NAME,
            FIELD_TYPE,
            FIELD_VALUE,
            MAX_VALUE,
            MIN_VALUE
        }, {
            where: {
                EVENT_ID: eventId,
                FIELD_ID: fieldId
            }
        });
        res.status(200).json({ message: 'Field updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

FieldsController.deleteField = async (req, res) => {
    const { eventId, fieldId } = req.params;
    try {
        await FieldModel.destroy({
            where: {
                EVENT_ID: eventId,
                FIELD_ID: fieldId
            }
        });
        res.status(200).json({ message: 'Field deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = FieldsController;
