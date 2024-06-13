const AlbumModel = require('../models/album');
const EventModel = require('../models/events');
const AreaModel = require('../models/area');

const AlbumsController = {};

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
