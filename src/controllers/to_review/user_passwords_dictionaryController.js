const user_passwords_dictionaryModel = require('../models/user_passwords_dictionary');
const userModel = require('../models/users');
const user_passwords_dictionaryController = {};

/**
 * @description Retrieves all user password dictionaries from the database, including their associated user information.
 * 
 * This function uses Sequelize's `findAll` method to fetch all user password dictionary 
 * entries from the 'user_passwords_dictionary' table, including associated user information. 
 * The result is returned as a JSON response. In case of an error, an error message 
 * is returned with HTTP status 400.
 * 
 * @async
 * @function list
 * @route {GET} /user_passwords_dictionary
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
user_passwords_dictionaryController.list = async (req, res) => {
    try {
        const user_passwords_dictionary = await user_passwords_dictionaryModel.findAll({
            include: {
                model: userModel,
                required: true
            }
        });
        res.json(user_passwords_dictionary);
    } catch (error) {
        res.status(400).send('Error retrieving user_passwords_dictionary');
    }
}

/**
 * @description Retrieves a specific user password dictionary entry by its ID from the database.
 * 
 * This function uses Sequelize's `findByPk` method to fetch a specific user password dictionary 
 * entry from the 'user_passwords_dictionary' table by its ID, including associated user information. 
 * The result is returned as a JSON response. If the entry is not found, a 404 status code is returned 
 * with an error message. In case of an error, an error message is returned with HTTP status 400.
 * 
 * @async
 * @function get
 * @route {GET} /user_passwords_dictionary/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the user password dictionary entry.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
user_passwords_dictionaryController.get = async (req, res) => {
    try {
        const { id } = req.params;
        const user_passwords_dictionary = await user_passwords_dictionaryModel.findByPk(id, {
            include: {
                model: userModel,
                required: true
            }
        });
        if (user_passwords_dictionary) {
            res.json(user_passwords_dictionary);
        } else {
            res.status(404).send('user_passwords_dictionary not found');
        }
    } catch (error) {
        res.status(400).send('Error retrieving user_passwords_dictionary');
    }
}

/**
 * @description Updates a specific user password dictionary entry by its ID in the database.
 * 
 * This function uses Sequelize's `update` method to modify an existing user password dictionary 
 * entry in the 'user_passwords_dictionary' table by its ID. It takes the new data from the request body. 
 * If the operation is successful, the updated entry is returned as a JSON response. If the entry is not found, 
 * a 404 status code is returned with an error message. In case of an error, an error message is returned 
 * with HTTP status 400.
 * 
 * @async
 * @function update
 * @route {PUT} /user_passwords_dictionary/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the user password dictionary entry.
 * @param {Object} req.body - The body of the request containing the new data for the entry.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
user_passwords_dictionaryController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await user_passwords_dictionaryModel.update(req.body, {
            where: { id: id }
        });
        if (updated) {
            const updateduser_passwords_dictionary = await user_passwords_dictionaryModel.findByPk(id);
            res.json(updateduser_passwords_dictionary);
        } else {
            res.status(404).send('user_passwords_dictionary not found');
        }
    } catch (error) {
        res.status(400).send('Error updating user_passwords_dictionary');
    }
}

module.exports = user_passwords_dictionaryController;
