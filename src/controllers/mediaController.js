const { spCreateAlbum, 
        spAddPhotograph, 
        spGetAlbums  } = require('../database/logic_objects/mediaProcedures');

const controllers = {};

controllers.create_album = async (req, res) => {
    const { eventId, subAreaId, title } = req.body; 
    console.log(req.query);
    try {
        await spCreateAlbum(eventId, subAreaId, title);
        res.status(201).json({success:true, message:'ALBUM created successfully.'});
    } catch (error) {
        res.status(500).json({success:false, message:'Error creating ALBUM: ' + error.message});
    }
};

controllers.add_photograph = async (req, res) => {
    const { albumId, publisherId } = req.params; 
    const {filePath} = req.body;
    console.log(req.query);
    try {
        await spAddPhotograph(albumId, publisherId, filePath);
        res.status(201).json({success:true, message:'Photograph added successfully.'});
    } catch (error) {
        res.status(500).json({success:false, message:'Error adding photograph: ' + error.message});
    }
};

controllers.get_albums = async (req, res) => {

    try {
        const albums = await spGetAlbums();
        res.status(200).json({success:true, albums});
    } catch (error) {
        res.status(500).json({success:false, message:'Error fetching albums: ' + error.message});
    }
};

module.exports = controllers;