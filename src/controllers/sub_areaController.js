const sub_areaModel = require('../models/sub_area');
const areaModel = require('../models/area');

const sub_areaController = {};

sub_areaController.getAllSubAreas = async (req, res) => {
    try {
        const sub_areas = await sub_areaModel.findAll(
            {
                include: [
                    {
                        model: areaModel,
                        required: true
                    }
                ]
            }
        );
        res.json(sub_areas);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error'
        });
    }
}

sub_areaController.getSubArea = async (req, res) => {
    try {
        const sub_area = await sub_areaModel.findByPk(req.params.id);
        if (sub_area) {
            res.json(sub_area);
        } else {
            res.status(404).json({
                message: 'Sub Area Not Found'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error'
        });
    }
}

sub_areaController.createSubArea = async (req, res) => {
    try {
        const { AREA_ID, TITLE } = req.body;

        // Check if AREA_ID and TITLE are provided
        if (!AREA_ID || !TITLE) {
            return res.status(400).json({ error: 'AREA_ID and TITLE are required' });
        }

        // Find the maximum SUB_AREA_ID for the given AREA_ID
        const maxSubAreaID = await sub_areaModel.max('SUB_AREA_ID', {
            where: { AREA_ID: AREA_ID }
        });

        // Log the max SUB_AREA_ID
        console.log('Max SUB_AREA_ID:', maxSubAreaID);

        // Calculate the new SUB_AREA_ID
        const newSubAreaID = maxSubAreaID ? maxSubAreaID + 1 : AREA_ID * 1000 + 1;

        // Create the new SubArea
        const newSubArea = await sub_areaModel.create({
            SUB_AREA_ID: newSubAreaID,
            AREA_ID: AREA_ID,
            TITLE: TITLE
        });

        // Respond with the newly created SubArea
        res.status(201).json(newSubArea);
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error creating new SubArea:', error);

        // Respond with a 500 status code and error message
        res.status(500).json({ error: 'Failed to create SubArea' });
    }
};


sub_areaController.updateSubArea = async (req, res) => {
    try {
        const sub_area = await sub_areaModel.findByPk(req.params.id);
        if (sub_area) {
            const { AREA_ID, TITLE } = req.body;
            await sub_area.update({
                AREA_ID: AREA_ID,
                TITLE: TITLE
            });
            res.json(sub_area);
        } else {
            res.status(404).json({
                message: 'Sub Area Not Found'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error'
        });
    }
}

sub_areaController.deleteSubArea = async (req, res) => {
    try {
        const sub_area = await sub_areaModel.findByPk(req.params.id);
        if (sub_area) {
            await sub_area.destroy();
            res.json({
                message: 'Sub Area deleted successfully'
            });
        } else {
            res.status(404).json({
                message: 'Sub Area Not Found'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error'
        });
    }
}

module.exports = sub_areaController;