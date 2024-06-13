const express = require('express');
const router = express.Router();
const acc_permissionsController = require('../controllers/acc_permissionsController');


router.post('/create', acc_permissionsController.create);
router.get('/list', acc_permissionsController.findAll);
router.get('/get/:id', acc_permissionsController.findOne);
router.put('update/:id', acc_permissionsController.update);


module.exports = router;
