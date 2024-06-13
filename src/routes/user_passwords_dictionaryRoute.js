const user_passwords_dictionaryController = require('../controllers/user_passwords_dictionaryController');
const express = require('express');
const router = express.Router();


router.get('/list', user_passwords_dictionaryController.list);
router.get('/get/:id', user_passwords_dictionaryController.get);
router.put('/update/:id', user_passwords_dictionaryController.update);


module.exports = router;