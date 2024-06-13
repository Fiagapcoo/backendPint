const area_contentModel = require('../models/area_content');
const languageModel = require('../models/language');
const area_contentController = {};

area_contentController.getAll = async (req, res) => {
    const area_content = await area_contentModel.findAll({
        include: [languageModel]
    });
    res.json({ area_content });
}

area_contentController.getOne = async (req, res) => {
    const { id,  } = req.params;
    const area_content = await area_contentModel.findOne({
        where: {
            AREA_ID: id
        },
        include: [languageModel]
    });
    res.json({ area_content });
}

area_contentController.create = async (req, res) => {
    const { AREA_ID, LANGUAGE_ID, TRANSLATED_TITLE } = req.body;
    const area_content = await area_contentModel.create({
        AREA_ID,
        LANGUAGE_ID,
        TRANSLATED_TITLE
    });
    res.json({ area_content });
}

area_contentController.update = async (req, res) => {
    const { AREA_ID, LANGUAGE_ID,TRANSLATED_TITLE } = req.body;
    const area_content = await area_contentModel.update({
        TRANSLATED_TITLE
    }, {
        where: {
            AREA_ID,
            LANGUAGE_ID
        }
    });
    res.json({ area_content });
}

area_contentController.delete = async (req, res) => {
    const { id } = req.params;
    const area_content = await area_contentModel.destroy({
        where: {
            AREA_ID: id
        }
    });
    res.json({ area_content });
}

module.exports = area_contentController;