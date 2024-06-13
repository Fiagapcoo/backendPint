const office_admins = require('../models/office_admins');

const office_adminsController = {};

office_adminsController.list = async (req, res) => {
    try {
        const newoffice_admins = await office_admins.findAll();
        res.json(newoffice_admins);
    } catch (error) {
        res.status(400).send('Error retrieving office_admins');
    }
}

office_adminsController.get = async (req, res) => {
    try {
        const { id } = req.params;
        const newoffice_admins = await office_admins.findByPk(id);
        if (newoffice_admins) {
            res.json(newoffice_admins);
        } else {
            res.status(404).send('office_admins not found');
        }
    } catch (error) {
        res.status(400).send('Error retrieving office_admins');
    }
}

office_adminsController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await office_admins.update(req.body, {
            where: { id: id }
        });
        if (updated) {
            const updatedoffice_admins = await office_admins.findByPk(id);
            res.json(updatedoffice_admins);
        } else {
            res.status(404).send('office_admins not found');
        }
    } catch (error) {
        res.status(400).send('Error updating office_admins');
    }
}

office_adminsController.create = async (req, res) => {
    try {
        const { OFFICE_ID, MANAGER_ID } = req.body;
        const newoffice_admins = await office_admins.create(
            {
                OFFICE_ID: OFFICE_ID,
                MANAGER_ID: MANAGER_ID
            });
        res.json(newoffice_admins);
    } catch (error) {
        console.log(error);
        res.status(400).send('Error creating office_admins');
    }
}

office_adminsController.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await office_admins.destroy({
            where: { id: id }
        });
        if (deleted) {
            res.json('office_admins deleted');
        } else {
            res.status(404).send('office_admins not found');
        }
    } catch (error) {
        res.status(400).send('Error deleting office_admins');
    }
}

module.exports = office_adminsController;