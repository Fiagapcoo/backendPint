const express = require('express');
const router = express.Router();

const { upload_create, upload } = require('../controllers/uploadController');

router.post('/upload', upload.single('image'), upload_create);

module.exports = router;