const userPrefModel = require('../models/userpref');
const userModel = require('../models/users');
const languageModel = require('../models/language');

const userPrefController = {};

/**
 * @description Retrieves all user preferences from the database, including their associated user and language information.
 * 
 * This function uses Sequelize's `findAll` method to fetch all user preferences 
 * entries from the 'userPref' table, including associated user and language information. 
 * The result is returned as a JSON response.
 * 
 * @async
 * @function getAll
 * @route {GET} /userprefs
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
userPrefController.getAll = async (req, res) => {
    const userPrefs = await userPrefModel.findAll({
        include: [
            {
                model: userModel,
                as: 'User'
            },
            {
                model: languageModel,
                as: 'Language'
            }
        ]
    });
    res.json(userPrefs);
}

/**
 * @description Retrieves a specific user preference entry by its USER_ID from the database.
 * 
 * This function uses Sequelize's `findOne` method to fetch a specific user preference 
 * entry from the 'userPref' table by its USER_ID, including associated user and language information. 
 * The result is returned as a JSON response.
 * 
 * @async
 * @function getById
 * @route {GET} /userprefs/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The USER_ID of the user preference entry.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
userPrefController.getById = async (req, res) => {
    const { id } = req.params;
    const userPref = await userPrefModel.findOne({
        where: {
            USER_ID: id
        },
        include: [
            {
                model: userModel,
                as: 'User'
            },
            {
                model: languageModel,
                as: 'Language'
            }
        ]
    });
    res.json(userPref);
}

/**
 * @description Creates a new user preference record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new user preference 
 * to the 'userPref' table. It takes the user preference data from the request body. 
 * If the operation is successful, the newly created user preference data is returned as a JSON response.
 * 
 * @async
 * @function create
 * @route {POST} /userprefs
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing user preference data.
 * @param {number} req.body.USER_ID - The ID of the user.
 * @param {string} req.body.AREAS - The areas associated with the user preferences.
 * @param {string} req.body.SUB_AREAS - The sub-areas associated with the user preferences.
 * @param {boolean} req.body.ReceiveNotifications - The notification preference of the user.
 * @param {number} req.body.LanguageID - The preferred language ID of the user.
 * @param {string} req.body.AdditionalPreferences - Any additional preferences in JSON format.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
userPrefController.create = async (req, res) => {
    const { USER_ID, AREAS, SUB_AREAS, ReceiveNotifications, LanguageID, AdditionalPreferences } = req.body;
    const newUserPref = await userPrefModel.create({
        USER_ID,
        AREAS,
        SUB_AREAS,
        ReceiveNotifications,
        LanguageID,
        AdditionalPreferences
    });
    res.json(newUserPref);
}

/**
 * @description Updates a specific user preference entry by its USER_ID in the database.
 * 
 * This function uses Sequelize's `update` method to modify an existing user preference 
 * entry in the 'userPref' table by its USER_ID. It takes the new data from the request body. 
 * If the operation is successful, a success message is returned as a JSON response.
 * 
 * @async
 * @function update
 * @route {PUT} /userprefs/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The USER_ID of the user preference entry.
 * @param {Object} req.body - The body of the request containing the new data for the entry.
 * @param {string} [req.body.AREAS] - The updated areas associated with the user preferences.
 * @param {string} [req.body.SUB_AREAS] - The updated sub-areas associated with the user preferences.
 * @param {boolean} [req.body.ReceiveNotifications] - The updated notification preference of the user.
 * @param {number} [req.body.LanguageID] - The updated preferred language ID of the user.
 * @param {string} [req.body.AdditionalPreferences] - The updated additional preferences in JSON format.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
userPrefController.update = async (req, res) => {
    const { id } = req.params;
    const { AREAS, SUB_AREAS, ReceiveNotifications, LanguageID, AdditionalPreferences } = req.body;
    await userPrefModel.update({
        AREAS,
        SUB_AREAS,
        ReceiveNotifications,
        LanguageID,
        AdditionalPreferences
    }, {
        where: {
            USER_ID: id
        }
    });
    res.json({
        message: 'User preferences updated'
    });
}

/**
 * @description Deletes a specific user preference entry by its USER_ID from the database.
 * 
 * This function uses Sequelize's `destroy` method to remove an existing user preference 
 * entry from the 'userPref' table by its USER_ID. If the operation is successful, 
 * a success message is returned as a JSON response.
 * 
 * @async
 * @function delete
 * @route {DELETE} /userprefs/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The USER_ID of the user preference entry.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
userPrefController.delete = async (req, res) => {
    const { id } = req.params;
    await userPrefModel.destroy({
        where: {
            USER_ID: id
        }
    });
    res.json({
        message: 'User preferences deleted'
    });
}

module.exports = userPrefController;
