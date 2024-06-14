const office_admins = require('../models/office_admins');

const office_adminsController = {};

/**
 * @description Retrieves all office admins from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all office admins 
 * from the 'office_admins' table. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 400.
 * 
 * @async
 * @function list
 * @route {GET} /office_admins
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
office_adminsController.list = async (req, res) => {
    try {
        const newoffice_admins = await office_admins.findAll();
        res.json(newoffice_admins);
    } catch (error) {
        res.status(400).send('Error retrieving office_admins');
    }
}

/**
 * @description Retrieves a specific office admin by its ID from the database.
 * 
 * This function uses Sequelize's `findByPk` method to fetch a specific office admin 
 * from the 'office_admins' table by its ID. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 400.
 * 
 * @async
 * @function get
 * @route {GET} /office_admins/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the office admin.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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

/**
 * @description Updates an existing office admin record in the database.
 * 
 * This function uses Sequelize's `update` method to modify an existing office admin 
 * in the 'office_admins' table. It takes the office admin data from the request body 
 * and the ID of the office admin from the URL parameters. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 400.
 * 
 * @async
 * @function update
 * @route {PUT} /office_admins/update/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the office admin.
 * @param {Object} req.body - The body of the request containing office admin data.
 * @param {number} req.body.OFFICE_ID - The ID of the office.
 * @param {number} req.body.MANAGER_ID - The ID of the manager.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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

/**
 * @description Creates a new office admin record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new office admin 
 * to the 'office_admins' table. It takes the office admin data from the request body. 
 * If the operation is successful, a success message and the newly created 
 * office admin data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 400.
 * 
 * @async
 * @function create
 * @route {POST} /office_admins/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing office admin data.
 * @param {number} req.body.OFFICE_ID - The ID of the office.
 * @param {number} req.body.MANAGER_ID - The ID of the manager.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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

/**
 * @description Deletes an office admin record from the database by its ID.
 * 
 * This function uses Sequelize's `destroy` method to remove an office admin 
 * from the 'office_admins' table by its ID. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 400.
 * 
 * @async
 * @function delete
 * @route {DELETE} /office_admins/delete/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the office admin.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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
