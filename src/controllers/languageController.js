const LanguageModel = require('../models/language');

const LanguageController = {};

/**
 * @description Retrieves all languages from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all languages 
 * from the 'Language' table. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getLanguages
 * @route {GET} /languages
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
LanguageController.getLanguages = async (req, res) => {
    try {
        const languages = await LanguageModel.findAll();
        res.json(languages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves a specific language by its ID from the database.
 * 
 * This function uses Sequelize's `findByPk` method to fetch a specific language 
 * from the 'Language' table by its ID. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getLanguage
 * @route {GET} /languages/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the language.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
LanguageController.getLanguage = async (req, res) => {
    try {
        const language = await LanguageModel.findByPk(req.params.id);
        res.json(language);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Creates a new language record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new language 
 * to the 'Language' table. It takes the language data from the request body. 
 * If the operation is successful, a success message and the newly created 
 * language data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function createLanguage
 * @route {POST} /languages/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing language data.
 * @param {string} req.body.LANGUAGE_NAME - The name of the language.
 * @param {string} req.body.LANGUAGE_CODE - The code of the language.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
LanguageController.createLanguage = async (req, res) => {
    try {
        const language = await LanguageModel.create(req.body);
        res.json(language);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Updates an existing language record in the database.
 * 
 * This function uses Sequelize's `update` method to modify an existing language 
 * in the 'Language' table. It takes the language data from the request body 
 * and the ID of the language from the URL parameters. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function updateLanguage
 * @route {PUT} /languages/update/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the language.
 * @param {Object} req.body - The body of the request containing language data.
 * @param {string} req.body.LANGUAGE_NAME - The name of the language.
 * @param {string} req.body.LANGUAGE_CODE - The code of the language.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
LanguageController.updateLanguage = async (req, res) => {
    try {
        const language = await LanguageModel.findByPk(req.params.id);
        await language.update(req.body);
        res.json(language);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Deletes a language record from the database by its ID.
 * 
 * This function uses Sequelize's `destroy` method to remove a language 
 * from the 'Language' table by its ID. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function deleteLanguage
 * @route {DELETE} /languages/delete/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the language.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
LanguageController.deleteLanguage = async (req, res) => {
    try {
        const language = await LanguageModel.findByPk(req.params.id);
        await language.destroy();
        res.json({ deleted: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = LanguageController;
