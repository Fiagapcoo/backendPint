const User = require('../models/users');
const UserAccountDetails = require('../models/user_account_details');
const user_passwords_dictionary = require('../models/user_passwords_dictionary');
const sequelize = require('../models/db');
const userController = {};

/**
 * @description Retrieves all user records from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all users 
 * stored in the 'USERS' table. If the operation is successful, the user 
 * data is returned as a JSON response. In case of an error, an error 
 * message is returned with HTTP status 500.
 * 
 * @async
 * @function getAllUsers
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 * @route {GET} /user/list
 */
userController.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @description Retrieves a user record from the database by its primary key (ID).
 * 
 * This function uses Sequelize's `findByPk` method to fetch a user 
 * by its primary key. If the user is found, the user data is returned as a JSON response.
 * If the user is not found, a 404 error message is returned. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getUserById
 * @route {GET} /user/get/:id
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.id - The ID of the user to retrieve.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 * 
 */
userController.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @description Creates a new user along with their account details and password dictionary entry in the database.
 * 
 * This function uses Sequelize transactions to ensure atomicity when creating a new user, their account details, 
 * and password dictionary entry. It takes user data from the request body, and if all operations are successful, 
 * it commits the transaction and returns the newly created records as a JSON response. If any operation fails, 
 * it rolls back the transaction and returns an error message.
 * 
 * @async
 * @function createUser
 * @route {POST} /users
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing user data.
 * @param {string} req.body.firstNAME - The first name of the user.
 * @param {string} req.body.lastNAME - The last name of the user.
 * @param {string} req.body.EMAIL - The email address of the user.
 * @param {string} req.body.HASHED_PASSWORD - The hashed password of the user.
 * @param {string} [req.body.PROFILE_PIC] - The profile picture URL of the user.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
userController.createUser = async (req, res) => {
    const t = await sequelize.transaction(); // Start a transaction
    try {
        const { firstNAME, lastNAME, EMAIL, HASHED_PASSWORD, PROFILE_PIC } = req.body;
        
        const newUser = await User.create({
            firstNAME,
            lastNAME,
            EMAIL,
            HASHED_PASSWORD,
            PROFILE_PIC,
        }, { transaction: t });
        
        const newUserAccountDetails = await UserAccountDetails.create({
            USER_ID: newUser.USER_ID,
            ACCOUNT_STATUS: false,
            ACCOUNT_RESTRICTION: false
        }, { transaction: t });

        const newUserPasswordDictionary = await user_passwords_dictionary.create({
            USER_ID: newUser.USER_ID,
            HASHED_PASSWD: HASHED_PASSWORD,
            SALT : 'SALT'  // This is a placeholder for the salt value
        }, { transaction: t });
        
        await t.commit(); // Commit the transaction if all queries are successful
        
        res.status(201).json({ newUser, newUserAccountDetails, newUserPasswordDictionary });
    } catch (error) {
        await t.rollback(); // Rollback the transaction if any query fails
        res.status(500).json({ message: error.message });
    }
};

/**
 * @description Authenticates a user by checking their email and hashed password.
 * 
 * This function uses Sequelize's `findOne` method to fetch a user 
 * by their email and hashed password from the 'USERS' table. If the user 
 * is found, the user data is returned as a JSON response. If the user is 
 * not found, a 404 error message is returned. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function login
 * @route {POST} /user/login
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing user credentials.
 * @param {string} req.body.EMAIL - The email address of the user.
 * @param {string} req.body.HASHED_PASSWORD - The hashed password of the user.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
userController.login = async (req, res) => {
    try {
        const { EMAIL, HASHED_PASSWORD } = req.body;
        const user = await User.findOne({
            where: {
                EMAIL,
                HASHED_PASSWORD
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userAccountDetails = await UserAccountDetails.findOne({
            where: { USER_ID: user.USER_ID }
        });

        if (userAccountDetails.ACCOUNT_STATUS === false) {
            return res.status(401).json({message: 'Account not validated' });
        }

        if (user.RoleID == 1) {
            res.json({ admin: false, user });
        } else if (user.RoleID == 2 || user.RoleID == 3) {
            res.json({ admin: true, user });
        } else {
            res.status(404).json({ message: 'User role not recognized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/**
 * @description Updates an existing user record in the database.
 * 
 * This function uses Sequelize's `findByPk` method to fetch a user 
 * by its primary key. If the user is found, the user data is updated with 
 * the values provided in the request body. If a value is not provided, 
 * the existing value is retained. The updated user data is then saved and 
 * returned as a JSON response. If the user is not found, a 404 error message 
 * is returned. In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function updateUser
 * @route {PUT} /user/update/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing user data to update.
 * @param {string} req.body.EMPLOYEE_ID - The employee ID.
 * @param {string} req.body.firstNAME - The first name of the user.
 * @param {string} req.body.lastNAME - The last name of the user.
 * @param {string} req.body.EMAIL - The email address of the user.
 * @param {string} req.body.HASHED_PASSWORD - The hashed password of the user.
 * @param {string} req.body.PROFILE_PIC - The profile picture URL of the user.
 * @param {number} req.body.RoleID - The role ID of the user.
 * @param {boolean} req.body.VALIDATION - The validation status of the user.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
userController.updateUser = async (req, res) => {
    try {
        const { EMPLOYEE_ID, firstNAME, lastNAME, EMAIL, HASHED_PASSWORD, PROFILE_PIC, RoleID } = req.body;
        const user = await User.findByPk(req.params.id);
        if (user) {
            user.EMPLOYEE_ID = EMPLOYEE_ID || user.EMPLOYEE_ID;
            user.firstNAME = firstNAME || user.firstNAME;
            user.lastNAME = lastNAME || user.lastNAME;
            user.EMAIL = EMAIL || user.EMAIL;
            user.HASHED_PASSWORD = HASHED_PASSWORD || user.HASHED_PASSWORD;
            user.PROFILE_PIC = PROFILE_PIC || user.PROFILE_PIC;
            user.RoleID = RoleID || user.RoleID;
            await user.save();
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





module.exports = userController;