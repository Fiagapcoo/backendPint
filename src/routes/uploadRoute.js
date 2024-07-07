const express = require('express');
const router = express.Router();
const {validation} = require('../controllers/middlewareController');
const { upload_create, upload } = require('../controllers/uploadController');

router.post('/upload', validation, upload.single('image'), upload_create);

module.exports = router;