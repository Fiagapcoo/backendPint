const express = require('express');
const router = express.Router();

const LanguageController = require('../controllers/languageController');

router.get('/list', LanguageController.getLanguages);
router.get('/get/:id', LanguageController.getLanguage);
router.post('/create', LanguageController.createLanguage);
router.put('/update/:id', LanguageController.updateLanguage);
router.delete('/delete/:id', LanguageController.deleteLanguage);


module.exports = router;