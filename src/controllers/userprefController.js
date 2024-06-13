const userPrefModel = require('../models/userpref');
const userModel = require('../models/users');
const languageModel = require('../models/language');

const userPrefController = {};

userPrefController.getAll = async (req, res) => {
    const userPrefs = await userPrefModel.findAll({
        include: [
            {
                model: userModel,
                as: 'User'
            },
            {
                model: languageModel,
                as: 'Language'
            }
        ]
    });
    res.json(userPrefs);
}

userPrefController.getById = async (req, res) => {
    const { id } = req.params;
    const userPref = await userPrefModel.findOne({
        where: {
            USER_ID: id
        },
        include: [
            {
                model: userModel,
                as: 'User'
            },
            {
                model: languageModel,
                as: 'Language'
            }
        ]
    });
    res.json(userPref);
}

userPrefController.create = async (req, res) => {
    const { USER_ID, AREAS, SUB_AREAS, ReceiveNotifications, LanguageID, AdditionalPreferences } = req.body;
    const newUserPref = await userPrefModel.create({
        USER_ID,
        AREAS,
        SUB_AREAS,
        ReceiveNotifications,
        LanguageID,
        AdditionalPreferences
    });
    res.json(newUserPref);
}

userPrefController.update = async (req, res) => {
    const { id } = req.params;
    const { AREAS, SUB_AREAS, ReceiveNotifications, LanguageID, AdditionalPreferences } = req.body;
    await userPrefModel.update({
        AREAS,
        SUB_AREAS,
        ReceiveNotifications,
        LanguageID,
        AdditionalPreferences
    }, {
        where: {
            USER_ID: id
        }
    });
    res.json({
        message: 'User preferences updated'
    });
}

userPrefController.delete = async (req, res) => {
    const { id } = req.params;
    await userPrefModel.destroy({
        where: {
            USER_ID: id
        }
    });
    res.json({
        message: 'User preferences deleted'
    });
}


module.exports = userPrefController;