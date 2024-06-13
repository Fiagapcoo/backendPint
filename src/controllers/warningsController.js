const WarningModel = require('../models/warnings');
const UserModel = require('../models/users');
const OfficeAdminModel = require('../models/office_admins');

const WarningsController = {};

WarningsController.createWarning = async (req, res) => {
    const { WARNING_LEVEL, DESCRIPTION, STATE, ADMIN_ID, OFFICE_ID } = req.body;
    try {
        const newWarning = await WarningModel.create({
            WARNING_LEVEL,
            DESCRIPTION,
            STATE,
            ADMIN_ID,
            OFFICE_ID
        });
        res.status(201).json(newWarning);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

WarningsController.getAllWarnings = async (req, res) => {
    try {
        const warnings = await WarningModel.findAll({
            include: [
                {
                    model: UserModel,
                    attributes: ['USER_ID']
                },
                {
                    model: OfficeAdminModel,
                    attributes: ['OFFICE_ID']
                }
            ]
        });
        res.status(200).json(warnings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

WarningsController.getWarningById = async (req, res) => {
    const { id } = req.params;
    try {
        const warning = await WarningModel.findOne({
            where: {
                WARNING_ID: id
            },
            include: [
                {
                    model: UserModel,
                    attributes: ['USER_ID']
                },
                {
                    model: OfficeAdminModel,
                    attributes: ['OFFICE_ID']
                }
            ]
        });
        res.status(200).json(warning);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

WarningsController.updateWarning = async (req, res) => {
    const { id } = req.params;
    const { WARNING_LEVEL, DESCRIPTION, STATE, ADMIN_ID, OFFICE_ID } = req.body;
    try {
        await WarningModel.update({
            WARNING_LEVEL,
            DESCRIPTION,
            STATE,
            ADMIN_ID,
            OFFICE_ID
        }, {
            where: {
                WARNING_ID: id
            }
        });
        res.status(200).json({ message: 'Warning updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

WarningsController.deleteWarning = async (req, res) => {
    const { id } = req.params;
    try {
        await WarningModel.destroy({
            where: {
                WARNING_ID: id
            }
        });
        res.status(200).json({ message: 'Warning deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = WarningsController;
