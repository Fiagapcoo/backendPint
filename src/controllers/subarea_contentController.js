const SubAreaContentModel = require('../models/subarea_content');
const LanguageModel = require('../models/language');

const subarea_contentController = {};

subarea_contentController.getAll = async (req, res) => {
    try {
        const subarea_content = await SubAreaContentModel.findAll({
            include: [LanguageModel]
        });
        res.json(subarea_content);
    } catch (error) {
        res.status(500).json({
            message: 'Error: ' + error
        });
    }
};

subarea_contentController.getById = async (req, res) => {
    try {
        const {id} = req.params;
        const subarea_content = await SubAreaContentModel.findOne({
            where: {
                SUB_AREA_ID: id
            },
            include: [LanguageModel]
        });
        res.json(subarea_content);
    } catch (error) {
        res.status(500).json({
            message: 'Error: ' + error
        });
    }
};

subarea_contentController.create = async (req, res) => {
    const { SUB_AREA_ID, LANGUAGE_ID, TRANSLATED_TITLE } = req.body;
    try {
        const subarea_content = await SubAreaContentModel.create({
            SUB_AREA_ID,
            LANGUAGE_ID,
            TRANSLATED_TITLE
        });
        res.json(subarea_content);
    } catch (error) {
        res.status(500).json({
            message: 'Error: ' + error
        });
    }
};

subarea_contentController.update = async (req, res) => {
    const { SUB_AREA_ID, LANGUAGE_ID, TRANSLATED_TITLE } = req.body;
    try {
        const subarea_content = await SubAreaContentModel.update({
            TRANSLATED_TITLE
        }, {
            where: {
                SUB_AREA_ID,
                LANGUAGE_ID
            }
        });
        res.json(subarea_content);
    } catch (error) {
        res.status(500).json({
            message: 'Error: ' + error
        });
    }
};

subarea_contentController.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const subarea_content = await SubAreaContentModel.destroy({
            where: {
                SUB_AREA_ID: id
            }
        });
        res.json(subarea_content);
    } catch (error) {
        res.status(500).json({
            message: 'Error: ' + error
        });
    }
};

module.exports = subarea_contentController;
