const UserAccountDetails = require('../models/user_account_details');
const User = require('../models/users'); // Ensure the User model is required if it's used in include
const user_account_detailsController = {};

/**
 * Get all user account details
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {Promise<void>}
 */
user_account_detailsController.getAllUserAccountDetails = async (req, res) => {
    try {
        const userAccountDetails = await UserAccountDetails.findAll({
            include: [{ model: User }]
        });
        res.status(200).json(userAccountDetails);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get user account details by user ID
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {Promise<void>}
 */
user_account_detailsController.getUserAccountDetailsById = async (req, res) => {
    try {
        const userAccountDetails = await UserAccountDetails.findOne({
            where: { USER_ID: req.params.id },
            include: [{ model: User }]
        });
        if (!userAccountDetails) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(userAccountDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




/**
 * Validate user account (set ACCOUNT_STATUS to true)
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @route PUT /user_account_details/validate/:id
 * @returns {Promise<void>}
 */
user_account_detailsController.validateUserAccount = async (req, res) => {
    const { id } = req.params;
    try {
        const userAccountDetails = await UserAccountDetails.findOne({
            where: { USER_ID: id }
        });
        if (!userAccountDetails) {
            return res.status(404).json({ message: 'User not found' });
        }
        userAccountDetails.ACCOUNT_STATUS = true;
        await userAccountDetails.save();
        res.status(200).json(userAccountDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Invalidate user account (set ACCOUNT_STATUS to false)
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @route PUT /user_account_details/restrict/:id
 * @returns {Promise<void>}
 */
user_account_detailsController.invalidate = async (req, res) => {
    const { id } = req.params;
    try {
        const userAccountDetails = await UserAccountDetails.findOne({
            where: { USER_ID: id }
        });
        if (!userAccountDetails) {
            return res.status(404).json({ message: 'User not found' });
        }
        userAccountDetails.ACCOUNT_STATUS = false;
        await userAccountDetails.save();
        res.status(200).json(userAccountDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Update user account details
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {Promise<void>}
 */
user_account_detailsController.updateUserAccountDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { ACCOUNT_STATUS, ACCOUNT_RESTRICTION } = req.body;
        const userAccountDetails = await UserAccountDetails.findOne({
            where: { USER_ID: id }
        });
        if (!userAccountDetails) {
            return res.status(404).json({ message: 'User not found' });
        }
        userAccountDetails.ACCOUNT_STATUS = ACCOUNT_STATUS;
        userAccountDetails.ACCOUNT_RESTRICTION = ACCOUNT_RESTRICTION;
        await userAccountDetails.save();
        res.status(200).json(userAccountDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = user_account_detailsController;

