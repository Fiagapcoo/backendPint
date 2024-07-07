const express = require('express');
const router = express.Router();
const {validation} = require('../controllers/middlewareController');
const controller = require('../controllers/mediaController.js');


router.post('/create-album', validation, controller.create_album);
router.post('/add-photo/:albumId/:publisherId', validation, controller.add_photograph);
module.exports = router;