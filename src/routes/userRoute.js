const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');

router.get('/list', userController.getAllUsers);
router.get('/get/:id', userController.getUserById);
router.post('/create', userController.createUser);
router.post('/login', userController.login);
router.put('/update/:id', userController.updateUser);


module.exports = router;
