const office_workers = require('../models/office_workers');

const office_workersController = {};

office_workersController.list = async (req, res) => {
    try {
        const newoffice_workers = await office_workers.findAll();
        res.json(newoffice_workers);
    } catch (error) {
        res.status(400).send('Error retrieving office_workers');
    }
}

office_workersController.get = async (req, res) => {
    try {
        const { id } = req.params;
        const newoffice_workers = await office_workers.findByPk(id);
        if (newoffice_workers) {
            res.json(newoffice_workers);
        } else {
            res.status(404).send('office_workers not found');
        }
    } catch (error) {
        res.status(400).send('Error retrieving office_workers');
    }
}

office_workersController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await office_workers.update(req.body, {
            where: { id: id }
        });
        if (updated) {
            const updatedoffice_workers = await office_workers.findByPk(id);
            res.json(updatedoffice_workers);
        } else {
            res.status(404).send('office_workers not found');
        }
    } catch (error) {
        res.status(400).send('Error updating office_workers');
    }
}


office_workersController.create = async (req, res) => {
    try {
        const newoffice_workers = await office_workers.create(req.body);
        res.json(newoffice_workers);
    } catch (error) {
        res.status(400).send('Error creating office_workers');
    }
}

office_workersController.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const newoffice_workers = await office_workers.findByPk(id);
        if (newoffice_workers) {
            await newoffice_workers.destroy();
            res.json(newoffice_workers);
        } else {
            res.status(404).send('office_workers not found');
        }
    } catch (error) {
        res.status(400).send('Error deleting office_workers');
    }
}

module.exports = office_workersController;