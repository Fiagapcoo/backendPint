const AccPermissions = require('../models/acc_permissions');

const acc_permissionsController = {};


/**
 * @description Creates a new permission record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new permission 
 * to the 'AccPermissions' table. It takes the permission data from the request body. 
 * If the operation is successful, a success message and the newly created 
 * permission data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 400.
 * 
 * @async
 * @function create
 * @route {POST} /acc_permissions/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing permission data.
 * @param {string} req.body.RoleName - The name of the role.
 * @param {number} req.body.RoleLevel - The level of the role.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
acc_permissionsController.create = async (req, res) => {
    try {
        const {RoleName, RoleLevel } = req.body;
        const newPermission = await AccPermissions.create({
            RoleName,
            RoleLevel
        });
        res.json({ message: 'Permission created successfully!', permission: newPermission });
    } catch (error) {
        console.log(error);
        res.status(400).send('Error creating the permission');
    }
};


/**
 * @description Retrieves all permission records from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all permissions 
 * stored in the 'AccPermissions' table. If the operation is successful, 
 * the permission records are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 400.
 * 
 * @async
 * @function findAll
 * @route {GET} /acc_permissions/list
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
acc_permissionsController.findAll = async (req, res) => {
    try {
        const permissions = await AccPermissions.findAll();
        res.json(permissions);
    } catch (error) {
        res.status(400).send('Error retrieving permissions');
    }
};



/**
 * @description Retrieves a specific permission record from the database by its primary key (ID).
 * 
 * This function uses Sequelize's `findByPk` method to fetch a permission 
 * by its primary key. If the permission is found, the permission data is returned 
 * as a JSON response. If the permission is not found, a 404 error message is returned.
 * In case of an error, an error message is returned with HTTP status 400.
 * 
 * @async
 * @function findOne
 * @route {GET} /acc_permissions/get/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters of the request.
 * @param {string} req.params.id - The ID of the permission to retrieve.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
acc_permissionsController.findOne = async (req, res) => {
    try {
        const { id } = req.params;
        const permission = await AccPermissions.findByPk(id);
        if (permission) {
            res.json(permission);
        } else {
            res.status(404).send('Permission not found');
        }
    } catch (error) {
        res.status(400).send('Error retrieving the permission');
    }
};



/**
 * @description Updates a specific permission record in the database.
 * 
 * This function uses Sequelize's `update` method to update a permission 
 * by its primary key. If the permission is found and updated successfully,
 * the updated permission data is returned as a JSON response along with a 
 * success message. If the permission is not found, a 404 error message is returned.
 * In case of an error, an error message is returned with HTTP status 400.
 * 
 * @async
 * @function update
 * @route {PUT} /acc_permissions/update/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters of the request.
 * @param {string} req.params.id - The ID of the permission to update.
 * @param {Object} req.body - The body of the request containing permission data to update.
 * @param {string} req.body.RoleName - The name of the role.
 * @param {number} req.body.RoleLevel - The level of the role.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */

acc_permissionsController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { RoleName, RoleLevel } = req.body;
        const [updated] = await AccPermissions.update({
            RoleName,
            RoleLevel
        }, {
            where: { RoleID: id }
        });
        if (updated) {
            const updatedPermission = await AccPermissions.findByPk(id);
            res.json({ message: 'Permission updated successfully!', permission: updatedPermission });
        } else {
            res.status(404).send('Permission not found');
        }
    } catch (error) {
        res.status(400).send('Error updating the permission');
    }
};



module.exports = acc_permissionsController;
