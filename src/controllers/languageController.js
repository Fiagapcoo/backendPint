const LanguageModel = require('../models/language');

const LanguageController = {};

LanguageController.getLanguages = async (req, res) => {
    const languages = await LanguageModel.findAll();
    res.json(languages);
}

LanguageController.getLanguage = async (req, res) => {
    const language = await LanguageModel.findByPk(req.params.id);
    res.json(language);
}

LanguageController.createLanguage = async (req, res) => {
    const language = await LanguageModel.create(req.body);
    res.json(language);
}

LanguageController.updateLanguage = async (req, res) => {
    const language = await LanguageModel.findByPk(req.params.id);
    await language.update(req.body);
    res.json(language);
}


LanguageController.deleteLanguage = async (req, res) => {
    const language = await LanguageModel.findByPk(req.params.id);
    await language.destroy();
    res.json({ deleted: true });
}


module.exports = LanguageController;