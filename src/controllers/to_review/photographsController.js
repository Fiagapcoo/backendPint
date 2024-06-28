const PhotographModel = require('../models/photographs');
const AlbumModel = require('../models/album');
const UserModel = require('../models/users');

const PhotographsController = {};

/**
 * @description Creates a new photograph record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new photograph 
 * to the 'Photographs' table. It takes the photograph data from the request body. 
 * If the operation is successful, a success message and the newly created 
 * photograph data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function createPhotograph
 * @route {POST} /photographs/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing photograph data.
 * @param {number} req.body.ALBUM_ID - The ID of the album.
 * @param {number} req.body.PUBLISHER_ID - The ID of the publisher.
 * @param {string} req.body.FILEPATH - The file path of the photograph.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
PhotographsController.createPhotograph = async (req, res) => {
    const { ALBUM_ID, PUBLISHER_ID, FILEPATH } = req.body;
    try {
        const newPhotograph = await PhotographModel.create({
            ALBUM_ID,
            PUBLISHER_ID,
            FILEPATH
        });
        res.status(201).json(newPhotograph);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves all photographs from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all photographs 
 * from the 'Photographs' table. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getAllPhotographs
 * @route {GET} /photographs
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
PhotographsController.getAllPhotographs = async (req, res) => {
    try {
        const photographs = await PhotographModel.findAll({
            include: [
                {
                    model: AlbumModel,
                    attributes: ['ALBUM_ID']
                },
                {
                    model: UserModel,
                    attributes: ['USER_ID']
                }
            ]
        });
        res.status(200).json(photographs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves a specific photograph by its ID from the database.
 * 
 * This function uses Sequelize's `findOne` method to fetch a specific photograph 
 * from the 'Photographs' table by its ID. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getPhotographById
 * @route {GET} /photographs/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the photograph.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
PhotographsController.getPhotographById = async (req, res) => {
    const { id } = req.params;
    try {
        const photograph = await PhotographModel.findOne({
            where: {
                PHOTO_ID: id
            },
            include: [
                {
                    model: AlbumModel,
                    attributes: ['ALBUM_ID']
                },
                {
                    model: UserModel,
                    attributes: ['USER_ID']
                }
            ]
        });
        res.status(200).json(photograph);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Updates an existing photograph record in the database.
 * 
 * This function uses Sequelize's `update` method to modify an existing photograph 
 * in the 'Photographs' table. It takes the photograph data from the request body 
 * and the ID of the photograph from the URL parameters. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function updatePhotograph
 * @route {PUT} /photographs/update/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the photograph.
 * @param {Object} req.body - The body of the request containing photograph data.
 * @param {number} req.body.ALBUM_ID - The ID of the album.
 * @param {number} req.body.PUBLISHER_ID - The ID of the publisher.
 * @param {string} req.body.FILEPATH - The file path of the photograph.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
PhotographsController.updatePhotograph = async (req, res) => {
    const { id } = req.params;
    const { ALBUM_ID, PUBLISHER_ID, FILEPATH } = req.body;
    try {
        await PhotographModel.update({
            ALBUM_ID,
            PUBLISHER_ID,
            FILEPATH
        }, {
            where: {
                PHOTO_ID: id
            }
        });
        res.status(200).json({ message: 'Photograph updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Deletes a photograph record from the database by its ID.
 * 
 * This function uses Sequelize's `destroy` method to remove a photograph 
 * from the 'Photographs' table by its ID. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function deletePhotograph
 * @route {DELETE} /photographs/delete/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the photograph.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
PhotographsController.deletePhotograph = async (req, res) => {
    const { id } = req.params;
    try {
        await PhotographModel.destroy({
            where: {
                PHOTO_ID: id
            }
        });
        res.status(200).json({ message: 'Photograph deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = PhotographsController;
