const express = require('express');
const router = express.Router();
const {validation} = require('../controllers/jwt_middlewareController.js');
const controller = require('../controllers/mediaController.js');


router.post('/create-album', validation, controller.create_album);
router.post('/add-photo/:albumId/:publisherId', validation, controller.add_photograph);
router.get('/get-albums', validation, controller.get_albums);
module.exports = router;