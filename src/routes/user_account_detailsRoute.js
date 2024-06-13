const express = require('express');
const router = express.Router();
const userAccountDetailsController = require('../controllers/user_account_detailsController');


router.get('/list', userAccountDetailsController.getAllUserAccountDetails);
router.get('/get/:id', userAccountDetailsController.getUserAccountDetailsById);
router.put('/validate/:id', userAccountDetailsController.validateUserAccount);
router.put('/restrict/:id', userAccountDetailsController.invalidate);
router.put('/update/:id', userAccountDetailsController.updateUserAccountDetails);

module.exports = router;