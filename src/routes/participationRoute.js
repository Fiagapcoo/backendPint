const express = require('express');
const router = express.Router();

const ParticipationController = require('../controllers/participationController');

router.post('/create', ParticipationController.createParticipation);
router.get('/list', ParticipationController.getAllParticipations);
router.get('/get/:userId/:eventId', ParticipationController.getParticipationById);
router.delete('/delete/:userId/:eventId', ParticipationController.deleteParticipation);

module.exports = router;
