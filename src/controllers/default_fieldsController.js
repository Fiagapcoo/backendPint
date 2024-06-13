const DefaultFieldModel = require('../models/default_fields');

const DefaultFieldController = {};

DefaultFieldController.createField = async (req, res) => {
    const { FIELD_NAME, FIELD_TYPE, FIELD_VALUE, MAX_VALUE, MIN_VALUE } = req.body;
    try {
        const newField = await DefaultFieldModel.create({
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

DefaultFieldController.getAllFields = async (req, res) => {
    try {
        const fields = await DefaultFieldModel.findAll();
        res.status(200).json(fields);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

DefaultFieldController.getFieldById = async (req, res) => {
    const { id } = req.params;
    try {
        const field = await DefaultFieldModel.findOne({
            where: {
                FIELD_ID: id
            }
        });
        res.status(200).json(field);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

DefaultFieldController.updateField = async (req, res) => {
    const { id } = req.params;
    const { FIELD_NAME, FIELD_TYPE, FIELD_VALUE, MAX_VALUE, MIN_VALUE } = req.body;
    try {
        await DefaultFieldModel.update({
            FIELD_NAME,
            FIELD_TYPE,
            FIELD_VALUE,
            MAX_VALUE,
            MIN_VALUE
        }, {
            where: {
                FIELD_ID: id
            }
        });
        res.status(200).json({ message: 'Field updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

DefaultFieldController.deleteField = async (req, res) => {
    const { id } = req.params;
    try {
        await DefaultFieldModel.destroy({
            where: {
                FIELD_ID: id
            }
        });
        res.status(200).json({ message: 'Field deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = DefaultFieldController;
