const sub_areaModel = require('../models/sub_area');
const areaModel = require('../models/area');

const sub_areaController = {};

/**
 * @description Retrieves all sub-areas from the database, including their associated areas.
 * 
 * This function uses Sequelize's `findAll` method to fetch all sub-areas 
 * from the 'sub_areas' table, including associated area information. 
 * The result is returned as a JSON response. In case of an error, an error message 
 * is returned with HTTP status 500.
 * 
 * @async
 * @function getAllSubAreas
 * @route {GET} /sub_areas
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
sub_areaController.getAllSubAreas = async (req, res) => {
    try {
        const sub_areas = await sub_areaModel.findAll({
            include: [
                {
                    model: areaModel,
                    required: true
                }
            ]
        });
        res.json(sub_areas);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error'
        });
    }
}

/**
 * @description Retrieves a specific sub-area by its ID from the database.
 * 
 * This function uses Sequelize's `findByPk` method to fetch a specific sub-area 
 * from the 'sub_areas' table by its ID. The result is returned as a JSON response. 
 * If the sub-area is not found, a 404 status code is returned with an error message. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getSubArea
 * @route {GET} /sub_areas/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the sub-area.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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

/**
 * @description Creates a new sub-area record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new sub-area 
 * to the 'sub_areas' table. It takes the sub-area data from the request body. 
 * If the operation is successful, a success message and the newly created 
 * sub-area data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function createSubArea
 * @route {POST} /sub_areas
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing sub-area data.
 * @param {number} req.body.AREA_ID - The ID of the associated area.
 * @param {string} req.body.TITLE - The title of the sub-area.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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
}

/**
 * @description Updates an existing sub-area record in the database.
 * 
 * This function uses Sequelize's `update` method to modify an existing sub-area 
 * in the 'sub_areas' table. It takes the sub-area data from the request body 
 * and the ID of the sub-area from the URL parameters. If the operation is successful, 
 * the updated sub-area data is returned as a JSON response. In case the sub-area is not found, 
 * a 404 status code is returned with an error message. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function updateSubArea
 * @route {PUT} /sub_areas/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the sub-area.
 * @param {Object} req.body - The body of the request containing sub-area data.
 * @param {number} [req.body.AREA_ID] - The ID of the associated area.
 * @param {string} [req.body.TITLE] - The title of the sub-area.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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

/**
 * @description Deletes a sub-area record from the database by its ID.
 * 
 * This function uses Sequelize's `destroy` method to remove a sub-area 
 * from the 'sub_areas' table by its ID. If the operation is successful, 
 * a success message is returned as a JSON response. In case the sub-area is not found, 
 * a 404 status code is returned with an error message. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function deleteSubArea
 * @route {DELETE} /sub_areas/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the sub-area.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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
