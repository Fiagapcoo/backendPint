const AlbumModel = require('../models/album');
const EventModel = require('../models/events');
const AreaModel = require('../models/area');

const AlbumsController = {};

/**
 * @description Creates a new album record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new album 
 * to the 'Albums' table. It takes the album data from the request body. 
 * If the operation is successful, a success message and the newly created 
 * album data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function createAlbum
 * @route {POST} /albums/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing album data.
 * @param {number} req.body.EVENT_ID - The ID of the event.
 * @param {number} req.body.AREA_ID - The ID of the area.
 * @param {string} req.body.TITLE - The title of the album.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
AlbumsController.createAlbum = async (req, res) => {
    const { EVENT_ID, AREA_ID, TITLE } = req.body;
    try {
        const newAlbum = await AlbumModel.create({
            EVENT_ID,
            AREA_ID,
            TITLE
        });
        res.status(201).json(newAlbum);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves all albums from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all albums 
 * from the 'Albums' table. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getAllAlbums
 * @route {GET} /albums/list
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
AlbumsController.getAllAlbums = async (req, res) => {
    try {
        const albums = await AlbumModel.findAll({
            include: [
                {
                    model: EventModel,
                    attributes: ['EVENT_ID']
                },
                {
                    model: AreaModel,
                    attributes: ['AREA_ID']
                }
            ]
        });
        res.status(200).json(albums);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves an album by ID from the database.
 * 
 * This function uses Sequelize's `findOne` method to fetch a specific album 
 * from the 'Albums' table by its ID. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getAlbumById
 * @route {GET} /albums/get/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the album.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
AlbumsController.getAlbumById = async (req, res) => {
    const { id } = req.params;
    try {
        const album = await AlbumModel.findOne({
            where: {
                ALBUM_ID: id
            },
            include: [
                {
                    model: EventModel,
                    attributes: ['EVENT_ID']
                },
                {
                    model: AreaModel,
                    attributes: ['AREA_ID']
                }
            ]
        });
        res.status(200).json(album);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Updates an existing album record in the database.
 * 
 * This function uses Sequelize's `update` method to modify an existing album 
 * in the 'Albums' table. It takes the album data from the request body 
 * and the ID of the album from the URL parameters. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function updateAlbum
 * @route {PUT} /albums/update/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the album.
 * @param {Object} req.body - The body of the request containing album data.
 * @param {number} req.body.EVENT_ID - The ID of the event.
 * @param {number} req.body.AREA_ID - The ID of the area.
 * @param {string} req.body.TITLE - The title of the album.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
AlbumsController.updateAlbum = async (req, res) => {
    const { id } = req.params;
    const { EVENT_ID, AREA_ID, TITLE } = req.body;
    try {
        await AlbumModel.update({
            EVENT_ID,
            AREA_ID,
            TITLE
        }, {
            where: {
                ALBUM_ID: id
            }
        });
        res.status(200).json({ message: 'Album updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Deletes an album record from the database.
 * 
 * This function uses Sequelize's `destroy` method to remove an album 
 * from the 'Albums' table by its ID. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function deleteAlbum
 * @route {DELETE} /albums/delete/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the album.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
AlbumsController.deleteAlbum = async (req, res) => {
    const { id } = req.params;
    try {
        await AlbumModel.destroy({
            where: {
                ALBUM_ID: id
            }
        });
        res.status(200).json({ message: 'Album deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = AlbumsController;
