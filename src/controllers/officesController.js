const office = require('../models/offices');

const officesController = {};

officesController.list = async (req, res) => {
    try {
        const offices = await office.findAll();
        res.json(offices);
    } catch (error) {
        res.status(400).send('Error retrieving offices');
    }
}

officesController.get = async (req, res) => {
    try {
        const { id } = req.params;
        const offices = await office.findByPk(id);
        if (offices) {
            res.json(offices);
        } else {
            res.status(404).send('offices not found');
        }
    } catch (error) {
        res.status(400).send('Error retrieving offices');
    }
}

officesController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await office.update(req.body, {
            where: { id: id }
        });
        if (updated) {
            const updatedoffice = await office.findByPk(id);
            res.json(updatedoffice);
        } else {
            res.status(404).send('offices not found');
        }
    } catch (error) {
        res.status(400).send('Error updating offices');
    }
}

officesController.create = async (req, res) => {
    try {
        const { CITY } = req.body;
        const newoffice = await office.create
            ({
                CITY
            });

        res.json(newoffice);
    } catch (error) {
        console.log(error);
        res.status(400).send('Error creating office');
    }
}

officesController.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const office = await office.findByPk(id);
        if (office) {
            await office.destroy();
            res.json(office);
        } else {
            res.status(404).send('offices not found');
        }
    } catch (error) {
        res.status(400).send('Error deleting offices');
    }
}

module.exports = officesController;