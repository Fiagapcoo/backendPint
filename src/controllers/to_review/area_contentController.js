const area_contentModel = require('../models/area_content');
const languageModel = require('../models/language');
const area_contentController = {};

/**
 * @description Retrieves all area content records from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all area content 
 * from the 'area_content' table. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getAll
 * @route {GET} /area_content/list
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
area_contentController.getAll = async (req, res) => {
    const area_content = await area_contentModel.findAll({
        include: [languageModel]
    });
    res.json({ area_content });
}

/**
 * @description Retrieves a specific area content record by AREA_ID from the database.
 * 
 * This function uses Sequelize's `findOne` method to fetch a specific area content 
 * from the 'area_content' table by its AREA_ID. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getOne
 * @route {GET} /area_content/get/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The AREA_ID of the area content.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
area_contentController.getOne = async (req, res) => {
    const { id } = req.params;
    const area_content = await area_contentModel.findOne({
        where: {
            AREA_ID: id
        },
        include: [languageModel]
    });
    res.json({ area_content });
}

/**
 * @description Creates a new area content record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new area content 
 * to the 'area_content' table. It takes the area content data from the request body. 
 * If the operation is successful, a success message and the newly created 
 * area content data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function create
 * @route {POST} /area_content/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing area content data.
 * @param {number} req.body.AREA_ID - The ID of the area.
 * @param {number} req.body.LANGUAGE_ID - The ID of the language.
 * @param {string} req.body.TRANSLATED_TITLE - The translated title of the area content.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
area_contentController.create = async (req, res) => {
    const { AREA_ID, LANGUAGE_ID, TRANSLATED_TITLE } = req.body;
    const area_content = await area_contentModel.create({
        AREA_ID,
        LANGUAGE_ID,
        TRANSLATED_TITLE
    });
    res.json({ area_content });
}

/**
 * @description Updates an existing area content record in the database.
 * 
 * This function uses Sequelize's `update` method to modify an existing area content 
 * in the 'area_content' table. It takes the area content data from the request body 
 * and updates the record based on AREA_ID and LANGUAGE_ID. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function update
 * @route {PUT} /area_content/update
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing area content data.
 * @param {number} req.body.AREA_ID - The ID of the area.
 * @param {number} req.body.LANGUAGE_ID - The ID of the language.
 * @param {string} req.body.TRANSLATED_TITLE - The translated title of the area content.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
area_contentController.update = async (req, res) => {
    const { AREA_ID, LANGUAGE_ID, TRANSLATED_TITLE } = req.body;
    const area_content = await area_contentModel.update({
        TRANSLATED_TITLE
    }, {
        where: {
            AREA_ID,
            LANGUAGE_ID
        }
    });
    res.json({ area_content });
}

/**
 * @description Deletes an area content record from the database by AREA_ID.
 * 
 * This function uses Sequelize's `destroy` method to remove an area content 
 * from the 'area_content' table by its AREA_ID. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function delete
 * @route {DELETE} /area_content/delete/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The AREA_ID of the area content.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
area_contentController.delete = async (req, res) => {
    const { id } = req.params;
    const area_content = await area_contentModel.destroy({
        where: {
            AREA_ID: id
        }
    });
    res.json({ area_content });
}

module.exports = area_contentController;
