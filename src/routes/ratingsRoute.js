const express = require('express');
const router = express.Router();

const RatingsController = require('../controllers/ratingsController');

router.post('/create', RatingsController.createRating);
router.get('/list', RatingsController.getAllRatings);
router.get('/get/:id', RatingsController.getRatingById);
router.put('/update/:id', RatingsController.updateRating);
router.delete('/delete/:id', RatingsController.deleteRating);

module.exports = router;
