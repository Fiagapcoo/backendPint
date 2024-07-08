const express = require('express');
const {validation} = require("../controllers/jwt_middlewareController");
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/setup-password', validation, authController.setupPassword);
router.post('/change-password', validation, authController.setupPassword);
router.post('/login', authController.login_web);
router.post('/login_mobile', authController.login_mobile);
router.post('/token-test', authController.testjwt);
router.post('/validate-token', authController.validateToken);
router.get('/get-user-by-token', validation, authController.getUserByToken);
router.put('/update-last-access', validation, authController.updateLastAccess);

module.exports = router;
