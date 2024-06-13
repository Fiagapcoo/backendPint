const express = require('express');
const router = express.Router();
const userActionsLogController = require('../controllers/user_actions_logController');


router.post('/create', userActionsLogController.create);
router.get('/list', userActionsLogController.findAll);
router.get('/get/:id', userActionsLogController.findOne);
router.put('/update/:id', userActionsLogController.update);


module.exports = router;
