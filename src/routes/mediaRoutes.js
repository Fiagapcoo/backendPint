const express = require('express');
const router = express.Router();
const {validation} = require('../controllers/jwt_middlewareController.js');
const controller = require('../controllers/mediaController.js');


router.post('/create-album', validation, controller.create_album);
router.post('/add-photo/:albumId/:publisherId', validation, controller.add_photograph);
router.get('/get-albums', validation, controller.get_albums);
router.get('/get-album-photo/:photo_id', validation, controller.get_album_photo);
module.exports = router;