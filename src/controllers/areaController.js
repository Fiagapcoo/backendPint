const areaModel = require('../models/area');
const areaController = {};

/**
 * @description Retrieves all areas from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all areas 
 * from the 'area' table. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 400.
 * 
 * @async
 * @function list
 * @route {GET} /areas/list
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
areaController.list = async (req, res) => {
    try {
        const areas = await areaModel.findAll();
        res.json(areas);
    } catch (error) {
        res.status(400).send('Error retrieving areas');
    }
}

/**
 * @description Retrieves a specific area by its ID from the database.
 * 
 * This function uses Sequelize's `findByPk` method to fetch a specific area 
 * from the 'area' table by its ID. The result is returned as a JSON response. 
 * If the area is not found, a 404 status code is returned. In case of an error, 
 * an error message is returned with HTTP status 400.
 * 
 * @async
 * @function get
 * @route {GET} /areas/get/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the area.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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

/**
 * @description Updates an existing area record in the database.
 * 
 * This function uses Sequelize's `update` method to modify an existing area 
 * in the 'area' table. It takes the updated data from the request body 
 * and the ID of the area from the URL parameters. If the operation is successful, 
 * the updated area is returned as a JSON response. If the area is not found, 
 * a 404 status code is returned. In case of an error, an error message is returned 
 * with HTTP status 400.
 * 
 * @async
 * @function update
 * @route {PUT} /areas/update/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the area.
 * @param {Object} req.body - The body of the request containing the updated area data.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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

/**
 * @description Creates a new area record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new area 
 * to the 'area' table. It takes the area data from the request body. 
 * The AREA_ID is set to the maximum existing AREA_ID plus 100. 
 * If the operation is successful, the newly created area is returned 
 * as a JSON response. In case of an error, an error message is returned 
 * with HTTP status 400.
 * 
 * @async
 * @function create
 * @route {POST} /areas/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing the area data.
 * @param {string} req.body.TITLE - The title of the area.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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

/**
 * @description Deletes an area record from the database by its ID.
 * 
 * This function uses Sequelize's `destroy` method to remove an area 
 * from the 'area' table by its ID. If the operation is successful, 
 * a success message is returned. If the area is not found, a 404 status code 
 * is returned. In case of an error, an error message is returned with HTTP status 400.
 * 
 * @async
 * @function delete
 * @route {DELETE} /areas/delete/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the area.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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
