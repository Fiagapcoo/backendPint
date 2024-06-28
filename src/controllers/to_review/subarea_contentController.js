const SubAreaContentModel = require('../models/subarea_content');
const LanguageModel = require('../models/language');

const subarea_contentController = {};

/**
 * @description Retrieves all sub-area content from the database, including their associated languages.
 * 
 * This function uses Sequelize's `findAll` method to fetch all sub-area content 
 * from the 'sub_area_content' table, including associated language information. 
 * The result is returned as a JSON response. In case of an error, an error message 
 * is returned with HTTP status 500.
 * 
 * @async
 * @function getAll
 * @route {GET} /subarea_content
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
subarea_contentController.getAll = async (req, res) => {
    try {
        const subarea_content = await SubAreaContentModel.findAll({
            include: [LanguageModel]
        });
        res.json(subarea_content);
    } catch (error) {
        res.status(500).json({
            message: 'Error: ' + error
        });
    }
};

/**
 * @description Retrieves specific sub-area content by its ID from the database.
 * 
 * This function uses Sequelize's `findOne` method to fetch specific sub-area content 
 * from the 'sub_area_content' table by its ID. The result is returned as a JSON response. 
 * If the sub-area content is not found, a 404 status code is returned with an error message. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getById
 * @route {GET} /subarea_content/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the sub-area content.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
subarea_contentController.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const subarea_content = await SubAreaContentModel.findOne({
            where: {
                SUB_AREA_ID: id
            },
            include: [LanguageModel]
        });
        res.json(subarea_content);
    } catch (error) {
        res.status(500).json({
            message: 'Error: ' + error
        });
    }
};

/**
 * @description Creates a new sub-area content record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new sub-area content 
 * to the 'sub_area_content' table. It takes the sub-area content data from the request body. 
 * If the operation is successful, the newly created sub-area content data is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function create
 * @route {POST} /subarea_content
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing sub-area content data.
 * @param {number} req.body.SUB_AREA_ID - The ID of the sub-area.
 * @param {number} req.body.LANGUAGE_ID - The ID of the language.
 * @param {string} req.body.TRANSLATED_TITLE - The translated title of the sub-area content.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
subarea_contentController.create = async (req, res) => {
    const { SUB_AREA_ID, LANGUAGE_ID, TRANSLATED_TITLE } = req.body;
    try {
        const subarea_content = await SubAreaContentModel.create({
            SUB_AREA_ID,
            LANGUAGE_ID,
            TRANSLATED_TITLE
        });
        res.json(subarea_content);
    } catch (error) {
        res.status(500).json({
            message: 'Error: ' + error
        });
    }
};

/**
 * @description Updates an existing sub-area content record in the database.
 * 
 * This function uses Sequelize's `update` method to modify an existing sub-area content 
 * in the 'sub_area_content' table. It takes the sub-area content data from the request body 
 * and the ID of the sub-area content from the URL parameters. If the operation is successful, 
 * the updated sub-area content data is returned as a JSON response. In case the sub-area content is not found, 
 * a 404 status code is returned with an error message. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function update
 * @route {PUT} /subarea_content
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing sub-area content data.
 * @param {number} req.body.SUB_AREA_ID - The ID of the sub-area.
 * @param {number} req.body.LANGUAGE_ID - The ID of the language.
 * @param {string} req.body.TRANSLATED_TITLE - The translated title of the sub-area content.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
subarea_contentController.update = async (req, res) => {
    const { SUB_AREA_ID, LANGUAGE_ID, TRANSLATED_TITLE } = req.body;
    try {
        const subarea_content = await SubAreaContentModel.update({
            TRANSLATED_TITLE
        }, {
            where: {
                SUB_AREA_ID,
                LANGUAGE_ID
            }
        });
        res.json(subarea_content);
    } catch (error) {
        res.status(500).json({
            message: 'Error: ' + error
        });
    }
};

/**
 * @description Deletes a sub-area content record from the database by its ID.
 * 
 * This function uses Sequelize's `destroy` method to remove a sub-area content 
 * from the 'sub_area_content' table by its ID. If the operation is successful, 
 * a success message is returned as a JSON response. In case the sub-area content is not found, 
 * a 404 status code is returned with an error message. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function delete
 * @route {DELETE} /subarea_content/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the sub-area content.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
subarea_contentController.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const subarea_content = await SubAreaContentModel.destroy({
            where: {
                SUB_AREA_ID: id
            }
        });
        res.json(subarea_content);
    } catch (error) {
        res.status(500).json({
            message: 'Error: ' + error
        });
    }
};

module.exports = subarea_contentController;
