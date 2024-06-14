const office = require('../models/offices');

const officesController = {};

/**
 * @description Retrieves all offices from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all offices 
 * from the 'offices' table. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 400.
 * 
 * @async
 * @function list
 * @route {GET} /offices
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
officesController.list = async (req, res) => {
    try {
        const offices = await office.findAll();
        res.json(offices);
    } catch (error) {
        res.status(400).send('Error retrieving offices');
    }
}

/**
 * @description Retrieves a specific office by its ID from the database.
 * 
 * This function uses Sequelize's `findByPk` method to fetch a specific office 
 * from the 'offices' table by its ID. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 400.
 * 
 * @async
 * @function get
 * @route {GET} /offices/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the office.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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

/**
 * @description Updates an existing office record in the database.
 * 
 * This function uses Sequelize's `update` method to modify an existing office 
 * in the 'offices' table. It takes the office data from the request body 
 * and the ID of the office from the URL parameters. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 400.
 * 
 * @async
 * @function update
 * @route {PUT} /offices/update/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the office.
 * @param {Object} req.body - The body of the request containing office data.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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

/**
 * @description Creates a new office record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new office 
 * to the 'offices' table. It takes the office data from the request body. 
 * If the operation is successful, a success message and the newly created 
 * office data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 400.
 * 
 * @async
 * @function create
 * @route {POST} /offices/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing office data.
 * @param {string} req.body.CITY - The city of the office.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
officesController.create = async (req, res) => {
    try {
        const { CITY } = req.body;
        const newoffice = await office.create({
            CITY
        });
        res.json(newoffice);
    } catch (error) {
        console.log(error);
        res.status(400).send('Error creating office');
    }
}

/**
 * @description Deletes an office record from the database by its ID.
 * 
 * This function uses Sequelize's `destroy` method to remove an office 
 * from the 'offices' table by its ID. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 400.
 * 
 * @async
 * @function delete
 * @route {DELETE} /offices/delete/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the office.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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
