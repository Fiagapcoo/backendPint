const express = require('express');
const router = express.Router();

const AnswersController = require('../controllers/answersController');

router.post('/create', AnswersController.createAnswer);
router.get('/list', AnswersController.getAllAnswers);
router.get('/get/:id', AnswersController.getAnswerById);
router.put('/update/:id', AnswersController.updateAnswer);
router.delete('/delete/:id', AnswersController.deleteAnswer);

module.exports = router;
