const express = require('express');
const router = express.Router();

const ScoresController = require('../controllers/scoresController');

router.post('/create', ScoresController.createScore);
router.get('/list', ScoresController.getAllScores);
router.get('/get/:id', ScoresController.getScoreById);
router.put('/update/:id', ScoresController.updateScore);
router.delete('/delete/:id', ScoresController.deleteScore);

module.exports = router;
