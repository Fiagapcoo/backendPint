const areaModel = require('../models/area');
const areaController = {};

areaController.list = async (req, res) => {
    try {
        const areas = await areaModel.findAll();
        res.json(areas);
    } catch (error) {
        res.status(400).send('Error retrieving areas');
    }
}

areaController.get = async (req, res) => {
    try {
        const { id } = req.params;
        const area = await areaModel.findByPk(id);
        if (area) {
            res.json(area);
        } else {
            res.status(404).send('Area not found');
        }
    } catch (error) {
        res.status(400).send('Error retrieving area');
    }
}

areaController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await areaModel.update(req.body, {
            where: { id: id }
        });
        if (updated) {
            const updatedArea = await areaModel.findByPk(id);
            res.json(updatedArea);
        } else {
            res.status(404).send('Area not found');
        }
    } catch (error) {
        res.status(400).send('Error updating area');
    }
}

areaController.create = async (req, res) => {
    try {
        const newAreaIndex = await areaModel.max('AREA_ID') + 100;
        const newArea = await areaModel.create(
            {
                AREA_ID: newAreaIndex,
                TITLE: req.body.TITLE
            }
        );
        res.json(newArea);
    } catch (error) {
        res.status(400).send('Error creating area');
    }
}

areaController.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const area = await areaModel.findByPk(id);
        if (area) {
            await area.destroy();
            res.send('Area deleted');
        } else {
            res.status(404).send('Area not found');
        }
    } catch (error) {
        res.status(400).send('Error deleting area');
    }
}

module.exports = areaController;