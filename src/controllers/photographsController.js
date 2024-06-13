const PhotographModel = require('../models/photographs');
const AlbumModel = require('../models/album');
const UserModel = require('../models/users');

const PhotographsController = {};

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
