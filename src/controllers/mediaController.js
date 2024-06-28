const { spCreateAlbum, 
        spAddPhotograph, 
          } = require('../database/logic_objects/mediaProcedures');

const controllers = {};

controllers.create_album = async (req, res) => {
    const { eventId, subAreaId, title } = req.query; 
    console.log(req.query);
    try {
        await spCreateAlbum(eventId, subAreaId, title);
        res.status(201).send('ALBUM created successfully.');
    } catch (error) {
        res.status(500).send('Error creating ALBUM: ' + error.message);
    }
};

controllers.add_photograph = async (req, res) => {
    const { albumId, publisherId } = req.param; 
    const {filePath} = req.body;
    console.log(req.query);
    try {
        await spAddPhotograph(albumId, publisherId, filePath);
        res.status(201).send('Photograph added successfully.');
    } catch (error) {
        res.status(500).send('Error adding photograph: ' + error.message);
    }
};

module.exports = controllers;