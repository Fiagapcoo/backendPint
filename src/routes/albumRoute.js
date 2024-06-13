const express = require('express');
const router = express.Router();

const AlbumsController = require('../controllers/albumController');

router.post('/create', AlbumsController.createAlbum);
router.get('/list', AlbumsController.getAllAlbums);
router.get('/get/:id', AlbumsController.getAlbumById);
router.put('/update/:id', AlbumsController.updateAlbum);
router.delete('/delete/:id', AlbumsController.deleteAlbum);

module.exports = router;
