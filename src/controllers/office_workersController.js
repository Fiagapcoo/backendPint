const office_workers = require('../models/office_workers');

const office_workersController = {};

/**
 * @description Retrieves all office workers from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all office workers 
 * from the 'office_workers' table. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 400.
 * 
 * @async
 * @function list
 * @route {GET} /office_workers
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
office_workersController.list = async (req, res) => {
    try {
        const newoffice_workers = await office_workers.findAll();
        res.json(newoffice_workers);
    } catch (error) {
        res.status(400).send('Error retrieving office_workers');
    }
}

/**
 * @description Retrieves a specific office worker by its ID from the database.
 * 
 * This function uses Sequelize's `findByPk` method to fetch a specific office worker 
 * from the 'office_workers' table by its ID. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 400.
 * 
 * @async
 * @function get
 * @route {GET} /office_workers/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the office worker.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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

/**
 * @description Updates an existing office worker record in the database.
 * 
 * This function uses Sequelize's `update` method to modify an existing office worker 
 * in the 'office_workers' table. It takes the office worker data from the request body 
 * and the ID of the office worker from the URL parameters. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 400.
 * 
 * @async
 * @function update
 * @route {PUT} /office_workers/update/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the office worker.
 * @param {Object} req.body - The body of the request containing office worker data.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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

/**
 * @description Creates a new office worker record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new office worker 
 * to the 'office_workers' table. It takes the office worker data from the request body. 
 * If the operation is successful, a success message and the newly created 
 * office worker data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 400.
 * 
 * @async
 * @function create
 * @route {POST} /office_workers/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing office worker data.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
office_workersController.create = async (req, res) => {
    try {
        const newoffice_workers = await office_workers.create(req.body);
        res.json(newoffice_workers);
    } catch (error) {
        res.status(400).send('Error creating office_workers');
    }
}

/**
 * @description Deletes an office worker record from the database by its ID.
 * 
 * This function uses Sequelize's `destroy` method to remove an office worker 
 * from the 'office_workers' table by its ID. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 400.
 * 
 * @async
 * @function delete
 * @route {DELETE} /office_workers/delete/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the office worker.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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
