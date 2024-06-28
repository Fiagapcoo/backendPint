const express = require('express');
const router = express.Router();
const controller = require('../controllers/mediaController.js');


router.post('/create-album', controller.create_album);
router.post('/add-photo/:albumId/:publisherId', controller.add_photograph);
module.exports = router;